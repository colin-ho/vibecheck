#!/bin/bash
# Extract tool usage counts from session JSONL files
# Outputs JSON with tool usage breakdown
# Uses jq for reliable cross-platform JSON parsing

CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
PROJECTS_DIR="$CLAUDE_DIR/projects"

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "{}"
    exit 0
fi

# Find all JSONL files and extract tool names, then count them
find "$PROJECTS_DIR" -name "*.jsonl" -print0 2>/dev/null | \
    xargs -0 cat 2>/dev/null | \
    jq -r 'select(.message.content != null) | .message.content[]? | select(.type == "tool_use") | .name' 2>/dev/null | \
    sort | uniq -c | sort -rn | \
    awk 'BEGIN { printf "{" }
         NR > 1 { printf "," }
         { gsub(/^[ \t]+/, ""); count=$1; $1=""; gsub(/^[ \t]+/, ""); name=$0; printf "\n  \"%s\": %d", name, count }
         END { printf "\n}" }'
