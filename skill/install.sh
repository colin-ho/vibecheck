#!/bin/bash
# VibeChecked Skill Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/colin-ho/vibecheck/main/skill/install.sh | bash

set -e

SKILL_NAME="vibes"
SKILL_DIR="$HOME/.claude/skills/$SKILL_NAME"
REPO_URL="https://github.com/colin-ho/vibecheck"

echo "Installing VibeChecked..."

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo ""
    echo "Warning: 'python3' is not found."
    echo "   Python 3.8+ is required for VibeChecked."
    echo "   Install it with:"
    echo "     macOS:  brew install python3"
    echo "     Ubuntu: sudo apt install python3"
    echo ""
fi

# Check if stats file exists
if [ ! -f "$HOME/.claude/stats-cache.json" ]; then
    echo ""
    echo "Warning: No Claude Code stats found at ~/.claude/stats-cache.json"
    echo "   You need to use Claude Code for a while before running /vibes."
    echo ""
fi

# Create skills directory if it doesn't exist
mkdir -p "$HOME/.claude/skills"

# Remove old plugin installation (migrating to skill)
OLD_PLUGIN_DIR="$HOME/.claude/plugins/vibechecked"
if [ -d "$OLD_PLUGIN_DIR" ]; then
    echo "Removing old plugin installation..."
    rm -rf "$OLD_PLUGIN_DIR"
fi

# Remove existing skill installation
if [ -d "$SKILL_DIR" ]; then
    echo "Updating existing installation..."
    rm -rf "$SKILL_DIR"
fi

# Clone or download the skill
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

if command -v git &> /dev/null; then
    echo "Cloning from repository..."
    if git clone --depth 1 "$REPO_URL" "$TEMP_DIR/repo" 2>/dev/null; then
        mkdir -p "$SKILL_DIR"
        cp "$TEMP_DIR/repo/skill/SKILL.md" "$SKILL_DIR/"
        cp -r "$TEMP_DIR/repo/skill/scripts" "$SKILL_DIR/"
    else
        echo "Failed to clone repository."
        echo "   Please check your internet connection or install manually:"
        echo "   https://github.com/colin-ho/vibecheck#installation"
        exit 1
    fi
else
    echo "Git not found, downloading via curl..."
    if command -v curl &> /dev/null; then
        curl -sL "https://github.com/colin-ho/vibecheck/archive/main.tar.gz" | tar -xz -C "$TEMP_DIR"
        mkdir -p "$SKILL_DIR"
        cp "$TEMP_DIR/vibecheck-main/skill/SKILL.md" "$SKILL_DIR/"
        cp -r "$TEMP_DIR/vibecheck-main/skill/scripts" "$SKILL_DIR/"
    else
        echo "Neither git nor curl found. Please install one and try again."
        exit 1
    fi
fi

# Verify installation
if [ ! -f "$SKILL_DIR/SKILL.md" ]; then
    echo "Installation failed: SKILL.md not found."
    exit 1
fi

if [ ! -f "$SKILL_DIR/scripts/vibes.py" ]; then
    echo "Installation failed: scripts not found."
    exit 1
fi

# Make scripts executable
chmod +x "$SKILL_DIR/scripts/vibes.py"

echo ""
echo "VibeChecked installed successfully!"
echo ""

# Auto-run vibes if prerequisites are met
if [ ! -f "$HOME/.claude/stats-cache.json" ]; then
    echo "No Claude Code stats found yet."
    echo "   Use Claude Code for a while, then run /vibes to generate your vibe check."
    echo ""
    exit 0
fi

if ! command -v claude &> /dev/null; then
    echo "Claude Code CLI not found in PATH."
    echo "   Install Claude Code, then run /vibes to generate your vibe check."
    echo "   https://claude.ai/code"
    echo ""
    exit 0
fi

echo "Generating your vibe check..."
echo ""

# Step 1: Generate raw stats JSON
STATS_FILE="/tmp/vibes-stats.json"
python3 "$SKILL_DIR/scripts/vibes.py" --json > "$STATS_FILE"

# Step 2: Have Claude analyze and output enrichment JSON
ENRICHMENT_FILE="/tmp/vibes-enrichment.json"
claude --print --model haiku "/vibes" > "$ENRICHMENT_FILE" 2>/dev/null

# Step 3: Parse enrichment JSON and generate final URL
if [ -f "$ENRICHMENT_FILE" ] && grep -q '"persona"' "$ENRICHMENT_FILE"; then
    # Extract JSON from Claude's output (find the JSON block)
    ENRICHMENT_JSON=$(grep -A 100 '^{' "$ENRICHMENT_FILE" | head -n 100)

    # Parse fields using python
    FINAL_URL=$(python3 - "$STATS_FILE" "$ENRICHMENT_FILE" "$SKILL_DIR/scripts/vibes.py" << 'PYTHON_SCRIPT'
import json
import subprocess
import sys
import re

stats_file = sys.argv[1]
enrichment_file = sys.argv[2]
vibes_script = sys.argv[3]

# Read enrichment output and extract JSON
with open(enrichment_file) as f:
    content = f.read()

# Find JSON block in output
json_match = re.search(r'\{[^{}]*"persona"[^{}]*\}', content, re.DOTALL)
if not json_match:
    # Try to find a larger JSON block
    json_match = re.search(r'\{[\s\S]*?"persona"[\s\S]*?"funFacts"[\s\S]*?\][\s\S]*?\}', content)

if json_match:
    try:
        enrichment = json.loads(json_match.group())
    except json.JSONDecodeError:
        # Fallback: try to parse the whole content
        enrichment = {"persona": "token-titan", "traits": [], "promptingStyle": "", "communicationTone": "", "funFacts": []}
else:
    enrichment = {"persona": "token-titan", "traits": [], "promptingStyle": "", "communicationTone": "", "funFacts": []}

# Build command
cmd = [
    "python3", vibes_script,
    "--persona", enrichment.get("persona", "token-titan"),
    "--traits", json.dumps(enrichment.get("traits", [])),
    "--prompting-style", enrichment.get("promptingStyle", ""),
    "--communication-tone", enrichment.get("communicationTone", ""),
    "--fun-facts", json.dumps(enrichment.get("funFacts", []))
]

result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stdout.strip())
PYTHON_SCRIPT
)

    echo ""
    echo "Here's your VibeChecked URL:"
    echo ""
    echo "$FINAL_URL"
    echo ""
else
    # Fallback: generate URL without enrichment
    echo "Generating basic stats..."
    python3 "$SKILL_DIR/scripts/vibes.py"
fi

# Cleanup
rm -f "$STATS_FILE" "$ENRICHMENT_FILE"
