"""Calculate actual session durations from JSONL timestamps.

Instead of estimating session time as (sessions * 45 minutes), this module
calculates real durations by finding the time between first and last message
in each session file.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Optional


def calculate_total_session_minutes(projects_dir: Path) -> int:
    """Calculate total session time in minutes from JSONL timestamps.

    For each session file, finds the first and last message timestamps
    and calculates the duration. Returns the sum of all session durations.

    Args:
        projects_dir: Path to ~/.claude/projects directory

    Returns:
        Total minutes across all sessions
    """
    if not projects_dir.exists():
        return 0

    total_minutes = 0

    for jsonl_file in projects_dir.rglob("*.jsonl"):
        # Skip subagent files
        if "subagents" in str(jsonl_file):
            continue

        duration = _calculate_session_duration(jsonl_file)
        if duration is not None:
            total_minutes += duration

    return int(total_minutes)


def _calculate_session_duration(jsonl_file: Path) -> Optional[float]:
    """Calculate duration of a single session in minutes.

    Args:
        jsonl_file: Path to a session JSONL file

    Returns:
        Duration in minutes, or None if couldn't be calculated
    """
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

        duration_minutes = (last - first).total_seconds() / 60
        return duration_minutes

    except Exception:
        return None


def _parse_timestamp(ts: str) -> Optional[datetime]:
    """Parse ISO timestamp string to datetime.

    Args:
        ts: ISO format timestamp (e.g., "2026-01-21T19:58:36.287Z")

    Returns:
        datetime object, or None if parsing failed
    """
    try:
        # Handle 'Z' suffix for UTC
        return datetime.fromisoformat(ts.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        return None
