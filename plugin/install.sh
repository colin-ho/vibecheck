#!/bin/bash
# Claude Wrapped Plugin Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/claude-wrapped/plugin/main/install.sh | bash

set -e

PLUGIN_NAME="claude-wrapped"
PLUGIN_DIR="$HOME/.claude/plugins/$PLUGIN_NAME"
REPO_URL="https://github.com/claude-wrapped/claude-code-plugin"

echo "🎁 Installing Claude Wrapped Plugin..."

# Create plugins directory if it doesn't exist
mkdir -p "$HOME/.claude/plugins"

# Remove existing installation
if [ -d "$PLUGIN_DIR" ]; then
    echo "Removing existing installation..."
    rm -rf "$PLUGIN_DIR"
fi

# Clone or download the plugin
if command -v git &> /dev/null; then
    echo "Cloning from repository..."
    git clone --depth 1 "$REPO_URL" "$PLUGIN_DIR" 2>/dev/null || {
        echo "Repository not available, using bundled installation..."
        mkdir -p "$PLUGIN_DIR"
    }
else
    echo "Git not found, creating local installation..."
    mkdir -p "$PLUGIN_DIR"
fi

# Make scripts executable
chmod +x "$PLUGIN_DIR/scripts/"*.sh 2>/dev/null || true

echo ""
echo "✅ Claude Wrapped installed successfully!"
echo ""
echo "To generate your wrapped, run:"
echo "  /wrapped"
echo ""
echo "Enjoy your year in code! 🎉"
