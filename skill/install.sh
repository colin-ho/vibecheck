#!/bin/bash
# VibeChecked Installer
# Usage: curl -fsSL https://getyourvibechecked.vercel.app/install.sh | bash

set -e

REPO_URL="https://github.com/colin-ho/vibecheck"

echo ""
echo "=== VibeChecked ==="
echo ""

# Find Python 3.8+
PYTHON=""

# First check if default python3 is 3.8+
if command -v python3 &> /dev/null; then
    if python3 -c 'import sys; exit(0 if sys.version_info >= (3, 8) else 1)' 2>/dev/null; then
        PYTHON="python3"
    fi
fi

# If python3 is too old, try versioned alternatives
if [ -z "$PYTHON" ]; then
    for cmd in python3.14 python3.13 python3.12 python3.11 python3.10 python3.9 python3.8; do
        if command -v "$cmd" &> /dev/null; then
            PYTHON="$cmd"
            break
        fi
    done
fi

if [ -z "$PYTHON" ]; then
    echo "Error: Python 3.8+ is required."
    echo "  Install with:"
    echo "    macOS:  brew install python3"
    echo "    Ubuntu: sudo apt install python3"
    exit 1
fi

# Check if stats file exists
if [ ! -f "$HOME/.claude/stats-cache.json" ]; then
    echo "Error: No Claude Code stats found at ~/.claude/stats-cache.json"
    echo "  Use Claude Code for a while first."
    exit 1
fi

# Check if Claude CLI is available
if ! command -v claude &> /dev/null; then
    echo "Error: Claude CLI not found in PATH."
    echo "  Run this from within Claude Code or install the CLI."
    exit 1
fi

# Download and run
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo "[1/2] Downloading..."
if command -v git &> /dev/null; then
    git clone --depth 1 -q "$REPO_URL" "$TEMP_DIR/repo" 2>/dev/null || {
        echo "Failed to download. Check your internet connection."
        exit 1
    }
    SCRIPT_DIR="$TEMP_DIR/repo/skill/scripts"
else
    curl -sL "https://github.com/colin-ho/vibecheck/archive/main.tar.gz" | tar -xz -C "$TEMP_DIR"
    SCRIPT_DIR="$TEMP_DIR/vibecheck-main/skill/scripts"
fi

echo "[2/2] Generating your vibe check..."
echo ""

cd "$SCRIPT_DIR"
$PYTHON vibes.py
