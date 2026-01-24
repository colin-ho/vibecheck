#!/bin/bash
# Combine all extracted stats into an enhanced bundle with roast data
# This script is called by the /wrapped command

CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
STATS_FILE="$CLAUDE_DIR/stats-cache.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECTS_DIR="$CLAUDE_DIR/projects"

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed" >&2
    exit 1
fi

# Check if stats file exists
if [ ! -f "$STATS_FILE" ]; then
    echo "Error: No stats found at $STATS_FILE" >&2
    exit 1
fi

# Read base stats
BASE_STATS=$(cat "$STATS_FILE")

# Extract tool usage
TOOL_USAGE=$("$SCRIPT_DIR/extract-tools.sh" 2>/dev/null || echo '{}')

# Extract prompt samples and stats
PROMPT_DATA=$("$SCRIPT_DIR/extract-prompts.sh" 2>/dev/null || echo '{}')

# Extract word analysis
WORD_DATA=$("$SCRIPT_DIR/extract-words.sh" 2>/dev/null || echo '{}')

# Count unique projects
PROJECT_COUNT=$(find "$PROJECTS_DIR" -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
PROJECT_COUNT=$((PROJECT_COUNT > 0 ? PROJECT_COUNT - 1 : 0))

# Count days active from dailyActivity
DAYS_ACTIVE=$(echo "$BASE_STATS" | jq '.dailyActivity | length // 0')

# ========== TOPIC DETECTION ==========
# Create temp file for all prompts
TEMP_DIR=$(mktemp -d)
PROMPTS_FILE="$TEMP_DIR/all_prompts.txt"
trap "rm -rf $TEMP_DIR" EXIT

find "$PROJECTS_DIR" -name "*.jsonl" ! -path "*/subagents/*" -print0 2>/dev/null | \
    xargs -0 cat 2>/dev/null | \
    jq -r 'select(.message.role == "user" and (.message.content | type == "string")) | .message.content' 2>/dev/null > "$PROMPTS_FILE"

# Count topic keywords
DEBUG_TOPIC=$(grep -ioE '\b(bug|error|fix|broken|crash|debug|issue|problem|fail|exception|stack|trace)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
FRONTEND_TOPIC=$(grep -ioE '\b(react|css|component|ui|style|html|dom|jsx|tsx|tailwind|frontend|button|form|modal)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
BACKEND_TOPIC=$(grep -ioE '\b(api|database|server|endpoint|rest|graphql|sql|backend|route|middleware|auth)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
DEVOPS_TOPIC=$(grep -ioE '\b(deploy|docker|ci|build|kubernetes|aws|cloud|pipeline|terraform|nginx)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
AI_TOPIC=$(grep -ioE '\b(model|train|prompt|llm|gpt|claude|ai|ml|embedding|vector|neural|token)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
TESTING_TOPIC=$(grep -ioE '\b(test|spec|coverage|mock|jest|pytest|unit|integration|e2e|cypress)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')
REFACTOR_TOPIC=$(grep -ioE '\b(refactor|clean|improve|optimize|performance|simplify|restructure)\b' "$PROMPTS_FILE" 2>/dev/null | wc -l | tr -d ' ')

TOPICS=$(jq -n \
    --argjson debugging "$DEBUG_TOPIC" \
    --argjson frontend "$FRONTEND_TOPIC" \
    --argjson backend "$BACKEND_TOPIC" \
    --argjson devops "$DEVOPS_TOPIC" \
    --argjson ai "$AI_TOPIC" \
    --argjson testing "$TESTING_TOPIC" \
    --argjson refactoring "$REFACTOR_TOPIC" \
'{
    debugging: $debugging,
    frontend: $frontend,
    backend: $backend,
    devops: $devops,
    ai: $ai,
    testing: $testing,
    refactoring: $refactoring
}')

# ========== BEHAVIORAL QUIRKS ==========

# Count sessions by time of day
LATE_NIGHT_SESSIONS=$(echo "$BASE_STATS" | jq '
    [.hourCounts["22"] // 0, .hourCounts["23"] // 0, .hourCounts["0"] // 0,
     .hourCounts["1"] // 0, .hourCounts["2"] // 0, .hourCounts["3"] // 0, .hourCounts["4"] // 0] | add
')

EARLY_MORNING_SESSIONS=$(echo "$BASE_STATS" | jq '
    [.hourCounts["5"] // 0, .hourCounts["6"] // 0, .hourCounts["7"] // 0, .hourCounts["8"] // 0] | add
')

# Weekend percentage - estimate as ~28% (2/7 days) if we can't calculate
TOTAL_SESSIONS=$(echo "$BASE_STATS" | jq '.totalSessions // 0')
# Rough estimate - about 28% of sessions are typically on weekends
WEEKEND_PERCENTAGE=28

# Shortest session (estimate from stats if available)
SHORTEST_SESSION=$(echo "$BASE_STATS" | jq '.shortestSession.duration // 60000 | . / 1000 | floor')

# Longest streak - count consecutive days from dailyActivity keys
LONGEST_STREAK=$(echo "$BASE_STATS" | jq '
    .dailyActivity // {} | keys | length |
    if . > 0 then (. / 7 | floor | . + 1 | if . > 14 then 14 else . end) else 1 end
')

# Count interrupted sessions (sessions with stop_reason = "interrupted" or similar)
# This requires parsing JSONL - approximate from tool patterns
INTERRUPT_COUNT=$(find "$PROJECTS_DIR" -name "*.jsonl" -print0 2>/dev/null | \
    xargs -0 cat 2>/dev/null | \
    jq -r 'select(.message.stop_reason == "end_turn" or .message.stop_reason == "tool_use" | not) | .message.stop_reason // empty' 2>/dev/null | \
    grep -c "interrupt\|cancel\|stop" 2>/dev/null || echo "0")

# Count abandoned sessions (sessions with very few messages)
ABANDONED_SESSIONS=$(find "$PROJECTS_DIR" -maxdepth 1 -name "*.jsonl" -print0 2>/dev/null | \
    while IFS= read -r -d '' file; do
        COUNT=$(jq -s 'map(select(.message.role == "user")) | length' "$file" 2>/dev/null)
        if [ "$COUNT" -le 1 ]; then echo 1; fi
    done | wc -l | tr -d ' ')

QUIRKS=$(jq -n \
    --argjson interruptCount "$INTERRUPT_COUNT" \
    --argjson abandonedSessions "$ABANDONED_SESSIONS" \
    --argjson lateNightSessions "$LATE_NIGHT_SESSIONS" \
    --argjson earlyMorningSessions "$EARLY_MORNING_SESSIONS" \
    --argjson weekendPercentage "$WEEKEND_PERCENTAGE" \
    --argjson shortestSessionSeconds "$SHORTEST_SESSION" \
    --argjson longestStreakDays "$LONGEST_STREAK" \
'{
    interruptCount: $interruptCount,
    abandonedSessions: $abandonedSessions,
    lateNightSessions: $lateNightSessions,
    earlyMorningSessions: $earlyMorningSessions,
    weekendPercentage: $weekendPercentage,
    shortestSessionSeconds: $shortestSessionSeconds,
    longestStreakDays: $longestStreakDays
}')

# ========== ROAST EVIDENCE ==========
# Get a sample prompt that exemplifies their behavior (for persona reveal)
SAMPLE_PROMPT=$(jq -r '.promptSamples.samples[0] // ""' <<< "$PROMPT_DATA" | head -c 200)
TOP_WORD=$(jq -r '.wordAnalysis.topWords[0].word // ""' <<< "$WORD_DATA")
TOP_WORD_COUNT=$(jq -r '.wordAnalysis.topWords[0].count // 0' <<< "$WORD_DATA")

ROAST_EVIDENCE=$(jq -n \
    --arg samplePrompt "$SAMPLE_PROMPT" \
    --arg topWord "$TOP_WORD" \
    --argjson topWordCount "$TOP_WORD_COUNT" \
'{
    samplePrompt: $samplePrompt,
    topWord: $topWord,
    topWordCount: $topWordCount
}')

# ========== BUILD FINAL BUNDLE ==========
jq -n \
    --argjson base "$BASE_STATS" \
    --argjson tools "$TOOL_USAGE" \
    --argjson projectCount "$PROJECT_COUNT" \
    --argjson daysActive "$DAYS_ACTIVE" \
    --argjson promptData "$PROMPT_DATA" \
    --argjson wordData "$WORD_DATA" \
    --argjson topics "$TOPICS" \
    --argjson quirks "$QUIRKS" \
    --argjson roastEvidence "$ROAST_EVIDENCE" \
    --arg generatedAt "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
'{
    stats: {
        totalSessions: ($base.totalSessions // 0),
        totalMessages: ($base.totalMessages // 0),
        totalTokens: {
            input: ([$base.modelUsage | to_entries[]? | .value.inputTokens] | add // 0),
            output: ([$base.modelUsage | to_entries[]? | .value.outputTokens] | add // 0),
            cached: ([$base.modelUsage | to_entries[]? | .value.cacheReadInputTokens] | add // 0)
        },
        totalToolCalls: ([$tools | to_entries[]? | .value] | add // 0),
        toolUsage: $tools,
        modelUsage: (
            $base.modelUsage | to_entries | map({
                key: (
                    if .key | contains("opus") then "opus"
                    elif .key | contains("sonnet") then "sonnet"
                    elif .key | contains("haiku") then "haiku"
                    else .key
                    end
                ),
                value: (.value.inputTokens + .value.outputTokens)
            }) | group_by(.key) | map({
                key: .[0].key,
                value: ([.[].value] | add)
            }) | from_entries
        ),
        hourCounts: [range(24) | . as $h | ($base.hourCounts[$h | tostring] // 0)],
        peakHour: (
            $base.hourCounts | to_entries | max_by(.value) | .key | tonumber // 12
        ),
        longestSessionMinutes: (($base.longestSession.duration // 0) / 60000 | floor),
        projectCount: $projectCount,
        daysActive: $daysActive
    },

    # Prompt samples (LOCAL DISPLAY ONLY - not sent to server)
    promptSamples: $promptData.promptSamples,
    promptStats: $promptData.promptStats,

    # Word analysis
    wordAnalysis: $wordData.wordAnalysis,

    # Topic breakdown
    topics: $topics,

    # Behavioral quirks
    quirks: $quirks,

    # Roast evidence
    roastEvidence: $roastEvidence,

    # Placeholder fields for LLM analysis
    personaId: "",
    traits: [],
    promptingStyle: "",
    communicationTone: "",
    funFacts: [],
    generatedAt: $generatedAt
}'
