# /vibes - Generate Your VibeChecked

Generate a personalized interactive journey through your Claude Code usage with VibeChecked.

## What This Command Does

1. Extracts your usage statistics from `~/.claude/stats-cache.json`
2. Analyzes your tool usage patterns from session files
3. Determines your developer persona based on your coding patterns
4. Opens an interactive web experience with animated visualizations

## Instructions for Claude

When the user runs `/vibes`, follow these steps:

### Step 1: Generate Your VibeChecked URL

Run the vibes script to generate your personalized URL:

```bash
python3 ~/.claude/plugins/vibechecked/scripts/vibes.py
```

This outputs a URL. You can also use `--json` to see the raw data or `-v` for verbose output.

### Step 2: Analyze Prompting Style (LOCAL ONLY)

Read a sample of the user's recent conversations from `~/.claude/projects/` to analyze:
- Their prompting style (detailed vs terse, structured vs freeform)
- Their communication tone (formal, casual, direct, polite)
- Common patterns in how they interact with Claude

**IMPORTANT**: This analysis happens locally. DO NOT include any raw prompts or conversation content in the bundle.

Based on your analysis, add these fields to the bundle:
- `promptingStyle`: A brief description like "detailed and methodical" or "terse and direct"
- `communicationTone`: A brief description like "polite and collaborative" or "direct and efficient"
- `traits`: An array of trait keywords like ["methodical", "curious", "night-owl"]

### Step 3: Determine Persona

Based on the statistics and your analysis, determine the user's persona ID. Choose from:

**Legendary** (exceptional stats):
- `token-titan`: Over 1 million tokens processed
- `prompt-whisperer`: High efficiency, low token waste, high cache rate
- `tool-master`: Uses 6+ different tools extensively
- `mcp-pioneer`: Uses custom MCP tools

**Lifestyle** (usage patterns):
- `midnight-architect`: >50% sessions between 10PM-4AM
- `dawn-warrior`: >50% sessions between 5AM-8AM
- `project-nomad`: >15 different projects
- `deep-focus-monk`: Long average session duration (>3 hours)
- `weekend-warrior`: Most activity on weekends

**Personality** (based on analysis):
- `the-perfectionist`: Lots of refactoring, detailed prompts
- `the-explorer`: Read-heavy, lots of questions
- `the-speedrunner`: Short sessions, fast iterations
- `the-diplomat`: Polite language, says please/thanks
- `the-commander`: Direct, imperative style

**Roast** (funny self-deprecating):
- `bash-berserker`: >60% Bash tool usage
- `opus-maximalist`: Heavy Opus usage for simple tasks
- `context-amnesiac`: Low cache hit rate (<10%)
- `agent-interrupter`: Frequently interrupts Claude

Set the `personaId` field to one of these values.

### Step 4: Add Fun Facts

Generate 3 fun facts based on the data. Examples:
- "You said 'fix' 847 times"
- "Your longest session was 4 hours 7 minutes"
- "You've worked on 23 different projects"
- "Your most used command was 'git status'"

Add these to the `funFacts` array in the bundle.

### Step 5: Open the URL

The `vibes.py` script outputs the full URL with encoded data. Open it in the browser:

```bash
python3 ~/.claude/plugins/vibechecked/scripts/vibes.py
```

Then tell the user you're opening their VibeChecked experience and provide the URL.

## Privacy Notice

- Raw prompts and conversation content are NEVER transmitted
- Only aggregated statistics are included in the bundle
- The web app runs client-side and doesn't store personal data
- Anonymous stats may be used to compute global percentiles

## Example Output

After running the command, Claude should say something like:

"I've analyzed your Claude Code usage! Here's what I found:

- **847 sessions** across **23 projects**
- **4.5M tokens** processed with a **35% cache hit rate**
- Your favorite tool is **Read** (2,847 uses)
- Peak coding hour: **3 PM**

Based on your patterns, you're a **MIDNIGHT ARCHITECT** - your best work happens after dark!

Opening your VibeChecked experience..."

Then open the URL with the encoded data.
