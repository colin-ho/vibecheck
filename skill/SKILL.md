---
name: vibes
description: Analyze Claude Code usage stats and determine persona, traits, and fun facts. Called by install.sh with pre-generated stats.
allowed-tools: Read
model: haiku
---

# VibeChecked Analysis

Analyze the user's Claude Code stats and output enrichment data.

## Instructions

### Step 1: Read Stats

Read the stats file at `/tmp/vibes-stats.json`:

```
Read /tmp/vibes-stats.json
```

The JSON contains:
- `stats` - sessions, tokens, tool usage, peak hours
- `promptStats` - prompt counts and lengths
- `wordAnalysis` - top words, politeness score, command counts
- `topics` - topic breakdowns (debugging, frontend, backend, ai, etc.)
- `quirks` - late night sessions, streaks, interrupts, weekend percentage

### Step 2: Determine Persona

Choose ONE persona ID based on the stats:

**Legendary** (exceptional stats):
- `token-titan`: Over 1M total tokens
- `prompt-whisperer`: High cache rate (>40%), efficient
- `tool-master`: 6+ different tools used extensively
- `mcp-pioneer`: Uses custom MCP tools

**Lifestyle** (usage patterns):
- `midnight-architect`: High `lateNightSessions` in quirks
- `dawn-warrior`: High `earlyMorningSessions` in quirks
- `project-nomad`: `projectCount` > 15
- `deep-focus-monk`: `longestSessionMinutes` > 180
- `weekend-warrior`: `weekendPercentage` > 40

**Personality** (from wordAnalysis/topics):
- `the-perfectionist`: High refactoring topic count
- `the-explorer`: Read tool dominant, high question ratio
- `the-speedrunner`: Many short sessions, fast iterations
- `the-diplomat`: `politenessScore` > 50
- `the-commander`: Low politeness, high command ratio

**Roast** (quirky patterns):
- `bash-berserker`: Bash >50% of tool usage
- `opus-maximalist`: Opus dominant in modelUsage
- `context-amnesiac`: Cache rate <15%
- `agent-interrupter`: High `interruptCount`

### Step 3: Generate Output

Output ONLY a JSON block with this exact format (no other text):

```json
{
  "persona": "persona-id-here",
  "traits": ["trait1", "trait2", "trait3"],
  "promptingStyle": "description of their prompting style",
  "communicationTone": "description of their communication tone",
  "funFacts": [
    "Fun fact 1 based on their stats",
    "Fun fact 2 based on their stats",
    "Fun fact 3 based on their stats"
  ]
}
```

**Important:**
- Output ONLY the JSON block, nothing else
- Use exactly 3-5 traits as keywords
- Use exactly 3 fun facts derived from the actual data
- Fun facts should reference specific numbers from the stats
