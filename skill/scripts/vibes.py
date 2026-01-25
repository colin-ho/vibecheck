#!/usr/bin/env python3
"""Generate VibeChecked URL from local stats.

Usage:
    python3 vibes.py              # Output URL with base stats only
    python3 vibes.py --json       # Output raw JSON bundle for analysis
    python3 vibes.py --persona TOKEN_TITAN --traits '["night-owl","methodical"]' --fun-facts '["You said fix 94 times"]'
    python3 vibes.py -v           # Verbose mode with warnings
"""

import argparse
import base64
import gzip
import json
import os
import re
import sys
from collections import Counter
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, Iterator

# Minimum Python version check
if sys.version_info < (3, 8):
    sys.exit("Error: Python 3.8 or higher required")

# Constants
BASE_URL = os.environ.get("WRAPPED_URL", "https://howsyourvibecoding.vercel.app")
CLAUDE_DIR = Path(os.environ.get("CLAUDE_DIR", Path.home() / ".claude"))
STATS_FILE = CLAUDE_DIR / "stats-cache.json"
PROJECTS_DIR = CLAUDE_DIR / "projects"

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "to", "of", "in", "for", "on",
    "with", "at", "by", "from", "as", "it", "its", "this", "that", "these", "those",
    "i", "me", "my", "we", "our", "you", "your", "he", "she", "they", "them", "their",
    "what", "which", "who", "whom", "how", "why", "when", "where", "if", "then", "else",
    "so", "not", "no", "yes", "up", "down", "out", "just", "like", "also", "only",
    "about", "into", "over", "after", "before", "between", "through", "during", "am",
    "been", "being", "some", "any", "all", "each", "every", "both", "few", "more",
    "most", "other", "such", "than", "too", "very", "now", "here", "there"
}

TOPIC_PATTERNS = {
    "debugging": r"\b(bug|error|fix|broken|crash|debug|issue|problem|fail|exception|stack|trace)\b",
    "frontend": r"\b(react|css|component|ui|style|html|dom|jsx|tsx|tailwind|frontend|button|form|modal)\b",
    "backend": r"\b(api|database|server|endpoint|rest|graphql|sql|backend|route|middleware|auth)\b",
    "devops": r"\b(deploy|docker|ci|build|kubernetes|aws|cloud|pipeline|terraform|nginx)\b",
    "ai": r"\b(model|train|prompt|llm|gpt|claude|ai|ml|embedding|vector|neural|token)\b",
    "testing": r"\b(test|spec|coverage|mock|jest|pytest|unit|integration|e2e|cypress)\b",
    "refactoring": r"\b(refactor|clean|improve|optimize|performance|simplify|restructure)\b",
}

COMMAND_WORDS = ["fix", "help", "make", "write", "add", "update", "create", "delete", "debug"]
SWEAR_WORDS = re.compile(r"\b(damn|crap|shit|fuck|wtf|hell|dammit)\b", re.I)
POLITE_WORDS = {
    "please": re.compile(r"\bplease\b", re.I),
    "thanks": re.compile(r"\b(thanks|thank you|thx)\b", re.I),
    "sorry": re.compile(r"\b(sorry|apologies)\b", re.I),
}

verbose = False


def warn(msg: str) -> None:
    """Print warning in verbose mode."""
    if verbose:
        print(f"Warning: {msg}", file=sys.stderr)


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
    """Stream all JSONL records from project files."""
    for path in iter_jsonl_files(projects_dir):
        try:
            for line in path.read_text().splitlines():
                if line.strip():
                    try:
                        yield json.loads(line)
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


def extract_user_prompts(projects_dir: Path) -> list[str]:
    """Extract all user message strings."""
    prompts = []
    for record in iter_jsonl_records(projects_dir):
        msg = record.get("message", {})
        if msg.get("role") == "user":
            content = msg.get("content")
            if isinstance(content, str) and content.strip():
                prompts.append(content)
    return prompts


def is_all_caps(text: str) -> bool:
    """Check if text is mostly uppercase (>70% of letters)."""
    if len(text) < 10:
        return False
    letters = [c for c in text if c.isalpha()]
    if not letters:
        return False
    upper = sum(1 for c in letters if c.isupper())
    return upper / len(letters) > 0.7


def analyze_prompts(prompts: list[str]) -> tuple[dict, dict, dict, dict]:
    """Analyze prompts in a single pass. Returns (samples, stats, word_analysis, topics)."""
    if not prompts:
        empty_samples = {"first": "", "shortest": "", "longest": "", "mostFrustrated": "", "samples": []}
        empty_stats = {"totalPrompts": 0, "averageLength": 0, "shortestLength": 0, "longestLength": 0, "allCapsPrompts": 0}
        empty_words = {
            "topWords": [], "topPhrases": [], "swearCount": 0, "politenessScore": 50,
            "commandRatio": 0, "questionMarkRatio": 0, "exclamationCount": 0,
            "pleaseCount": 0, "thanksCount": 0, "helpCount": 0, "fixCount": 0,
            "commandCounts": {w: 0 for w in COMMAND_WORDS}
        }
        empty_topics = {k: 0 for k in TOPIC_PATTERNS}
        return empty_samples, empty_stats, empty_words, empty_topics

    # Single pass analysis
    word_counter: Counter = Counter()
    bigram_counter: Counter = Counter()
    topic_counts = {k: 0 for k in TOPIC_PATTERNS}
    command_counts = {w: 0 for w in COMMAND_WORDS}
    polite_counts = {"please": 0, "thanks": 0, "sorry": 0}

    total_len = 0
    shortest_len = float("inf")
    shortest_text = ""
    longest_len = 0
    longest_text = ""
    first_prompt = prompts[0][:500] if prompts else ""
    frustrated_prompt = ""
    all_caps_count = 0
    swear_count = 0
    question_count = 0
    exclamation_count = 0

    for prompt in prompts:
        plen = len(prompt)
        total_len += plen

        # Shortest (min 5 chars)
        if 5 <= plen < shortest_len:
            shortest_len = plen
            shortest_text = prompt[:200]

        # Longest
        if plen > longest_len:
            longest_len = plen
            longest_text = prompt[:500]

        # All caps detection
        if is_all_caps(prompt):
            all_caps_count += 1
            if not frustrated_prompt:
                frustrated_prompt = prompt[:200]

        # Punctuation counts
        question_count += prompt.count("?")
        exclamation_count += prompt.count("!")

        # Swear words
        swear_count += len(SWEAR_WORDS.findall(prompt))

        # Polite words
        for key, pattern in POLITE_WORDS.items():
            polite_counts[key] += len(pattern.findall(prompt))

        # Topics
        lower_prompt = prompt.lower()
        for topic, pattern in TOPIC_PATTERNS.items():
            topic_counts[topic] += len(re.findall(pattern, lower_prompt))

        # Command words
        for cmd in COMMAND_WORDS:
            command_counts[cmd] += len(re.findall(rf"\b{cmd}\b", lower_prompt))

        # Word frequency (filter stopwords)
        words = re.findall(r"[a-z]{2,}", lower_prompt)
        word_counter.update(w for w in words if w not in STOPWORDS)

        # Bigrams
        if len(words) >= 2:
            for i in range(len(words) - 1):
                bigram_counter[(words[i], words[i + 1])] += 1

    # Build results
    n = len(prompts)
    avg_len = total_len // n if n else 0

    # Sample prompts (evenly distributed)
    step = max(1, n // 10)
    samples = [prompts[i][:200] for i in range(0, min(n, 10 * step), step)][:10]

    # Top words
    top_words = [{"word": w, "count": c} for w, c in word_counter.most_common(20)]

    # Top bigrams (min 3 occurrences)
    top_phrases = [
        {"phrase": f"{w1} {w2}", "count": c}
        for (w1, w2), c in bigram_counter.most_common(10)
        if c >= 3
    ]

    # Politeness score (0-100)
    politeness_markers = polite_counts["please"] + polite_counts["thanks"] + polite_counts["sorry"]
    politeness_score = min(100, round(politeness_markers / n * 100)) if n else 50

    # Command ratio
    total_commands = sum(command_counts.values())
    command_ratio = round(total_commands / n, 2) if n else 0
    question_ratio = round(question_count / n, 2) if n else 0

    prompt_samples = {
        "first": first_prompt,
        "shortest": shortest_text,
        "longest": longest_text,
        "mostFrustrated": frustrated_prompt,
        "samples": samples,
    }

    prompt_stats = {
        "totalPrompts": n,
        "averageLength": avg_len,
        "shortestLength": int(shortest_len) if shortest_len != float("inf") else 0,
        "longestLength": longest_len,
        "allCapsPrompts": all_caps_count,
    }

    word_analysis = {
        "topWords": top_words,
        "topPhrases": top_phrases,
        "swearCount": swear_count,
        "politenessScore": politeness_score,
        "commandRatio": command_ratio,
        "questionMarkRatio": question_ratio,
        "exclamationCount": exclamation_count,
        "pleaseCount": polite_counts["please"],
        "thanksCount": polite_counts["thanks"],
        "helpCount": command_counts["help"],
        "fixCount": command_counts["fix"],
        "commandCounts": command_counts,
    }

    return prompt_samples, prompt_stats, word_analysis, topic_counts


def longest_streak(dates: list[str]) -> int:
    """Calculate longest consecutive day streak."""
    if not dates:
        return 1
    try:
        parsed = sorted(set(date.fromisoformat(d) for d in dates))
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


def calculate_quirks(stats: dict, projects_dir: Path) -> dict:
    """Calculate behavioral quirks."""
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

    return {
        "interruptCount": interrupt_count,
        "abandonedSessions": abandoned_count,
        "lateNightSessions": late_night,
        "earlyMorningSessions": early_morning,
        "weekendPercentage": weekend_pct,
        "shortestSessionSeconds": 60,  # Minimum session length
        "longestStreakDays": streak,
    }


def build_bundle(
    base_stats: dict,
    tool_usage: dict,
    prompt_samples: dict,
    prompt_stats: dict,
    word_analysis: dict,
    topics: dict,
    quirks: dict,
    projects_dir: Path = PROJECTS_DIR,
) -> dict:
    """Assemble the final bundle JSON."""
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

    # Days active
    days_active = len(base_stats.get("dailyActivity", []))

    # Longest session
    longest_session = base_stats.get("longestSession", {})
    longest_minutes = longest_session.get("duration", 0) // 60000

    # Roast evidence
    samples_list = prompt_samples.get("samples", [])
    top_words_list = word_analysis.get("topWords", [])
    roast_evidence = {
        "samplePrompt": (samples_list[0] if samples_list else "")[:200],
        "topWord": top_words_list[0].get("word", "") if top_words_list else "",
        "topWordCount": top_words_list[0].get("count", 0) if top_words_list else 0,
    }

    return {
        "stats": {
            "totalSessions": base_stats.get("totalSessions", 0),
            "totalMessages": base_stats.get("totalMessages", 0),
            "totalTokens": {
                "input": input_tokens,
                "output": output_tokens,
                "cached": cached_tokens,
            },
            "totalToolCalls": sum(tool_usage.values()),
            "toolUsage": tool_usage,
            "modelUsage": model_usage,
            "hourCounts": hour_counts,
            "peakHour": peak_hour,
            "longestSessionMinutes": longest_minutes,
            "projectCount": project_count,
            "daysActive": days_active,
        },
        "promptSamples": prompt_samples,
        "promptStats": prompt_stats,
        "wordAnalysis": word_analysis,
        "topics": topics,
        "quirks": quirks,
        "roastEvidence": roast_evidence,
        "personaId": "",
        "traits": [],
        "promptingStyle": "",
        "communicationTone": "",
        "funFacts": [],
        "generatedAt": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


def encode_bundle(bundle: dict) -> str:
    """Compress and encode bundle to base64url."""
    json_bytes = json.dumps(bundle, separators=(",", ":")).encode()
    compressed = gzip.compress(json_bytes)
    encoded = base64.urlsafe_b64encode(compressed).decode()
    return encoded.rstrip("=")


def main() -> None:
    global verbose

    parser = argparse.ArgumentParser(description="Generate VibeChecked URL")
    parser.add_argument("--json", action="store_true", help="Output raw JSON bundle for analysis")
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose mode")
    # Claude-provided enrichment fields
    parser.add_argument("--persona", type=str, help="Persona ID (e.g., token-titan, midnight-architect)")
    parser.add_argument("--traits", type=str, help="JSON array of trait strings")
    parser.add_argument("--prompting-style", type=str, help="Description of prompting style")
    parser.add_argument("--communication-tone", type=str, help="Description of communication tone")
    parser.add_argument("--fun-facts", type=str, help="JSON array of fun fact strings")
    args = parser.parse_args()
    verbose = args.verbose

    # Load base stats
    base_stats = load_stats_cache(STATS_FILE)

    # Extract data from JSONL files
    tool_usage = extract_tools(PROJECTS_DIR)
    prompts = extract_user_prompts(PROJECTS_DIR)

    # Analyze prompts
    prompt_samples, prompt_stats, word_analysis, topics = analyze_prompts(prompts)

    # Calculate quirks
    quirks = calculate_quirks(base_stats, PROJECTS_DIR)

    # Build bundle
    bundle = build_bundle(
        base_stats, tool_usage, prompt_samples, prompt_stats, word_analysis, topics, quirks
    )

    # Apply Claude-provided enrichments
    if args.persona:
        bundle["personaId"] = args.persona
    if args.traits:
        try:
            bundle["traits"] = json.loads(args.traits)
        except json.JSONDecodeError:
            warn(f"Invalid JSON for --traits: {args.traits}")
    if args.prompting_style:
        bundle["promptingStyle"] = args.prompting_style
    if args.communication_tone:
        bundle["communicationTone"] = args.communication_tone
    if args.fun_facts:
        try:
            bundle["funFacts"] = json.loads(args.fun_facts)
        except json.JSONDecodeError:
            warn(f"Invalid JSON for --fun-facts: {args.fun_facts}")

    if args.json:
        print(json.dumps(bundle, indent=2))
    else:
        encoded = encode_bundle(bundle)
        print(f"{BASE_URL}/?d={encoded}")


if __name__ == "__main__":
    main()
