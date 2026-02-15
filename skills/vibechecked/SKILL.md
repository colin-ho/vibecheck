---
name: vibechecked
description: Generate your personalized VibeChecked developer persona story — an animated journey through your Claude Code usage statistics. Use when the user wants to generate their VibeChecked profile or see their coding stats.
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep, Write, Task
---

# VibeChecked

Generate a personalized, shareable developer persona story from the user's Claude Code usage stats.

## Step 1: Check Prerequisites

Check that `~/.claude/stats-cache.json` exists. If it doesn't, tell the user:
"You need to use Claude Code for a while first before generating your VibeChecked profile. The stats file at ~/.claude/stats-cache.json doesn't exist yet."

Also check that `python3` is available by running `python3 --version`. If not available, tell the user they need Python 3.8+ installed.

## Step 2: Find the Skill Directory

Locate the skill's scripts directory:

```bash
SKILL_SCRIPTS=$(dirname "$(find ~/.claude -name "extract_stats.py" -path "*/vibechecked/*" 2>/dev/null | head -1)")
```

If not found in `~/.claude`, also check `.claude`:

```bash
SKILL_SCRIPTS=$(dirname "$(find .claude -name "extract_stats.py" -path "*/vibechecked/*" 2>/dev/null | head -1)")
```

## Step 3: Extract Stats

Run the extraction script and save output:

```bash
python3 "$SKILL_SCRIPTS/extract_stats.py" --prompts-dir /tmp/vibes-prompts > /tmp/vibes-stats.json
```

This produces:
- `/tmp/vibes-stats.json` — Numeric stats, quirks, top words
- `/tmp/vibes-prompts/` — User's prompts as chunked text files (500 per file, separated by `\n\n---\n\n`)

## Step 4: Run 3 Parallel Analyses

Read the analysis instructions from `references/analysis-prompts.md` (in the same directory as this SKILL.md).

Launch **3 Task agents in parallel** (all in a single message using the Task tool). Each agent reads the prompt files and writes its analysis to a specific JSON output file:

### Task A: Memorable Prompts & Contrasts
Prompt the agent with the Analysis A instructions from `references/analysis-prompts.md`. The agent should:
- Read prompt files from `/tmp/vibes-prompts/` using Glob, Grep, and Read
- Find memorable prompts (funniest, mostFrustrated, mostAmbitious, weirdest) and contrasts
- Count roast indicators (CAPS prompts, vague prompts, undo requests)
- Write output to `/tmp/vibes-quotes.json`

### Task B: Communication Style & Obsessions
Prompt the agent with the Analysis B instructions from `references/analysis-prompts.md`. The agent should:
- Read `/tmp/vibes-stats.json` for the topWords list
- Read prompt files from `/tmp/vibes-prompts/` using Glob, Grep, and Read
- Analyze communication style, phrases, topics, and obsessions
- Write output to `/tmp/vibes-style.json`

### Task C: Persona Assignment
Prompt the agent with the Analysis C instructions from `references/analysis-prompts.md`. The agent should:
- Read `/tmp/vibes-stats.json` for full numeric stats
- Read prompt files from `/tmp/vibes-prompts/` using Glob, Grep, and Read
- Assign persona, generate traits, style, tone, and fun facts
- Write output to `/tmp/vibes-persona.json`

**Important:** Launch all 3 Task agents in a single response so they run in parallel.

## Step 5: Merge and Upload

After all 3 analyses complete, run the merge script:

```bash
python3 "$SKILL_SCRIPTS/merge_and_upload.py"
```

This deterministically combines the 4 JSON files into the final AnonymousBundle, uploads to the server, and prints the URL.

## Step 6: Present the Result

Show the user the URL from Step 5 output. Example:

```
Your vibe check is ready!
https://getyourvibechecked.vercel.app/vibes?id=abc123xy
```

## Step 7: Cleanup

```bash
rm -rf /tmp/vibes-prompts /tmp/vibes-stats.json /tmp/vibes-quotes.json /tmp/vibes-style.json /tmp/vibes-persona.json
```
