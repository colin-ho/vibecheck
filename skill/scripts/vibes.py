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
from concurrent.futures import ThreadPoolExecutor, as_completed
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

# Common English stopwords to filter out from word counts
STOPWORDS = frozenset(
    {
        "a",
        "an",
        "the",
        "and",
        "or",
        "but",
        "if",
        "then",
        "else",
        "when",
        "at",
        "by",
        "for",
        "with",
        "about",
        "against",
        "between",
        "into",
        "through",
        "during",
        "before",
        "after",
        "above",
        "below",
        "to",
        "from",
        "up",
        "down",
        "in",
        "out",
        "on",
        "off",
        "over",
        "under",
        "again",
        "further",
        "once",
        "here",
        "there",
        "where",
        "why",
        "how",
        "all",
        "each",
        "few",
        "more",
        "most",
        "other",
        "some",
        "such",
        "no",
        "nor",
        "not",
        "only",
        "own",
        "same",
        "so",
        "than",
        "too",
        "very",
        "can",
        "will",
        "just",
        "don",
        "should",
        "now",
        "i",
        "you",
        "he",
        "she",
        "it",
        "we",
        "they",
        "what",
        "which",
        "who",
        "whom",
        "this",
        "that",
        "these",
        "those",
        "am",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "being",
        "have",
        "has",
        "had",
        "having",
        "do",
        "does",
        "did",
        "doing",
        "would",
        "could",
        "ought",
        "im",
        "youre",
        "hes",
        "shes",
        "its",
        "theyre",
        "ive",
        "youve",
        "weve",
        "theyve",
        "id",
        "youd",
        "hed",
        "shed",
        "wed",
        "theyd",
        "ill",
        "youll",
        "hell",
        "shell",
        "well",
        "theyll",
        "isnt",
        "arent",
        "wasnt",
        "werent",
        "hasnt",
        "havent",
        "hadnt",
        "doesnt",
        "dont",
        "didnt",
        "wont",
        "wouldnt",
        "shant",
        "shouldnt",
        "cant",
        "cannot",
        "couldnt",
        "mustnt",
        "lets",
        "thats",
        "whos",
        "whats",
        "heres",
        "theres",
        "whens",
        "wheres",
        "whys",
        "hows",
        "because",
        "as",
        "until",
        "while",
        "of",
        "also",
        "like",
        "get",
        "got",
        "go",
        "going",
        "went",
        "come",
        "came",
        "make",
        "made",
        "take",
        "took",
        "see",
        "saw",
        "know",
        "knew",
        "think",
        "thought",
        "want",
        "need",
        "use",
        "used",
        "try",
        "tried",
        "let",
        "say",
        "said",
        "tell",
        "told",
        "ask",
        "asked",
        "work",
        "working",
        "thing",
        "things",
        "way",
        "ways",
        "time",
        "times",
        "year",
        "years",
        "day",
        "days",
        "man",
        "men",
        "woman",
        "women",
        "child",
        "children",
        "world",
        "life",
        "hand",
        "hands",
        "part",
        "parts",
        "place",
        "places",
        "case",
        "cases",
        "week",
        "weeks",
        "company",
        "system",
        "program",
        "question",
        "questions",
        "point",
        "points",
        "government",
        "number",
        "numbers",
        "night",
        "nights",
        "mr",
        "mrs",
        "ms",
        "home",
        "water",
        "room",
        "mother",
        "area",
        "areas",
        "money",
        "story",
        "stories",
        "fact",
        "facts",
        "month",
        "months",
        "lot",
        "lots",
        "right",
        "study",
        "book",
        "books",
        "eye",
        "eyes",
        "job",
        "jobs",
        "word",
        "words",
        "business",
        "issue",
        "issues",
        "side",
        "sides",
        "kind",
        "kinds",
        "head",
        "heads",
        "house",
        "houses",
        "service",
        "services",
        "friend",
        "friends",
        "father",
        "power",
        "hour",
        "hours",
        "game",
        "games",
        "line",
        "lines",
        "end",
        "ends",
        "member",
        "members",
        "law",
        "laws",
        "car",
        "cars",
        "city",
        "cities",
        "community",
        "name",
        "names",
        "ok",
        "okay",
        "yes",
        "maybe",
        "please",
        "thanks",
        "thank",
        "hi",
        "hello",
        "hey",
        "sure",
        "actually",
        "really",
        "probably",
        "definitely",
        "basically",
        "essentially",
        "currently",
        "usually",
        "generally",
        "simply",
        "exactly",
        "already",
        "still",
        "even",
        "though",
        "however",
        "therefore",
        "thus",
        "hence",
        "anyway",
        "anyways",
        "something",
        "anything",
        "everything",
        "nothing",
        "someone",
        "anyone",
        "everyone",
        "one",
        "ones",
        "two",
        "three",
        "first",
        "second",
        "new",
        "old",
        "good",
        "bad",
        "great",
        "little",
        "big",
        "small",
        "large",
        "long",
        "short",
        "high",
        "low",
        "different",
        "important",
        "able",
        "last",
        "next",
        "public",
        "possible",
        "real",
        "whole",
        "best",
        "better",
        "true",
        "false",
        "available",
    }
)

# Word tokenization pattern - matches word characters and common programming tokens
WORD_PATTERN = re.compile(r"[a-zA-Z][a-zA-Z0-9_-]*[a-zA-Z0-9]|[a-zA-Z]")


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
debug_mode = False
DEBUG_DIR = Path("/tmp/vibes-debug")


def warn(msg: str) -> None:
    """Print warning in verbose mode."""
    if verbose:
        print(f"Warning: {msg}", file=sys.stderr)


def error(msg: str) -> None:
    """Print error message (always visible)."""
    RED = "\033[31m"
    RESET = "\033[0m"
    print(f"{RED}✗{RESET} {msg}", file=sys.stderr)


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


class ParallelProgress:
    """Progress reporter for parallel batch execution."""

    FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    CYAN = "\033[36m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    DIM = "\033[2m"
    RESET = "\033[0m"
    CLEAR_LINE = "\033[2K\r"

    def __init__(self, batch_names: list[str]):
        self._batch_names = batch_names
        self._completed: set[str] = set()
        self._activity: dict[str, int] = {name: 0 for name in batch_names}
        self._lock = threading.Lock()
        self._stop = threading.Event()
        self._thread = None

    def _get_status(self) -> str:
        with self._lock:
            parts = []
            for name in self._batch_names:
                if name in self._completed:
                    parts.append(f"{self.GREEN}{name} ✓{self.RESET}")
                else:
                    count = self._activity.get(name, 0)
                    if count > 0:
                        parts.append(f"{self.YELLOW}{name}{self.RESET} {self.DIM}({count}){self.RESET}")
                    else:
                        parts.append(f"{self.YELLOW}{name}{self.RESET}")
            return " | ".join(parts) if parts else "Starting..."

    def _spin(self):
        frames = itertools.cycle(self.FRAMES)
        while not self._stop.is_set():
            frame = next(frames)
            status = self._get_status()
            sys.stderr.write(f"{self.CLEAR_LINE}{self.CYAN}{frame}{self.RESET} {status}")
            sys.stderr.flush()
            time.sleep(0.1)
        sys.stderr.write(self.CLEAR_LINE)
        sys.stderr.flush()

    def update(self, batch_name: str, count: int):
        with self._lock:
            self._activity[batch_name] = count

    def mark_complete(self, batch_name: str):
        with self._lock:
            self._completed.add(batch_name)

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


def compute_top_words(projects_dir: Path, top_n: int = 20) -> list[tuple[str, int]]:
    """Count word frequencies from all user prompts, excluding stopwords.

    Returns list of (word, count) tuples sorted by count descending.
    """
    word_counts: Counter = Counter()

    for _, prompt_text in extract_user_prompts_by_project(projects_dir):
        # Tokenize and normalize
        words = WORD_PATTERN.findall(prompt_text.lower())
        # Filter stopwords and very short words
        meaningful_words = [w for w in words if w not in STOPWORDS and len(w) > 1]
        word_counts.update(meaningful_words)

    return word_counts.most_common(top_n)


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


# Batch A: Memorable prompts and contrasts (reading-heavy, finds specific quotes)
PROMPT_BATCH_A = """Analyze the user's prompts to find memorable quotes and contrasts.

## User Prompts
{prompts_instruction}

## Your Task
Read through the prompts using Read/Grep/Glob tools. Find specific examples:

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

### 2. Contrasts (find actual examples)
- **shortestEffective**: Shortest prompt that still made sense (e.g., "fix typo")
- **longestRamble**: When they really went off (truncate to ~200 chars)
- **politestMoment**: Most courteous request (truncate to ~150 chars)
- **mostDemanding**: Most direct/demanding request (truncate to ~150 chars)

## Output Format
Write JSON to {output_file} with this structure (use Write tool):

{{"memorablePrompts": {{"funniest": {{"prompt": "...", "context": "..."}}, "mostFrustrated": {{"prompt": "...", "context": "..."}}, "mostAmbitious": {{"prompt": "...", "context": "..."}}, "biggestFacepalm": {{"prompt": "...", "context": "..."}}, "mostGrateful": {{"prompt": "...", "context": "..."}}, "weirdest": {{"prompt": "...", "context": "..."}}, "lateNightRamble": {{"prompt": "...", "context": "..."}}}}, "contrasts": {{"shortestEffective": "...", "longestRamble": "...", "politestMoment": "...", "mostDemanding": "..."}}}}

CONSTRAINTS:
- Only use Read, Grep, Glob, Write tools. Do NOT use Bash, Task, or any other tools.
- Do NOT create scripts or spawn subagents. Just read the files directly.
- Keep it simple: read prompts → analyze → write JSON output.

IMPORTANT: Use Write tool to write JSON to {output_file}. Do not output to stdout."""

# Batch B: Communication style, phrase analysis, obsessions - ROAST FOCUSED
PROMPT_BATCH_B = """Your job is to analyze this user's prompts and find things we can roast them for.

## User Prompts
{prompts_instruction}

## Pre-computed Top Words (for reference)
{top_words_json}

## Your Task
Read through the prompts using Read/Grep/Glob tools. Find the dirt:

### 1. Communication Style (find roastable patterns)
- **catchphrases**: 2-5 lazy phrases they repeat ("just fix", "make it work", "idk") - lazier = better for roasting
- **signatureOpeners**: 2-3 ways they start prompts - especially low-effort ones like "fix", "help"
- **verbalTics**: Filler words, hedging ("basically", "just", "like", "idk") - these reveal lazy habits
- **politenessLevel**: One of: "diplomatic", "direct", "demanding", "apologetic"
- **averagePromptLength**: Estimate average chars (< 50 = one-word-wonder, > 400 = essay-writer)
- **promptingEvolution**: One roasty sentence about their style

### 2. Phrase Analysis (find embarrassing patterns)
- **topPhrases**: 5 most common 2-3 word phrases (e.g., "just fix", "make it work", "I don't know")
- **dominantTopics**: Primary areas from: debugging, frontend, backend, devops, ai, testing, refactoring, deployment, database

### 3. Obsessions (what kept them up at night)
- **topics**: 4-5 technical areas they focus on most
- **frequentlyRevisited**: 4-5 problems they kept coming back to (bugs they couldn't fix? Ha!)
- **actualProjects**: 4-5 things they were building (infer from context)

### 4. Roast Indicators (the good stuff)
- **capsLockPrompts**: Count of prompts mostly in ALL CAPS (frustration detected!)
- **vaguePromptCount**: Count of short/vague prompts (<30 chars) - classic lazy behavior
- **undoRequests**: How many undo/revert/go back requests (indecisive much?)

## Output Format
Write JSON to {output_file} with this structure (use Write tool):

{{"communicationStyle": {{"catchphrases": ["..."], "signatureOpeners": ["..."], "verbalTics": ["..."], "politenessLevel": "direct", "averagePromptLength": 150, "promptingEvolution": "..."}}, "topPhrases": [{{"phrase": "...", "count": 0}}], "dominantTopics": ["debugging", "frontend"], "obsessions": {{"topics": ["..."], "frequentlyRevisited": ["..."], "actualProjects": ["..."]}}, "contrasts": {{"capsLockPrompts": 0, "vaguePromptCount": 0, "undoRequests": 0}}}}

CONSTRAINTS:
- Only use Read, Grep, Glob, Write tools. Do NOT use Bash, Task, or any other tools.
- Do NOT create scripts or spawn subagents. Just read the files directly.
- Keep it simple: read prompts → analyze → write JSON output.
- NOTE: topWords is pre-computed by Python - do NOT include it in your output.
- We're building a roast profile. Find their weaknesses!

IMPORTANT: Use Write tool to write JSON to {output_file}. Do not output to stdout."""

# Batch C: Persona, traits, style, tone, fun facts - ROAST EVERYONE
PROMPT_BATCH_C = """Your job is to ROAST this user based on their coding patterns. Every persona is a roast. Find their most mockable trait.

## Numeric Stats
{stats_json}

## User Prompts
{prompts_instruction}

## Your Task
Analyze stats and prompts. Pick the persona that roasts them HARDEST. There are NO compliments here.

### 1. Persona
Choose ONE persona. ALL personas roast the user. Find their weakness and exploit it for humor.

**Vibe Coders / Lazy Prompters:**
- `vibe-coder`: Vague prompts like "fix", "just make it work", expects AI to figure it out
- `one-word-wonder`: Extremely short prompts, no context, "fix" "help" "why"
- `yolo-delegator`: Accepts everything without reviewing, lets AI do all the thinking
- `plan-skipper`: Never reads plans, just says yes to everything
- `magic-words-believer`: Thinks "correctly" and "please make sure" are magic incantations

**Debug Obsessed:**
- `debug-addict`: Constantly debugging, "fix" is their most used word
- `bug-whisperer`: Attracts bugs like a magnet, constant errors
- `infinite-looper`: Fix one bug, create two more, endless cycles

**Essay Writers:**
- `essay-writer`: Prompts are 400+ chars, could write the code themselves
- `context-novelist`: Prompts are 800+ chars, provides entire life story as context
- `over-explainer`: Spends more time explaining than it would take to just code it

**Behavioral:**
- `3am-demon`: Codes late at night (lateNightSessions > 15 or >20% night usage)
- `squirrel-brain`: Interrupts constantly, abandons sessions, can't focus
- `caps-lock-commander`: TYPES IN ALL CAPS, clearly frustrated
- `polite-menace`: Suspiciously polite while everything is on fire
- `undo-enthusiast`: "Actually wait go back", constant mind-changing
- `copy-paste-warrior`: Pastes code without understanding it

**Tool/Model:**
- `bash-berserker`: Over 50% Bash usage, lives in terminal
- `opus-maximalist`: Uses Opus for everything, even trivial tasks
- `context-amnesiac`: Very low cache rate, paying full price repeatedly

**Domain Struggles:**
- `css-casualty`: Struggles with CSS, centering divs, flexbox
- `regex-refugee`: Regex questions that never work
- `git-disaster`: Git history is a crime scene

**Other Roasts:**
- `refactor-addict`: Can't stop refactoring working code
- `yolo-deployer`: Ships without tests, straight to production
- `deadline-demon`: Only productive under deadline pressure
- `code-roulette`: Tries random things until something works (fallback roast)

**High-Usage Roasts (for heavy users - still roasts!):**
- `token-burner`: Over 2M total tokens - "Anthropic's favorite customer"
- `tool-hoarder`: Uses 8+ different tools - "Jack of all tools, master of none"
- `over-engineer`: Uses custom MCP tools - "Why use 1 tool when you can build 12?"
- `tryhard`: High cache rate AND efficient prompts - "Optimized prompts but not life choices"

### 2. Traits
3-5 keyword traits. Roasty ones like: "accepting" (accepts plans without reading), "delegating" (lazy), "repetitive" (same bugs), "copy-paster", "chaotic", "indecisive", etc.

### 3. Prompting Style
One savage sentence describing their prompting style

### 4. Communication Tone
One savage sentence describing their communication tone

### 5. Fun Facts
3-5 specific, number-backed ROASTS. Be merciless but playful:
- "You said 'fix' 847 times. Have you considered writing code that works?"
- "Your 3AM sessions: when bad decisions are made."
- "Token bill: enough to fund a small country."

## Output Format
Write JSON to {output_file} with this structure (use Write tool):

{{"persona": "persona-id", "traits": ["trait1", "trait2", "trait3"], "promptingStyle": "description", "communicationTone": "description", "funFacts": ["Fact 1", "Fact 2", "Fact 3"]}}

CONSTRAINTS:
- Only use Read, Grep, Glob, Write tools. Do NOT use Bash, Task, or any other tools.
- Do NOT create scripts or spawn subagents. Just read the files directly.
- Keep it simple: read prompts → analyze → write JSON output.
- ROAST EVERYONE. Be playfully savage. No compliments. Find the dirt.

IMPORTANT: Use Write tool to write JSON to {output_file}. Do not output to stdout."""

PROMPTS_DIR = Path("/tmp/vibes-prompts")
OUTPUT_FILE = Path("/tmp/vibes-enrichment.json")
PROMPTS_PER_CHUNK = 500


def write_prompts_to_files(projects_dir: Path, show_progress: bool = True) -> tuple[int, int]:
    """Write prompts to temp files organized by project. Returns (total_prompts, total_files)."""
    # Clean up any existing directory
    if PROMPTS_DIR.exists():
        shutil.rmtree(PROMPTS_DIR)
    PROMPTS_DIR.mkdir(parents=True)

    # Group prompts by project with progress updates
    project_prompts: dict[str, list[str]] = {}
    prompt_count = 0
    for project_name, prompt_text in extract_user_prompts_by_project(projects_dir):
        if project_name not in project_prompts:
            project_prompts[project_name] = []
        project_prompts[project_name].append(prompt_text)
        prompt_count += 1
        if show_progress and prompt_count % 500 == 0:
            sys.stderr.write(f"\033[2K\r\033[36m→\033[0m Extracted {prompt_count} prompts...")
            sys.stderr.flush()

    if show_progress and prompt_count > 0:
        sys.stderr.write("\033[2K\r")
        sys.stderr.flush()

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


def run_claude_batch(
    batch_id: str,
    prompt: str,
    output_file: Path,
    progress: ParallelProgress | None = None,
) -> tuple[dict | None, str | None]:
    """Run a single Claude batch and return (result, error_message)."""
    # Clean up any existing output file
    if output_file.exists():
        output_file.unlink()

    # Set up debug file if debug mode enabled
    debug_file = None
    if debug_mode:
        DEBUG_DIR.mkdir(parents=True, exist_ok=True)
        debug_file = open(DEBUG_DIR / f"{batch_id.lower()}-stream.jsonl", "w")

    try:
        process = subprocess.Popen(
            [
                "claude",
                "--print",
                "--output-format",
                "stream-json",
                "--verbose",
                "--model",
                "haiku",
                "--tools",
                "Read,Grep,Glob,Write",
                "--add-dir",
                str(PROMPTS_DIR),
                "--dangerously-skip-permissions",
                "-p",
                prompt,
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,  # Suppress Claude's stderr, we show our own progress
            text=True,
            stdin=subprocess.DEVNULL,
        )

        # Consume stream-json events, counting for progress
        event_count = 0
        for line in process.stdout:
            if line.strip():
                event_count += 1
                if progress:
                    progress.update(batch_id, event_count)
                if debug_file:
                    debug_file.write(line)
                    debug_file.flush()

        process.wait(timeout=90)  # 90s timeout per batch

        # Mark complete
        if progress:
            progress.mark_complete(batch_id)

        # Check return code
        if process.returncode != 0:
            return None, f"Batch {batch_id}: Exit code {process.returncode}"

        # Read the output file
        if output_file.exists():
            try:
                return json.loads(output_file.read_text()), None
            except json.JSONDecodeError as e:
                return None, f"Batch {batch_id}: Failed to parse JSON: {e}"
        else:
            return None, f"Batch {batch_id}: Claude did not write output file"

    except subprocess.TimeoutExpired:
        process.kill()
        if progress:
            progress.mark_complete(batch_id)
        return None, f"Batch {batch_id}: Timed out after 90s"
    except Exception as e:
        if progress:
            progress.mark_complete(batch_id)
        return None, f"Batch {batch_id}: {e}"
    finally:
        if debug_file:
            debug_file.close()
        if output_file.exists():
            output_file.unlink()


def merge_batch_results(results: list[dict | None]) -> dict:
    """Merge results from all batches into a single enrichment dict."""
    merged: dict = {"insights": {}}

    for result in results:
        if not result:
            continue

        # Batch A keys (go into insights)
        if "memorablePrompts" in result:
            merged["insights"]["memorablePrompts"] = result["memorablePrompts"]
        if "contrasts" in result:
            merged["insights"]["contrasts"] = result["contrasts"]

        # Batch B keys (go into insights) - note: topWords computed by Python, not Claude
        if "communicationStyle" in result:
            merged["insights"]["communicationStyle"] = result["communicationStyle"]
        if "topPhrases" in result:
            merged["insights"]["topPhrases"] = result["topPhrases"]
        if "dominantTopics" in result:
            merged["insights"]["dominantTopics"] = result["dominantTopics"]
        if "obsessions" in result:
            merged["insights"]["obsessions"] = result["obsessions"]

        # Batch C keys (top-level)
        for key in ["persona", "traits", "promptingStyle", "communicationTone", "funFacts"]:
            if key in result:
                merged[key] = result[key]

    return merged


def call_claude_for_enrichment(
    bundle: AnonymousBundle,
    projects_dir: Path,
    top_words: list[tuple[str, int]] | None = None,
) -> dict | None:
    """Call Claude CLI to analyze stats in parallel batches."""
    if not shutil.which("claude"):
        error("Claude CLI not found in PATH")
        return None

    # Write prompts to temp files with progress
    progress("Extracting prompts...")
    total_prompts, total_files = write_prompts_to_files(projects_dir, show_progress=True)
    progress(f"Prepared {total_prompts} prompts in {total_files} files", done=True)

    prompts_instruction = f"""All {total_prompts} prompts are saved in {PROMPTS_DIR}/ across {total_files} files.
Files are named: project-{{hash}}-chunk-{{n}}.txt (one file per project, chunked at {PROMPTS_PER_CHUNK} prompts).
Use Read tool to read them. Use Grep to search for patterns. Explore thoroughly."""

    stats_json = bundle.model_dump_json(by_alias=True, indent=2)

    # Format top words for Claude context
    if top_words:
        top_words_json = json.dumps([{"word": w, "count": c} for w, c in top_words], indent=2)
    else:
        top_words_json = "[]"

    # Define the three batches
    batches = [
        (
            "Quotes",
            PROMPT_BATCH_A.format(
                prompts_instruction=prompts_instruction,
                output_file=Path("/tmp/vibes-quotes.json"),
            ),
            Path("/tmp/vibes-quotes.json"),
        ),
        (
            "Style",
            PROMPT_BATCH_B.format(
                prompts_instruction=prompts_instruction,
                top_words_json=top_words_json,
                output_file=Path("/tmp/vibes-style.json"),
            ),
            Path("/tmp/vibes-style.json"),
        ),
        (
            "Persona",
            PROMPT_BATCH_C.format(
                stats_json=stats_json,
                prompts_instruction=prompts_instruction,
                output_file=Path("/tmp/vibes-persona.json"),
            ),
            Path("/tmp/vibes-persona.json"),
        ),
    ]

    # Start progress reporter
    progress_reporter = ParallelProgress([b[0] for b in batches])
    progress_reporter.start()

    errors: list[str] = []

    try:
        # Run batches in parallel
        results: list[dict | None] = [None, None, None]

        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = {
                executor.submit(run_claude_batch, batch_id, prompt, output_file, progress_reporter): idx
                for idx, (batch_id, prompt, output_file) in enumerate(batches)
            }

            for future in as_completed(futures):
                idx = futures[future]
                try:
                    result, err = future.result()
                    results[idx] = result
                    if err:
                        errors.append(err)
                except Exception as e:
                    errors.append(f"Batch {batches[idx][0]} failed: {e}")

        progress_reporter.stop()

        # Report any errors
        if errors:
            for err in errors:
                error(err)

        # Check if we got any successful results
        if all(r is None for r in results):
            return None

        progress("Analysis complete", done=True)

        # Merge results
        merged = merge_batch_results(results)

        # Check if we got meaningful results
        if not merged.get("persona") and not merged.get("insights"):
            error("No meaningful results from any batch")
            return None

        return merged

    except Exception as e:
        progress_reporter.stop()
        error(f"Error during parallel enrichment: {e}")
        return None
    finally:
        # Cleanup temp files
        if PROMPTS_DIR.exists():
            shutil.rmtree(PROMPTS_DIR)
        for _, _, output_file in batches:
            if output_file.exists():
                output_file.unlink()


def main() -> None:
    global verbose, debug_mode

    parser = argparse.ArgumentParser(description="Generate VibeChecked URL")
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose mode")
    parser.add_argument("--debug", action="store_true", help="Save stream-json output to /tmp/vibes-debug/")
    parser.add_argument("--stats-only", action="store_true", help="Output raw stats JSON without Claude analysis")
    args = parser.parse_args()
    verbose = args.verbose
    debug_mode = args.debug

    if debug_mode:
        progress(f"Debug mode: stream output will be saved to {DEBUG_DIR}/")

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

    # Compute top words from prompts (deterministic)
    progress("Analyzing word frequencies...")
    top_words = compute_top_words(PROJECTS_DIR, top_n=20)
    progress(f"Found {len(top_words)} top words", done=True)

    # Build bundle with numeric stats only
    progress("Building bundle...")
    bundle = build_bundle(base_stats, tool_usage, quirks)
    progress("Bundle built", done=True)

    # Stats-only mode: output raw JSON and exit
    if args.stats_only:
        print(bundle.model_dump_json(by_alias=True, indent=2))
        return

    # Call Claude for enrichment (required) - has its own progress message
    enrichment = call_claude_for_enrichment(bundle, PROJECTS_DIR, top_words=top_words)

    if not enrichment:
        sys.exit("Error: Claude CLI failed. Use --stats-only for raw stats.")

    # Apply enrichment to bundle (use 'or' to handle both missing keys and null values)
    bundle.personaId = enrichment.get("persona") or ""
    bundle.traits = enrichment.get("traits") or []
    bundle.promptingStyle = enrichment.get("promptingStyle") or ""
    bundle.communicationTone = enrichment.get("communicationTone") or ""
    bundle.funFacts = enrichment.get("funFacts") or []

    # Build insights (Python-computed topWords always included, Claude fields if available)
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

    # Python-computed top words (accurate counts, always included)
    top_words_typed = [WordCount(word=w, count=c) for w, c in top_words] if top_words else None

    # Initialize Claude-provided fields
    memorable = None
    comm_style = None
    obsessions = None
    contrasts = None
    top_phrases_typed = None
    dominant_topics = None

    # Apply Claude insights if present
    if "insights" in enrichment:
        raw_insights = enrichment["insights"]

        # Build MemorablePrompts
        if "memorablePrompts" in raw_insights:
            mp = raw_insights["memorablePrompts"]

            def valid_prompt(key: str) -> PromptWithContext | None:
                """Only create PromptWithContext if the prompt field is valid."""
                if mp.get(key) and mp[key].get("prompt"):
                    return PromptWithContext(**mp[key])
                return None

            memorable = MemorablePrompts(
                funniest=valid_prompt("funniest"),
                mostFrustrated=valid_prompt("mostFrustrated"),
                mostAmbitious=valid_prompt("mostAmbitious"),
                biggestFacepalm=valid_prompt("biggestFacepalm"),
                mostGrateful=valid_prompt("mostGrateful"),
                weirdest=valid_prompt("weirdest"),
                lateNightRamble=valid_prompt("lateNightRamble"),
            )

        # Build CommunicationStyle
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
        if "obsessions" in raw_insights:
            obs = raw_insights["obsessions"]
            obsessions = Obsessions(
                topics=obs.get("topics"),
                frequentlyRevisited=obs.get("frequentlyRevisited"),
                actualProjects=obs.get("actualProjects"),
            )

        # Build Contrasts
        if "contrasts" in raw_insights:
            con = raw_insights["contrasts"]
            contrasts = Contrasts(
                shortestEffective=con.get("shortestEffective"),
                longestRamble=con.get("longestRamble"),
                politestMoment=con.get("politestMoment"),
                mostDemanding=con.get("mostDemanding"),
            )

        # Build phrase counts from Claude (Claude still analyzes phrases)
        if "topPhrases" in raw_insights:
            top_phrases_typed = [
                PhraseCount(phrase=p["phrase"], count=p["count"])
                for p in raw_insights["topPhrases"]
                if p.get("phrase") and p.get("count") is not None
            ]

        dominant_topics = raw_insights.get("dominantTopics")

    bundle.insights = Insights(
        memorablePrompts=memorable,
        communicationStyle=comm_style,
        obsessions=obsessions,
        contrasts=contrasts,
        topWords=top_words_typed,
        topPhrases=top_phrases_typed,
        dominantTopics=dominant_topics,
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
