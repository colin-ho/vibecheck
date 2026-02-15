#!/usr/bin/env python3
"""Merge analysis results and upload the final VibeChecked bundle.

Combines:
  - /tmp/vibes-stats.json   (from extract_stats.py)
  - /tmp/vibes-quotes.json  (Analysis A: memorable prompts + contrasts)
  - /tmp/vibes-style.json   (Analysis B: communication style + obsessions)
  - /tmp/vibes-persona.json (Analysis C: persona + traits + fun facts)

Produces the final AnonymousBundle, uploads to server, prints the URL.

Usage:
    python3 merge_and_upload.py
    python3 merge_and_upload.py --dry-run   # Print bundle JSON without uploading
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE_URL = "https://getyourvibechecked.vercel.app"

STATS_FILE = Path("/tmp/vibes-stats.json")
QUOTES_FILE = Path("/tmp/vibes-quotes.json")
STYLE_FILE = Path("/tmp/vibes-style.json")
PERSONA_FILE = Path("/tmp/vibes-persona.json")


def load_json(path: Path) -> dict:
    """Load a JSON file, returning empty dict if missing or invalid."""
    try:
        return json.loads(path.read_text())
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Warning: Could not load {path}: {e}", file=sys.stderr)
        return {}


def merge_bundle(stats_data: dict, quotes: dict, style: dict, persona: dict) -> dict:
    """Assemble the final AnonymousBundle from the 4 data sources."""
    return {
        "stats": stats_data.get("stats", {}),
        "quirks": stats_data.get("quirks", {}),
        "insights": {
            "memorablePrompts": quotes.get("memorablePrompts"),
            "communicationStyle": style.get("communicationStyle"),
            "obsessions": style.get("obsessions"),
            "contrasts": quotes.get("contrasts"),
            "topWords": stats_data.get("topWords", []),
            "topPhrases": style.get("topPhrases", []),
            "dominantTopics": style.get("dominantTopics", []),
        },
        "personaId": persona.get("persona", "code-roulette"),
        "traits": persona.get("traits", []),
        "promptingStyle": persona.get("promptingStyle", ""),
        "communicationTone": persona.get("communicationTone", ""),
        "funFacts": persona.get("funFacts", []),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }


def upload_bundle(bundle: dict) -> str | None:
    """Upload bundle to server and return short ID."""
    try:
        data = json.dumps(bundle).encode("utf-8")
        req = urllib.request.Request(
            f"{BASE_URL}/api/store",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            if response.status == 200:
                result = json.loads(response.read().decode("utf-8"))
                return result.get("id")
    except urllib.error.URLError as e:
        print(f"Upload failed: {e}", file=sys.stderr)
    except Exception as e:
        print(f"Upload error: {e}", file=sys.stderr)
    return None


def main():
    parser = argparse.ArgumentParser(description="Merge VibeChecked analysis results and upload")
    parser.add_argument("--dry-run", action="store_true", help="Print bundle JSON without uploading")
    args = parser.parse_args()

    # Load all inputs
    stats_data = load_json(STATS_FILE)
    quotes = load_json(QUOTES_FILE)
    style = load_json(STYLE_FILE)
    persona = load_json(PERSONA_FILE)

    if not stats_data.get("stats"):
        print("Error: /tmp/vibes-stats.json is missing or has no stats", file=sys.stderr)
        sys.exit(1)

    # Merge into final bundle
    bundle = merge_bundle(stats_data, quotes, style, persona)

    if args.dry_run:
        json.dump(bundle, sys.stdout, indent=2, default=str)
        sys.stdout.write("\n")
        return

    # Upload
    short_id = upload_bundle(bundle)
    if short_id:
        url = f"{BASE_URL}/vibes?id={short_id}"
        print(url)
    else:
        print("Error: Upload failed", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
