#!/bin/bash
# Extract word and phrase frequency analysis from user prompts
# Outputs JSON with top words, phrases, politeness score, and command ratio

CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
PROJECTS_DIR="$CLAUDE_DIR/projects"

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo '{"error": "jq not installed"}'
    exit 0
fi

# Create temp files
TEMP_DIR=$(mktemp -d)
PROMPTS_FILE="$TEMP_DIR/prompts.txt"
WORDS_FILE="$TEMP_DIR/words.txt"
trap "rm -rf $TEMP_DIR" EXIT

# Common English stopwords to filter
STOPWORDS="the a an and or but is are was were be been being have has had do does did will would could should may might must shall can to of in for on with at by from as it its this that these those i me my we our you your he she they them their what which who whom how why when where if then else"

# Extract all user prompts text
find "$PROJECTS_DIR" -name "*.jsonl" ! -path "*/subagents/*" -print0 2>/dev/null | \
    xargs -0 cat 2>/dev/null | \
    jq -r 'select(.message.role == "user" and (.message.content | type == "string")) | .message.content' 2>/dev/null > "$PROMPTS_FILE"

if [ ! -s "$PROMPTS_FILE" ]; then
    echo '{"wordAnalysis":{"topWords":[],"topPhrases":[],"swearCount":0,"politenessScore":50,"commandRatio":0,"questionMarkRatio":0,"exclamationCount":0}}'
    exit 0
fi

# Convert to lowercase and extract words
tr '[:upper:]' '[:lower:]' < "$PROMPTS_FILE" | \
    tr -cs '[:alpha:]' '\n' | \
    grep -v '^$' > "$WORDS_FILE"

TOTAL_WORDS=$(wc -l < "$WORDS_FILE" | tr -d ' ')

if [ "$TOTAL_WORDS" -eq 0 ]; then
    echo '{"wordAnalysis":{"topWords":[],"topPhrases":[],"swearCount":0,"politenessScore":50,"commandRatio":0,"questionMarkRatio":0,"exclamationCount":0}}'
    exit 0
fi

# Filter stopwords and count word frequency - get top 20
TOP_WORDS=$(cat "$WORDS_FILE" | \
    grep -v -w -E "$(echo $STOPWORDS | tr ' ' '|')" | \
    grep -E '^[a-z]{2,}$' | \
    sort | uniq -c | sort -rn | head -20 | \
    awk '{printf "{\"word\":\"%s\",\"count\":%d}\n", $2, $1}' | \
    jq -s '.')

# Extract common bigrams/phrases
BIGRAMS=$(cat "$PROMPTS_FILE" | \
    tr '[:upper:]' '[:lower:]' | \
    tr '\n' ' ' | \
    grep -oE '[a-z]+[[:space:]]+[a-z]+' | \
    sort | uniq -c | sort -rn | head -10 | \
    awk '$1 >= 3 {printf "{\"phrase\":\"%s %s\",\"count\":%d}\n", $2, $3, $1}' | \
    jq -s '.')

# Count politeness markers
PLEASE_COUNT=$(grep -ioE '\bplease\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
THANKS_COUNT=$(grep -ioE '\b(thanks|thank you|thx)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
SORRY_COUNT=$(grep -ioE '\b(sorry|apologies)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')

# Count command words
FIX_COUNT=$(grep -ioE '\bfix\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
HELP_COUNT=$(grep -ioE '\bhelp\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
MAKE_COUNT=$(grep -ioE '\bmake\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
DO_COUNT=$(grep -ioE '\bdo\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
WRITE_COUNT=$(grep -ioE '\bwrite\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
ADD_COUNT=$(grep -ioE '\badd\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
UPDATE_COUNT=$(grep -ioE '\bupdate\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
CREATE_COUNT=$(grep -ioE '\bcreate\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
DELETE_COUNT=$(grep -ioE '\b(delete|remove)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
DEBUG_COUNT=$(grep -ioE '\bdebug\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')

# Count mild swear words (keeping it clean but real)
SWEAR_COUNT=$(grep -ioE '\b(damn|crap|shit|fuck|wtf|hell|dammit)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')

# Count question marks and exclamation points
QUESTION_COUNT=$(grep -o '?' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
EXCLAMATION_COUNT=$(grep -o '!' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
TOTAL_PROMPTS=$(wc -l < "$PROMPTS_FILE" | tr -d ' ')

# Calculate ratios
POLITENESS_MARKERS=$((PLEASE_COUNT + THANKS_COUNT + SORRY_COUNT))
COMMAND_WORDS=$((FIX_COUNT + MAKE_COUNT + WRITE_COUNT + ADD_COUNT + UPDATE_COUNT + CREATE_COUNT + DELETE_COUNT))

# Politeness score: 0-100 based on politeness markers per 100 prompts
if [ "$TOTAL_PROMPTS" -gt 0 ]; then
    POLITENESS_SCORE=$(awk "BEGIN {score = ($POLITENESS_MARKERS / $TOTAL_PROMPTS) * 100; if (score > 100) score = 100; printf \"%.0f\", score}")
    QUESTION_RATIO=$(awk "BEGIN {printf \"%.2f\", $QUESTION_COUNT / $TOTAL_PROMPTS}")
    COMMAND_RATIO=$(awk "BEGIN {printf \"%.2f\", $COMMAND_WORDS / $TOTAL_PROMPTS}")
else
    POLITENESS_SCORE=50
    QUESTION_RATIO=0
    COMMAND_RATIO=0
fi

# Build command counts object
COMMAND_COUNTS=$(jq -n \
    --argjson fix "$FIX_COUNT" \
    --argjson help "$HELP_COUNT" \
    --argjson make "$MAKE_COUNT" \
    --argjson write "$WRITE_COUNT" \
    --argjson add "$ADD_COUNT" \
    --argjson update "$UPDATE_COUNT" \
    --argjson create "$CREATE_COUNT" \
    --argjson delete "$DELETE_COUNT" \
    --argjson debug "$DEBUG_COUNT" \
'{
    fix: $fix,
    help: $help,
    make: $make,
    write: $write,
    add: $add,
    update: $update,
    create: $create,
    delete: $delete,
    debug: $debug
}')

# Output final JSON
jq -n \
    --argjson topWords "$TOP_WORDS" \
    --argjson topPhrases "$BIGRAMS" \
    --argjson swearCount "$SWEAR_COUNT" \
    --argjson politenessScore "$POLITENESS_SCORE" \
    --argjson commandRatio "$COMMAND_RATIO" \
    --argjson questionRatio "$QUESTION_RATIO" \
    --argjson exclamationCount "$EXCLAMATION_COUNT" \
    --argjson pleaseCount "$PLEASE_COUNT" \
    --argjson thanksCount "$THANKS_COUNT" \
    --argjson helpCount "$HELP_COUNT" \
    --argjson fixCount "$FIX_COUNT" \
    --argjson commandCounts "$COMMAND_COUNTS" \
'{
    wordAnalysis: {
        topWords: $topWords,
        topPhrases: $topPhrases,
        swearCount: $swearCount,
        politenessScore: $politenessScore,
        commandRatio: $commandRatio,
        questionMarkRatio: $questionRatio,
        exclamationCount: $exclamationCount,
        pleaseCount: $pleaseCount,
        thanksCount: $thanksCount,
        helpCount: $helpCount,
        fixCount: $fixCount,
        commandCounts: $commandCounts
    }
}'
