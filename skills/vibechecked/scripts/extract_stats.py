#!/usr/bin/env python3
"""Extract Claude Code usage stats for VibeChecked.

Reads local stats and session data, outputs JSON to stdout.
No external dependencies - stdlib only.

Usage:
    python3 extract_stats.py                          # Extract stats + write prompts
    python3 extract_stats.py --prompts-dir /tmp/vibes  # Custom prompts directory
    python3 extract_stats.py --claude-dir ~/.claude     # Custom claude directory
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, Iterator, List, Tuple

# Common English stopwords to filter out from word counts
STOPWORDS = frozenset(
    {
        "a", "an", "the", "and", "or", "but", "if", "then", "else", "when",
        "at", "by", "for", "with", "about", "against", "between", "into",
        "through", "during", "before", "after", "above", "below", "to",
        "from", "up", "down", "in", "out", "on", "off", "over", "under",
        "again", "further", "once", "here", "there", "where", "why", "how",
        "all", "each", "few", "more", "most", "other", "some", "such", "no",
        "nor", "not", "only", "own", "same", "so", "than", "too", "very",
        "can", "will", "just", "don", "should", "now", "i", "you", "he",
        "she", "it", "we", "they", "what", "which", "who", "whom", "this",
        "that", "these", "those", "am", "is", "are", "was", "were", "be",
        "been", "being", "have", "has", "had", "having", "do", "does", "did",
        "doing", "would", "could", "ought", "im", "youre", "hes", "shes",
        "its", "theyre", "ive", "youve", "weve", "theyve", "id", "youd",
        "hed", "shed", "wed", "theyd", "ill", "youll", "hell", "shell",
        "well", "theyll", "isnt", "arent", "wasnt", "werent", "hasnt",
        "havent", "hadnt", "doesnt", "dont", "didnt", "wont", "wouldnt",
        "shant", "shouldnt", "cant", "cannot", "couldnt", "mustnt", "lets",
        "thats", "whos", "whats", "heres", "theres", "whens", "wheres",
        "whys", "hows", "because", "as", "until", "while", "of", "also",
        "like", "get", "got", "go", "going", "went", "come", "came", "make",
        "made", "take", "took", "see", "saw", "know", "knew", "think",
        "thought", "want", "need", "use", "used", "try", "tried", "let",
        "say", "said", "tell", "told", "ask", "asked", "work", "working",
        "thing", "things", "way", "ways", "time", "times", "year", "years",
        "day", "days", "man", "men", "woman", "women", "child", "children",
        "world", "life", "hand", "hands", "part", "parts", "place", "places",
        "case", "cases", "week", "weeks", "company", "system", "program",
        "question", "questions", "point", "points", "government", "number",
        "numbers", "night", "nights", "mr", "mrs", "ms", "home", "water",
        "room", "mother", "area", "areas", "money", "story", "stories",
        "fact", "facts", "month", "months", "lot", "lots", "right", "study",
        "book", "books", "eye", "eyes", "job", "jobs", "word", "words",
        "business", "issue", "issues", "side", "sides", "kind", "kinds",
        "head", "heads", "house", "houses", "service", "services", "friend",
        "friends", "father", "power", "hour", "hours", "game", "games",
        "line", "lines", "end", "ends", "member", "members", "law", "laws",
        "car", "cars", "city", "cities", "community", "name", "names", "ok",
        "okay", "yes", "maybe", "please", "thanks", "thank", "hi", "hello",
        "hey", "sure", "actually", "really", "probably", "definitely",
        "basically", "essentially", "currently", "usually", "generally",
        "simply", "exactly", "already", "still", "even", "though", "however",
        "therefore", "thus", "hence", "anyway", "anyways", "something",
        "anything", "everything", "nothing", "someone", "anyone", "everyone",
        "one", "ones", "two", "three", "first", "second", "new", "old",
        "good", "bad", "great", "little", "big", "small", "large", "long",
        "short", "high", "low", "different", "important", "able", "last",
        "next", "public", "possible", "real", "whole", "best", "better",
        "true", "false", "available",
    }
)

# Word tokenization pattern
WORD_PATTERN = re.compile(r"[a-zA-Z][a-zA-Z0-9_-]*[a-zA-Z0-9]|[a-zA-Z]")

# Pattern to identify system-injected messages (not real user input)
SYSTEM_TAG_PATTERN = re.compile(
    r"^<(local-command-caveat|command-name|command-message|command-args|"
    r"local-command-stdout|system-reminder|task-notification)>"
)

PROMPTS_PER_CHUNK = 500


# ---------------------------------------------------------------------------
# Session duration calculation (inlined from session_duration.py)
# ---------------------------------------------------------------------------

def _parse_timestamp(ts: str):
    """Parse ISO timestamp string to datetime."""
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None


def _calculate_session_duration(jsonl_file: Path):
    """Calculate duration of a single session in minutes."""
    try:
        timestamps = []
        for line in jsonl_file.read_text().splitlines():
            if not line.strip():
                continue
            try:
                record = json.loads(line)
                ts = record.get("timestamp")
                if ts:
                    timestamps.append(ts)
            except json.JSONDecodeError:
                continue

        if len(timestamps) < 2:
            return None

        timestamps.sort()
        first = _parse_timestamp(timestamps[0])
        last = _parse_timestamp(timestamps[-1])

        if first is None or last is None:
            return None

        return (last - first).total_seconds() / 60
    except Exception:
        return None


def calculate_total_session_minutes(projects_dir: Path) -> int:
    """Calculate total session time in minutes from JSONL timestamps."""
    if not projects_dir.exists():
        return 0

    total_minutes = 0
    for jsonl_file in projects_dir.rglob("*.jsonl"):
        if "subagents" in str(jsonl_file):
            continue
        duration = _calculate_session_duration(jsonl_file)
        if duration is not None:
            total_minutes += duration

    return int(total_minutes)


# ---------------------------------------------------------------------------
# Data extraction functions
# ---------------------------------------------------------------------------

def load_stats_cache(path: Path) -> dict:
    """Load and validate stats-cache.json."""
    if not path.exists():
        print(
            json.dumps({"error": f"No stats found at {path}. Use Claude Code for a while first."}),
            file=sys.stdout,
        )
        sys.exit(1)
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON in {path}: {e}"}), file=sys.stdout)
        sys.exit(1)


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
                        if record.get("type") == "file-history-snapshot":
                            continue
                        yield record
                    except json.JSONDecodeError:
                        pass
        except Exception:
            pass


def extract_tools(projects_dir: Path) -> Dict[str, int]:
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


def extract_user_prompts_by_project(projects_dir: Path) -> Iterator[Tuple[str, str]]:
    """Extract user prompts grouped by project. Yields (project_name, prompt) tuples."""
    if not projects_dir.exists():
        return

    for jsonl_path in iter_jsonl_files(projects_dir):
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
                    pass
        except Exception:
            pass


def longest_streak(dates: List[str]) -> int:
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


def weekend_percentage(dates: List[str]) -> int:
    """Calculate percentage of activity on weekends."""
    if not dates:
        return 0
    try:
        parsed = [date.fromisoformat(d) for d in dates]
    except ValueError:
        return 0
    weekends = sum(1 for d in parsed if d.weekday() >= 5)
    return round(weekends / len(parsed) * 100)


def compute_top_words(projects_dir: Path, top_n: int = 20) -> List[Tuple[str, int]]:
    """Count word frequencies from all user prompts, excluding stopwords."""
    word_counts: Counter = Counter()
    for _, prompt_text in extract_user_prompts_by_project(projects_dir):
        words = WORD_PATTERN.findall(prompt_text.lower())
        meaningful_words = [w for w in words if w not in STOPWORDS and len(w) > 1]
        word_counts.update(meaningful_words)
    return word_counts.most_common(top_n)


def calculate_quirks(stats: dict, projects_dir: Path) -> dict:
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

    return {
        "interruptCount": interrupt_count,
        "abandonedSessions": abandoned_count,
        "lateNightSessions": late_night,
        "earlyMorningSessions": early_morning,
        "weekendPercentage": weekend_pct,
        "shortestSessionSeconds": 60,
        "longestStreakDays": streak,
    }


def build_bundle(
    base_stats: dict,
    tool_usage: Dict[str, int],
    quirks: dict,
    projects_dir: Path,
) -> dict:
    """Assemble the stats bundle as a plain dict."""
    # Calculate token totals from model usage
    model_usage_raw = base_stats.get("modelUsage", {})
    input_tokens = sum(v.get("inputTokens", 0) for v in model_usage_raw.values())
    output_tokens = sum(v.get("outputTokens", 0) for v in model_usage_raw.values())
    cached_tokens = sum(v.get("cacheReadInputTokens", 0) for v in model_usage_raw.values())
    cache_creation_tokens = sum(v.get("cacheCreationInputTokens", 0) for v in model_usage_raw.values())

    # Normalize model names and aggregate
    model_usage: Dict[str, int] = {}
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
        {"date": d.get("date"), "sessions": d.get("sessionCount", 1)}
        for d in daily_activity
        if d.get("date")
    ]

    # Longest session
    longest_session = base_stats.get("longestSession", {})
    longest_minutes = longest_session.get("duration", 0) // 60000

    # Calculate total session time from timestamps
    total_minutes = calculate_total_session_minutes(projects_dir)

    return {
        "stats": {
            "totalSessions": base_stats.get("totalSessions", 0),
            "totalMessages": base_stats.get("totalMessages", 0),
            "totalTokens": {
                "input": input_tokens,
                "output": output_tokens,
                "cached": cached_tokens,
                "cacheCreation": cache_creation_tokens,
            },
            "totalToolCalls": sum(tool_usage.values()),
            "toolUsage": tool_usage,
            "modelUsage": model_usage,
            "hourCounts": hour_counts,
            "peakHour": peak_hour,
            "longestSessionMinutes": longest_minutes,
            "totalMinutes": total_minutes,
            "projectCount": project_count,
            "daysActive": days_active,
            "activeDates": active_dates,
        },
        "quirks": quirks,
    }


def write_prompts_to_files(projects_dir: Path, prompts_dir: Path) -> Tuple[int, int]:
    """Write prompts to temp files organized by project. Returns (total_prompts, total_files)."""
    if prompts_dir.exists():
        shutil.rmtree(prompts_dir)
    prompts_dir.mkdir(parents=True)

    # Group prompts by project
    project_prompts: Dict[str, List[str]] = {}
    for project_name, prompt_text in extract_user_prompts_by_project(projects_dir):
        if project_name not in project_prompts:
            project_prompts[project_name] = []
        project_prompts[project_name].append(prompt_text)

    total_prompts = 0
    total_files = 0

    for project_name, prompts_list in project_prompts.items():
        safe_name = project_name[:20].replace("/", "-").replace("\\", "-")

        for chunk_idx, start in enumerate(range(0, len(prompts_list), PROMPTS_PER_CHUNK), 1):
            chunk = prompts_list[start : start + PROMPTS_PER_CHUNK]
            total_prompts += len(chunk)
            total_files += 1

            filename = f"project-{safe_name}-chunk-{chunk_idx}.txt"
            filepath = prompts_dir / filename
            filepath.write_text("\n\n---\n\n".join(chunk))

    return total_prompts, total_files


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Extract Claude Code usage stats for VibeChecked")
    parser.add_argument(
        "--prompts-dir",
        type=Path,
        default=Path("/tmp/vibes-prompts"),
        help="Directory to write prompt files (default: /tmp/vibes-prompts)",
    )
    parser.add_argument(
        "--claude-dir",
        type=Path,
        default=Path.home() / ".claude",
        help="Path to .claude directory (default: ~/.claude)",
    )
    args = parser.parse_args()

    claude_dir = args.claude_dir
    stats_file = claude_dir / "stats-cache.json"
    projects_dir = claude_dir / "projects"

    # Load stats
    base_stats = load_stats_cache(stats_file)

    # Extract tool usage
    tool_usage = extract_tools(projects_dir)

    # Calculate quirks
    quirks = calculate_quirks(base_stats, projects_dir)

    # Compute top words
    top_words = compute_top_words(projects_dir)

    # Build bundle (stats + quirks)
    bundle = build_bundle(base_stats, tool_usage, quirks, projects_dir)

    # Write prompt files
    prompt_count, file_count = write_prompts_to_files(projects_dir, args.prompts_dir)

    # Output JSON to stdout
    output = {
        **bundle,
        "topWords": [{"word": w, "count": c} for w, c in top_words],
        "promptsDir": str(args.prompts_dir),
        "promptCount": prompt_count,
        "fileCount": file_count,
    }

    json.dump(output, sys.stdout, default=str)


if __name__ == "__main__":
    main()
