#!/bin/bash
# Extract stats from ~/.claude/stats-cache.json
# Outputs JSON with basic stats

CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
STATS_FILE="$CLAUDE_DIR/stats-cache.json"

if [ ! -f "$STATS_FILE" ]; then
    echo '{"error": "stats-cache.json not found"}' >&2
    exit 1
fi

# Use jq if available, otherwise use a simple grep/sed approach
if command -v jq &> /dev/null; then
    cat "$STATS_FILE" | jq '{
        totalSessions: .totalSessions,
        totalMessages: .totalMessages,
        dailyActivity: .dailyActivity,
        modelUsage: .modelUsage,
        hourCounts: .hourCounts,
        longestSession: .longestSession
    }'
else
    # Fallback: just output the whole file
    cat "$STATS_FILE"
fi
