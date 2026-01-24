#!/bin/bash
# Extract prompt samples and analysis from session JSONL files
# Outputs JSON with prompt samples, lengths, and characteristics
# Prompts are for LOCAL DISPLAY ONLY - not sent to server

CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
PROJECTS_DIR="$CLAUDE_DIR/projects"

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo '{"error": "jq not installed"}'
    exit 0
fi

# Create temp files for processing
TEMP_DIR=$(mktemp -d)
PROMPTS_FILE="$TEMP_DIR/prompts.txt"
LENGTHS_FILE="$TEMP_DIR/lengths.txt"
trap "rm -rf $TEMP_DIR" EXIT

# Extract all user prompts (text only, not tool results) from JSONL files
find "$PROJECTS_DIR" -name "*.jsonl" ! -path "*/subagents/*" -print0 2>/dev/null | \
    xargs -0 cat 2>/dev/null | \
    jq -r 'select(.message.role == "user" and (.message.content | type == "string") and (.message.content | length > 0)) | .message.content' 2>/dev/null > "$PROMPTS_FILE"

# Count total prompts
TOTAL_PROMPTS=$(wc -l < "$PROMPTS_FILE" | tr -d ' ')

if [ "$TOTAL_PROMPTS" -eq 0 ] || [ ! -s "$PROMPTS_FILE" ]; then
    echo '{"promptSamples":{"first":"","shortest":"","longest":"","samples":[]},"promptStats":{"totalPrompts":0,"averageLength":0,"shortestLength":0,"longestLength":0,"allCapsPrompts":0}}'
    exit 0
fi

# Get first prompt
FIRST_PROMPT=$(head -1 "$PROMPTS_FILE" | head -c 500)

# Calculate lengths and find shortest/longest
while IFS= read -r line; do
    echo "${#line}"
done < "$PROMPTS_FILE" > "$LENGTHS_FILE"

# Get shortest prompt (min 5 chars)
SHORTEST_LENGTH=999999
SHORTEST_TEXT=""
while IFS= read -r line; do
    len=${#line}
    if [ "$len" -ge 5 ] && [ "$len" -lt "$SHORTEST_LENGTH" ]; then
        SHORTEST_LENGTH=$len
        SHORTEST_TEXT=$(echo "$line" | head -c 200)
    fi
done < "$PROMPTS_FILE"

# Get longest prompt
LONGEST_LENGTH=0
LONGEST_TEXT=""
while IFS= read -r line; do
    len=${#line}
    if [ "$len" -gt "$LONGEST_LENGTH" ]; then
        LONGEST_LENGTH=$len
        LONGEST_TEXT=$(echo "$line" | head -c 500)
    fi
done < "$PROMPTS_FILE"

# Calculate average length
if [ "$TOTAL_PROMPTS" -gt 0 ]; then
    TOTAL_LEN=$(awk '{sum+=$1} END {print sum}' "$LENGTHS_FILE")
    AVG_LENGTH=$((TOTAL_LEN / TOTAL_PROMPTS))
else
    AVG_LENGTH=0
fi

# Count ALL CAPS prompts (more than 70% uppercase letters, min 10 chars)
ALL_CAPS_COUNT=0
while IFS= read -r line; do
    len=${#line}
    if [ "$len" -ge 10 ]; then
        upper=$(echo "$line" | tr -cd 'A-Z' | wc -c | tr -d ' ')
        alpha=$(echo "$line" | tr -cd 'A-Za-z' | wc -c | tr -d ' ')
        if [ "$alpha" -gt 0 ]; then
            ratio=$((upper * 100 / alpha))
            if [ "$ratio" -gt 70 ]; then
                ALL_CAPS_COUNT=$((ALL_CAPS_COUNT + 1))
            fi
        fi
    fi
done < "$PROMPTS_FILE"

# Get sample prompts (every Nth line to get 10 samples)
STEP=$((TOTAL_PROMPTS / 10))
[ "$STEP" -lt 1 ] && STEP=1
SAMPLES_JSON="["
SAMPLE_COUNT=0
LINE_NUM=0
while IFS= read -r line && [ "$SAMPLE_COUNT" -lt 10 ]; do
    if [ $((LINE_NUM % STEP)) -eq 0 ]; then
        # Escape for JSON
        ESCAPED=$(echo "$line" | head -c 200 | jq -Rs '.')
        if [ "$SAMPLE_COUNT" -gt 0 ]; then
            SAMPLES_JSON="$SAMPLES_JSON,"
        fi
        SAMPLES_JSON="$SAMPLES_JSON$ESCAPED"
        SAMPLE_COUNT=$((SAMPLE_COUNT + 1))
    fi
    LINE_NUM=$((LINE_NUM + 1))
done < "$PROMPTS_FILE"
SAMPLES_JSON="$SAMPLES_JSON]"

# Find most frustrated prompt (ALL CAPS)
FRUSTRATED_TEXT=""
while IFS= read -r line; do
    len=${#line}
    if [ "$len" -ge 10 ]; then
        upper=$(echo "$line" | tr -cd 'A-Z' | wc -c | tr -d ' ')
        alpha=$(echo "$line" | tr -cd 'A-Za-z' | wc -c | tr -d ' ')
        if [ "$alpha" -gt 0 ]; then
            ratio=$((upper * 100 / alpha))
            if [ "$ratio" -gt 70 ]; then
                FRUSTRATED_TEXT=$(echo "$line" | head -c 200)
                break
            fi
        fi
    fi
done < "$PROMPTS_FILE"

# Escape strings for JSON
FIRST_ESCAPED=$(echo "$FIRST_PROMPT" | jq -Rs '.')
SHORTEST_ESCAPED=$(echo "$SHORTEST_TEXT" | jq -Rs '.')
LONGEST_ESCAPED=$(echo "$LONGEST_TEXT" | jq -Rs '.')
FRUSTRATED_ESCAPED=$(echo "$FRUSTRATED_TEXT" | jq -Rs '.')

# Fix shortest length if not found
[ "$SHORTEST_LENGTH" -eq 999999 ] && SHORTEST_LENGTH=0

# Output the result as JSON
cat <<EOF
{
  "promptSamples": {
    "first": $FIRST_ESCAPED,
    "shortest": $SHORTEST_ESCAPED,
    "longest": $LONGEST_ESCAPED,
    "mostFrustrated": $FRUSTRATED_ESCAPED,
    "samples": $SAMPLES_JSON
  },
  "promptStats": {
    "totalPrompts": $TOTAL_PROMPTS,
    "averageLength": $AVG_LENGTH,
    "shortestLength": $SHORTEST_LENGTH,
    "longestLength": $LONGEST_LENGTH,
    "allCapsPrompts": $ALL_CAPS_COUNT
  }
}
EOF
