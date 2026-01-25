#!/bin/bash
# VibeChecked Plugin Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/colin-ho/vibecheck/main/plugin/install.sh | bash

set -e

PLUGIN_NAME="vibechecked"
PLUGIN_DIR="$HOME/.claude/plugins/$PLUGIN_NAME"
REPO_URL="https://github.com/colin-ho/vibecheck"

echo "🎁 Installing VibeChecked Plugin..."

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo ""
    echo "⚠️  Warning: 'python3' is not found."
    echo "   Python 3.8+ is required for VibeChecked."
    echo "   Install it with:"
    echo "     macOS:  brew install python3"
    echo "     Ubuntu: sudo apt install python3"
    echo ""
fi

# Check if stats file exists
if [ ! -f "$HOME/.claude/stats-cache.json" ]; then
    echo ""
    echo "⚠️  Warning: No Claude Code stats found at ~/.claude/stats-cache.json"
    echo "   You need to use Claude Code for a while before running /vibes."
    echo ""
fi

# Create plugins directory if it doesn't exist
mkdir -p "$HOME/.claude/plugins"

# Remove existing installation
if [ -d "$PLUGIN_DIR" ]; then
    echo "Removing existing installation..."
    rm -rf "$PLUGIN_DIR"
fi

# Clone or download the plugin
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

if command -v git &> /dev/null; then
    echo "Cloning from repository..."
    if git clone --depth 1 "$REPO_URL" "$TEMP_DIR/repo" 2>/dev/null; then
        mv "$TEMP_DIR/repo/plugin" "$PLUGIN_DIR"
    else
        echo "❌ Failed to clone repository."
        echo "   Please check your internet connection or install manually:"
        echo "   https://github.com/colin-ho/vibecheck#installation"
        exit 1
    fi
else
    echo "Git not found, downloading via curl..."
    if command -v curl &> /dev/null; then
        curl -sL "https://github.com/colin-ho/vibecheck/archive/main.tar.gz" | tar -xz -C "$TEMP_DIR"
        mv "$TEMP_DIR/vibecheck-main/plugin" "$PLUGIN_DIR"
    else
        echo "❌ Neither git nor curl found. Please install one and try again."
        exit 1
    fi
fi

# Verify installation
if [ ! -f "$PLUGIN_DIR/scripts/vibes.py" ]; then
    echo "❌ Installation failed: scripts not found."
    exit 1
fi

# Make scripts executable
chmod +x "$PLUGIN_DIR/scripts/vibes.py"

echo ""
echo "✅ VibeChecked installed successfully!"
echo ""
echo "To generate your vibe check, run:"
echo "  /vibes"
echo ""
echo "Enjoy exploring your coding journey! 🎉"
