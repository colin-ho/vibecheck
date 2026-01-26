#!/usr/bin/env python3
"""Generate VibeChecked URL from local stats.

Usage:
    python3 vibes.py              # Generate URL (calls Claude for analysis)
    python3 vibes.py --stats-only # Output raw stats JSON without Claude
    python3 vibes.py -v           # Verbose mode with warnings
"""

import argparse
import base64
import gzip
import itertools
import json
import os
import re
import shutil
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Iterator

from bundle_types import (
    AnonymousBundle,
    DailyActivity,
    Quirks,
    Stats,
    TokenCounts,
)

# Constants
BASE_URL = os.environ.get("WRAPPED_URL", "https://howsyourvibecoding.vercel.app")
CLAUDE_DIR = Path(os.environ.get("CLAUDE_DIR", Path.home() / ".claude"))
STATS_FILE = CLAUDE_DIR / "stats-cache.json"
PROJECTS_DIR = CLAUDE_DIR / "projects"

# Pattern to identify system-injected messages (not real user input)
SYSTEM_TAG_PATTERN = re.compile(
    r"^<(local-command-caveat|command-name|command-message|command-args|"
    r"local-command-stdout|system-reminder|task-notification)>"
)

verbose = False


def warn(msg: str) -> None:
    """Print warning in verbose mode."""
    if verbose:
        print(f"Warning: {msg}", file=sys.stderr)


def progress(msg: str, done: bool = False) -> None:
    """Print colored progress message."""
    GREEN = "\033[32m"
    CYAN = "\033[36m"
    RESET = "\033[0m"
    if done:
        print(f"{GREEN}✓{RESET} {msg}", file=sys.stderr)
    else:
        print(f"{CYAN}→{RESET} {msg}", file=sys.stderr)


class Spinner:
    """Animated spinner with word rotator."""

    FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    WORDS = ["Thinking", "Tinkering", "Fermenting", "Pondering", "Concocting", "Brewing", "Vibing", "Scheming"]
    # ANSI colors
    CYAN = "\033[36m"
    MAGENTA = "\033[35m"
    RESET = "\033[0m"
    CLEAR_LINE = "\033[2K\r"

    def __init__(self):
        self._stop = threading.Event()
        self._thread = None

    def _spin(self):
        frames = itertools.cycle(self.FRAMES)
        words = itertools.cycle(self.WORDS)
        word = next(words)
        word_counter = 0
        while not self._stop.is_set():
            frame = next(frames)
            sys.stderr.write(f"{self.CLEAR_LINE}{self.CYAN}{frame}{self.RESET} {self.MAGENTA}{word}...{self.RESET}")
            sys.stderr.flush()
            word_counter += 1
            if word_counter >= 8:  # Change word every ~0.8s
                word = next(words)
                word_counter = 0
            time.sleep(0.1)
        sys.stderr.write(self.CLEAR_LINE)
        sys.stderr.flush()

    def start(self):
        self._thread = threading.Thread(target=self._spin, daemon=True)
        self._thread.start()

    def stop(self):
        self._stop.set()
        if self._thread:
            self._thread.join()


def load_stats_cache(path: Path) -> dict:
    """Load and validate stats-cache.json."""
    if not path.exists():
        sys.exit(f"Error: No stats found at {path}\nUse Claude Code for a while first.")
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError as e:
        sys.exit(f"Error: Invalid JSON in {path}: {e}")


def iter_jsonl_files(projects_dir: Path) -> Iterator[Path]:
    """Yield all JSONL files, excluding subagents."""
    if not projects_dir.exists():
        return
    for path in projects_dir.rglob("*.jsonl"):
        if "subagents" not in path.parts:
            yield path


def iter_jsonl_records(projects_dir: Path) -> Iterator[dict]:
    """Stream all JSONL records from project files, excluding metadata records."""
    for path in iter_jsonl_files(projects_dir):
        try:
            for line in path.read_text().splitlines():
                if line.strip():
                    try:
                        record = json.loads(line)
                        # Skip file history snapshots (no message content)
                        if record.get("type") == "file-history-snapshot":
                            continue
                        yield record
                    except json.JSONDecodeError:
                        warn(f"Malformed JSON line in {path}")
        except Exception as e:
            warn(f"Error reading {path}: {e}")


def extract_tools(projects_dir: Path) -> dict[str, int]:
    """Count tool usage from all session files."""
    counts: Counter = Counter()
    for record in iter_jsonl_records(projects_dir):
        content = record.get("message", {}).get("content")
        if isinstance(content, list):
            for item in content:
                if isinstance(item, dict) and item.get("type") == "tool_use":
                    name = item.get("name", "")
                    if name:
                        counts[name] += 1
    return dict(counts.most_common())


def extract_user_prompts_by_project(projects_dir: Path) -> Iterator[tuple[str, str]]:
    """Extract user prompts grouped by project. Yields (project_name, prompt) tuples."""
    if not projects_dir.exists():
        return

    for jsonl_path in iter_jsonl_files(projects_dir):
        # Extract project name from path: projects_dir / project_hash / ...
        try:
            project_name = jsonl_path.relative_to(projects_dir).parts[0]
        except (ValueError, IndexError):
            project_name = "unknown"

        try:
            for line in jsonl_path.read_text().splitlines():
                if not line.strip():
                    continue
                try:
                    record = json.loads(line)
                    if record.get("type") == "file-history-snapshot":
                        continue
                    if record.get("isMeta"):
                        continue
                    msg = record.get("message", {})
                    if msg.get("role") == "user":
                        content = msg.get("content")
                        if isinstance(content, str) and content.strip():
                            if not SYSTEM_TAG_PATTERN.match(content.strip()):
                                yield (project_name, content)
                except json.JSONDecodeError:
                    warn(f"Malformed JSON line in {jsonl_path}")
        except Exception as e:
            warn(f"Error reading {jsonl_path}: {e}")


def longest_streak(dates: list[str]) -> int:
    """Calculate longest consecutive day streak."""
    if not dates:
        return 1
    try:
        parsed = sorted({date.fromisoformat(d) for d in dates})
    except ValueError:
        return 1
    if len(parsed) <= 1:
        return 1

    streak = max_streak = 1
    for i in range(1, len(parsed)):
        if parsed[i] - parsed[i - 1] == timedelta(days=1):
            streak += 1
            max_streak = max(max_streak, streak)
        else:
            streak = 1
    return max_streak


def weekend_percentage(dates: list[str]) -> int:
    """Calculate percentage of activity on weekends."""
    if not dates:
        return 0
    try:
        parsed = [date.fromisoformat(d) for d in dates]
    except ValueError:
        return 0
    weekends = sum(1 for d in parsed if d.weekday() >= 5)
    return round(weekends / len(parsed) * 100)


def calculate_quirks(stats: dict, projects_dir: Path) -> Quirks:
    """Calculate behavioral quirks (time-based, not text-based)."""
    hour_counts = stats.get("hourCounts", {})

    # Late night: 10PM-4AM
    late_hours = ["22", "23", "0", "1", "2", "3", "4"]
    late_night = sum(hour_counts.get(h, 0) for h in late_hours)

    # Early morning: 5AM-8AM
    early_hours = ["5", "6", "7", "8"]
    early_morning = sum(hour_counts.get(h, 0) for h in early_hours)

    # Get dates from dailyActivity
    daily = stats.get("dailyActivity", [])
    dates = [d.get("date") for d in daily if d.get("date")]

    # Calculate streak and weekend %
    streak = longest_streak(dates)
    weekend_pct = weekend_percentage(dates)

    # Count interrupted/abandoned sessions
    interrupt_count = 0
    abandoned_count = 0

    for path in iter_jsonl_files(projects_dir):
        try:
            records = [json.loads(line) for line in path.read_text().splitlines() if line.strip()]
            user_msgs = [r for r in records if r.get("message", {}).get("role") == "user"]
            if len(user_msgs) <= 1:
                abandoned_count += 1

            for r in records:
                stop = r.get("message", {}).get("stop_reason", "")
                if stop and stop not in ("end_turn", "tool_use"):
                    if any(x in stop.lower() for x in ("interrupt", "cancel", "stop")):
                        interrupt_count += 1
        except Exception:
            pass

    return Quirks(
        interruptCount=interrupt_count,
        abandonedSessions=abandoned_count,
        lateNightSessions=late_night,
        earlyMorningSessions=early_morning,
        weekendPercentage=weekend_pct,
        shortestSessionSeconds=60,  # Minimum session length
        longestStreakDays=streak,
    )


def build_bundle(
    base_stats: dict,
    tool_usage: dict[str, int],
    quirks: Quirks,
    projects_dir: Path = PROJECTS_DIR,
) -> AnonymousBundle:
    """Assemble the bundle with numeric stats only. Claude will add insights."""
    # Calculate token totals from model usage
    model_usage_raw = base_stats.get("modelUsage", {})
    input_tokens = sum(v.get("inputTokens", 0) for v in model_usage_raw.values())
    output_tokens = sum(v.get("outputTokens", 0) for v in model_usage_raw.values())
    cached_tokens = sum(v.get("cacheReadInputTokens", 0) for v in model_usage_raw.values())

    # Normalize model names and aggregate
    model_usage: dict[str, int] = {}
    for key, value in model_usage_raw.items():
        total = value.get("inputTokens", 0) + value.get("outputTokens", 0)
        if "opus" in key:
            model_usage["opus"] = model_usage.get("opus", 0) + total
        elif "sonnet" in key:
            model_usage["sonnet"] = model_usage.get("sonnet", 0) + total
        elif "haiku" in key:
            model_usage["haiku"] = model_usage.get("haiku", 0) + total
        else:
            model_usage[key] = model_usage.get(key, 0) + total

    # Hour counts as array
    hour_counts_dict = base_stats.get("hourCounts", {})
    hour_counts = [hour_counts_dict.get(str(h), 0) for h in range(24)]

    # Peak hour
    peak_hour = 12
    if hour_counts_dict:
        peak_hour = int(max(hour_counts_dict, key=lambda k: hour_counts_dict[k]))

    # Project count
    project_count = 0
    if projects_dir.exists():
        project_count = sum(1 for p in projects_dir.iterdir() if p.is_dir())

    # Days active with full date list
    daily_activity = base_stats.get("dailyActivity", [])
    days_active = len(daily_activity)
    active_dates = [
        {"date": d.get("date"), "sessions": d.get("sessionCount", 1)} for d in daily_activity if d.get("date")
    ]

    # Longest session
    longest_session = base_stats.get("longestSession", {})
    longest_minutes = longest_session.get("duration", 0) // 60000

    stats = Stats(
        totalSessions=base_stats.get("totalSessions", 0),
        totalMessages=base_stats.get("totalMessages", 0),
        totalTokens=TokenCounts(
            input=input_tokens,
            output=output_tokens,
            cached=cached_tokens,
        ),
        totalToolCalls=sum(tool_usage.values()),
        toolUsage=tool_usage,
        modelUsage=model_usage,
        hourCounts=hour_counts,
        peakHour=peak_hour,
        longestSessionMinutes=longest_minutes,
        projectCount=project_count,
        daysActive=days_active,
        activeDates=[DailyActivity(date=d["date"], sessions=d["sessions"]) for d in active_dates],
    )

    return AnonymousBundle(
        stats=stats,
        quirks=quirks,
        insights=None,  # Claude will populate this
        personaId="",
        traits=[],
        promptingStyle="",
        communicationTone="",
        funFacts=[],
        generatedAt=datetime.now(timezone.utc),
    )


def encode_bundle(bundle: AnonymousBundle) -> str:
    """Compress and encode bundle to base64url."""
    json_str = bundle.model_dump_json(by_alias=True)
    compressed = gzip.compress(json_str.encode())
    encoded = base64.urlsafe_b64encode(compressed).decode()
    return encoded.rstrip("=")


def upload_bundle(bundle: AnonymousBundle) -> str | None:
    """Upload bundle to server and return short ID."""
    try:
        data = bundle.model_dump_json(by_alias=True).encode("utf-8")
        req = urllib.request.Request(
            f"{BASE_URL}/api/store",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                result = json.loads(response.read().decode("utf-8"))
                return result.get("id")
    except urllib.error.URLError as e:
        warn(f"Failed to upload bundle: {e}")
    except Exception as e:
        warn(f"Unexpected error uploading bundle: {e}")
    return None


ENRICHMENT_PROMPT = """Analyze this user's Claude Code usage and generate rich insights from their prompts.

## Numeric Stats (from stats-cache.json)
{stats_json}

## User Prompts
{prompts_instruction}

## Your Task

Read through ALL the user's prompts using Read/Grep/Glob tools on the prompt files.
Extract meaningful insights about their communication style and behavior.

### 1. Memorable Prompts (find actual quotes, truncate to ~150 chars)
Find examples for as many of these categories as you can:
- **funniest**: Most amusing/entertaining request
- **mostFrustrated**: When they were clearly annoyed (caps, swearing, exasperation)
- **mostAmbitious**: Biggest/most complex ask
- **biggestFacepalm**: When they realized they made a dumb mistake ("oh wait", "nevermind", "I'm an idiot")
- **mostGrateful**: When they were happiest with results
- **weirdest**: Most unusual or unexpected request
- **lateNightRamble**: Incoherent/rambling prompt (if any exist)

For each, include a brief "context" explaining why you picked it.

### 2. Communication Style
- **catchphrases**: 2-5 unique phrases they repeat often
- **signatureOpeners**: 2-3 ways they typically start prompts ("Hey Claude", "Can you", etc.)
- **verbalTics**: Filler words, hedging patterns ("basically", "just", "like")
- **politenessLevel**: One of: "diplomatic", "direct", "demanding", "apologetic"
- **promptingEvolution**: One sentence about how their style changed over time (if noticeable)

### 3. Obsessions
- **topics**: 3-5 technical areas they focus on most
- **frequentlyRevisited**: 2-3 problems they kept coming back to
- **actualProjects**: 2-4 things they were actually building (infer from context)

### 4. Contrasts (find actual examples)
- **shortestEffective**: Shortest prompt that still made sense (e.g., "fix typo")
- **longestRamble**: When they really went off (truncate to ~200 chars)
- **politestMoment**: Most courteous request (truncate to ~150 chars)
- **mostDemanding**: Most direct/demanding request (truncate to ~150 chars)

### 5. Word Analysis
- **topWords**: 20 most meaningful words (exclude common stopwords like "the", "is", "code", "file")
- **topPhrases**: 5 most common meaningful 2-3 word phrases
- **dominantTopics**: Primary areas from: debugging, frontend, backend, devops, ai, testing, refactoring

### 6. Persona
Choose ONE based on stats AND prompt style:

**Legendary** (exceptional stats):
- `token-titan`: Over 1M total tokens
- `prompt-whisperer`: High cache rate (>40%), efficient prompting
- `tool-master`: 6+ different tools used extensively
- `mcp-pioneer`: Uses custom MCP tools

**Lifestyle** (usage patterns):
- `midnight-architect`: High lateNightSessions (>20)
- `dawn-warrior`: High earlyMorningSessions (>10)
- `project-nomad`: projectCount > 15
- `deep-focus-monk`: longestSessionMinutes > 180
- `weekend-warrior`: weekendPercentage > 40

**Personality** (from prompts):
- `the-perfectionist`: Lots of refactoring, cleanup, optimization requests
- `the-explorer`: Many questions, Read tool dominant, curious style
- `the-speedrunner`: Short terse prompts, fast iterations
- `the-diplomat`: Very polite, lots of "please" and "thanks"
- `the-commander`: Direct/demanding style, imperative commands

**Roast** (quirky patterns):
- `bash-berserker`: Bash >50% of tool usage
- `opus-maximalist`: Opus dominant in modelUsage
- `context-amnesiac`: Cache rate <15%
- `agent-interrupter`: High interruptCount

### 7. Traits
3-5 keyword traits that describe this user (e.g., "night-owl", "verbose", "impatient")

### 8. Prompting Style
One sentence describing their prompting style

### 9. Communication Tone
One sentence describing their communication tone

### 10. Fun Facts
3-5 specific, number-backed observations (e.g., "You said 'please' 847 times")

## Output Format

Write a JSON file to {output_file} with this structure (use the Write tool):

{{"insights": {{"memorablePrompts": {{"funniest": {{"prompt": "...", "context": "..."}}, "mostFrustrated": {{"prompt": "...", "context": "..."}}, "mostAmbitious": {{"prompt": "...", "context": "..."}}, "biggestFacepalm": {{"prompt": "...", "context": "..."}}, "mostGrateful": {{"prompt": "...", "context": "..."}}, "weirdest": {{"prompt": "...", "context": "..."}}, "lateNightRamble": {{"prompt": "...", "context": "..."}}}}, "communicationStyle": {{"catchphrases": ["..."], "signatureOpeners": ["..."], "verbalTics": ["..."], "politenessLevel": "direct", "promptingEvolution": "..."}}, "obsessions": {{"topics": ["..."], "frequentlyRevisited": ["..."], "actualProjects": ["..."]}}, "contrasts": {{"shortestEffective": "...", "longestRamble": "...", "politestMoment": "...", "mostDemanding": "..."}}, "topWords": [{{"word": "...", "count": 0}}], "topPhrases": [{{"phrase": "...", "count": 0}}], "dominantTopics": ["debugging", "frontend"]}}, "persona": "persona-id", "traits": ["trait1", "trait2", "trait3"], "promptingStyle": "description", "communicationTone": "description", "funFacts": ["Fact 1", "Fact 2", "Fact 3"]}}

IMPORTANT: Use the Write tool to write the JSON to {output_file}. Do not output the JSON to stdout."""

PROMPTS_DIR = Path("/tmp/vibes-prompts")
OUTPUT_FILE = Path("/tmp/vibes-enrichment.json")
PROMPTS_PER_CHUNK = 500


def write_prompts_to_files(projects_dir: Path) -> tuple[int, int]:
    """Write prompts to temp files organized by project. Returns (total_prompts, total_files)."""
    # Clean up any existing directory
    if PROMPTS_DIR.exists():
        shutil.rmtree(PROMPTS_DIR)
    PROMPTS_DIR.mkdir(parents=True)

    # Group prompts by project
    project_prompts: dict[str, list[str]] = {}
    for project_name, prompt_text in extract_user_prompts_by_project(projects_dir):
        if project_name not in project_prompts:
            project_prompts[project_name] = []
        project_prompts[project_name].append(prompt_text)

    total_prompts = 0
    total_files = 0

    for project_name, prompts_list in project_prompts.items():
        # Sanitize project name for filename (first 8 chars of hash + readable suffix if available)
        safe_name = project_name[:20].replace("/", "-").replace("\\", "-")

        # Chunk prompts
        for chunk_idx, start in enumerate(range(0, len(prompts_list), PROMPTS_PER_CHUNK), 1):
            chunk = prompts_list[start : start + PROMPTS_PER_CHUNK]
            total_prompts += len(chunk)
            total_files += 1

            # Filename: project-{hash}-chunk-{n}.txt
            filename = f"project-{safe_name}-chunk-{chunk_idx}.txt"
            filepath = PROMPTS_DIR / filename

            # Write prompts separated by ---
            filepath.write_text("\n\n---\n\n".join(chunk))

    return total_prompts, total_files


def call_claude_for_enrichment(bundle: AnonymousBundle, projects_dir: Path) -> dict | None:
    """Call Claude CLI to analyze stats and return enrichment data."""
    if not shutil.which("claude"):
        warn("Claude CLI not found in PATH")
        return None

    # Clean up any existing output file
    if OUTPUT_FILE.exists():
        OUTPUT_FILE.unlink()

    # Write prompts to temp files organized by project
    total_prompts, total_files = write_prompts_to_files(projects_dir)

    prompts_instruction = f"""All {total_prompts} prompts are saved in {PROMPTS_DIR}/ across {total_files} files.
Files are named: project-{{hash}}-chunk-{{n}}.txt (one file per project, chunked at {PROMPTS_PER_CHUNK} prompts).
Use Read tool to read them. Use Grep to search for patterns. Explore thoroughly."""

    prompt = ENRICHMENT_PROMPT.format(
        stats_json=bundle.model_dump_json(by_alias=True, indent=2),
        prompts_instruction=prompts_instruction,
        output_file=OUTPUT_FILE,
    )

    try:
        spinner = Spinner()
        spinner.start()

        process = subprocess.Popen(
            ["claude", "--print", "--model", "haiku", "--allowedTools", "Read,Grep,Glob,Write", "-p", prompt],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            stdin=subprocess.DEVNULL,
        )

        # Consume stdout silently (don't display Claude's work)
        process.stdout.read()
        process.wait(timeout=120)  # Increased timeout for thorough analysis

        spinner.stop()
        progress("Analysis complete", done=True)

        # Read the output file
        if OUTPUT_FILE.exists():
            try:
                return json.loads(OUTPUT_FILE.read_text())
            except json.JSONDecodeError as e:
                warn(f"Failed to parse Claude's JSON output: {e}")
                return None
        else:
            warn("Claude did not write output file")
            return None

    except subprocess.TimeoutExpired:
        spinner.stop()
        process.kill()
        warn("Claude CLI timed out")
        return None
    except Exception as e:
        spinner.stop()
        warn(f"Error calling Claude CLI: {e}")
        return None
    finally:
        # Cleanup temp files
        if PROMPTS_DIR.exists():
            shutil.rmtree(PROMPTS_DIR)
        if OUTPUT_FILE.exists():
            OUTPUT_FILE.unlink()


def main() -> None:
    global verbose

    parser = argparse.ArgumentParser(description="Generate VibeChecked URL")
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose mode")
    parser.add_argument("--stats-only", action="store_true", help="Output raw stats JSON without Claude analysis")
    args = parser.parse_args()
    verbose = args.verbose

    # Load base stats
    progress("Loading stats...")
    base_stats = load_stats_cache(STATS_FILE)
    progress("Stats loaded", done=True)

    # Extract tool usage from JSONL files
    progress("Extracting session data...")
    tool_usage = extract_tools(PROJECTS_DIR)
    progress("Session data extracted", done=True)

    # Calculate time-based quirks
    progress("Calculating quirks...")
    quirks = calculate_quirks(base_stats, PROJECTS_DIR)
    progress("Quirks calculated", done=True)

    # Build bundle with numeric stats only
    progress("Building bundle...")
    bundle = build_bundle(base_stats, tool_usage, quirks)
    progress("Bundle built", done=True)

    # Stats-only mode: output raw JSON and exit
    if args.stats_only:
        print(bundle.model_dump_json(by_alias=True, indent=2))
        return

    # Call Claude for enrichment (required) - has its own progress message
    enrichment = call_claude_for_enrichment(bundle, PROJECTS_DIR)

    if not enrichment:
        sys.exit("Error: Claude CLI failed. Use --stats-only for raw stats.")

    # Apply enrichment to bundle
    bundle.personaId = enrichment.get("persona", "")
    bundle.traits = enrichment.get("traits", [])
    bundle.promptingStyle = enrichment.get("promptingStyle", "")
    bundle.communicationTone = enrichment.get("communicationTone", "")
    bundle.funFacts = enrichment.get("funFacts", [])

    # Apply insights if present
    if "insights" in enrichment:
        from bundle_types import (
            CommunicationStyle,
            Contrasts,
            Insights,
            MemorablePrompts,
            Obsessions,
            PhraseCount,
            PolitenessLevel,
            PromptWithContext,
            WordCount,
        )

        raw_insights = enrichment["insights"]

        # Build MemorablePrompts
        memorable = None
        if "memorablePrompts" in raw_insights:
            mp = raw_insights["memorablePrompts"]
            memorable = MemorablePrompts(
                funniest=PromptWithContext(**mp["funniest"]) if mp.get("funniest") else None,
                mostFrustrated=PromptWithContext(**mp["mostFrustrated"]) if mp.get("mostFrustrated") else None,
                mostAmbitious=PromptWithContext(**mp["mostAmbitious"]) if mp.get("mostAmbitious") else None,
                biggestFacepalm=PromptWithContext(**mp["biggestFacepalm"]) if mp.get("biggestFacepalm") else None,
                mostGrateful=PromptWithContext(**mp["mostGrateful"]) if mp.get("mostGrateful") else None,
                weirdest=PromptWithContext(**mp["weirdest"]) if mp.get("weirdest") else None,
                lateNightRamble=PromptWithContext(**mp["lateNightRamble"]) if mp.get("lateNightRamble") else None,
            )

        # Build CommunicationStyle
        comm_style = None
        if "communicationStyle" in raw_insights:
            cs = raw_insights["communicationStyle"]
            politeness = None
            if cs.get("politenessLevel"):
                try:
                    politeness = PolitenessLevel(cs["politenessLevel"])
                except ValueError:
                    pass
            comm_style = CommunicationStyle(
                catchphrases=cs.get("catchphrases"),
                signatureOpeners=cs.get("signatureOpeners"),
                verbalTics=cs.get("verbalTics"),
                politenessLevel=politeness,
                promptingEvolution=cs.get("promptingEvolution"),
            )

        # Build Obsessions
        obsessions = None
        if "obsessions" in raw_insights:
            obs = raw_insights["obsessions"]
            obsessions = Obsessions(
                topics=obs.get("topics"),
                frequentlyRevisited=obs.get("frequentlyRevisited"),
                actualProjects=obs.get("actualProjects"),
            )

        # Build Contrasts
        contrasts = None
        if "contrasts" in raw_insights:
            con = raw_insights["contrasts"]
            contrasts = Contrasts(
                shortestEffective=con.get("shortestEffective"),
                longestRamble=con.get("longestRamble"),
                politestMoment=con.get("politestMoment"),
                mostDemanding=con.get("mostDemanding"),
            )

        # Build word/phrase counts
        top_words = None
        if "topWords" in raw_insights:
            top_words = [WordCount(word=w["word"], count=w["count"]) for w in raw_insights["topWords"]]

        top_phrases = None
        if "topPhrases" in raw_insights:
            top_phrases = [PhraseCount(phrase=p["phrase"], count=p["count"]) for p in raw_insights["topPhrases"]]

        bundle.insights = Insights(
            memorablePrompts=memorable,
            communicationStyle=comm_style,
            obsessions=obsessions,
            contrasts=contrasts,
            topWords=top_words,
            topPhrases=top_phrases,
            dominantTopics=raw_insights.get("dominantTopics"),
        )

    # Upload to server for short URL
    progress("Uploading...")
    bundle_id = upload_bundle(bundle)
    if bundle_id:
        progress("Upload complete", done=True)
        print(f"{BASE_URL}/vibes?id={bundle_id}")
    else:
        # Fall back to encoded URL if upload fails
        warn("Upload failed, falling back to encoded URL")
        encoded = encode_bundle(bundle)
        print(f"{BASE_URL}/vibes?d={encoded}")


if __name__ == "__main__":
    main()
