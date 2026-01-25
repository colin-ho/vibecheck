# VibeChecked Skill

An interactive journey through your Claude Code usage statistics.

## Installation

### Quick Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/colin-ho/vibecheck/main/skill/install.sh | bash
```

This single command:
1. Installs the VibeChecked skill to `~/.claude/skills/vibes/`
2. Automatically analyzes your Claude Code usage
3. Displays your personalized URL to visit

**Requirements:** Claude Code CLI must be installed and you need existing usage stats.

### Manual Install

1. Create the skill directory:
   ```bash
   mkdir -p ~/.claude/skills/vibes
   ```

2. Clone this repository and copy the skill files:
   ```bash
   git clone https://github.com/colin-ho/vibecheck /tmp/vibecheck
   cp /tmp/vibecheck/skill/SKILL.md ~/.claude/skills/vibes/
   cp -r /tmp/vibecheck/skill/scripts ~/.claude/skills/vibes/
   rm -rf /tmp/vibecheck
   ```

3. Make scripts executable:
   ```bash
   chmod +x ~/.claude/skills/vibes/scripts/*.py
   ```

4. Run `/vibes` in Claude Code to generate your vibe check.

## Regenerating Your Vibe Check

To regenerate your stats later (after more Claude Code usage), run the `/vibes` command in Claude Code:

```
/vibes
```

Claude will:
1. Analyze your usage statistics
2. Determine your developer persona
3. Display a URL with your personalized results

## What You'll See

- **Total sessions and messages** - How much you've used Claude Code
- **Token usage** - Input, output, and cached tokens
- **Tool breakdown** - Which tools you use most (Read, Bash, Edit, etc.)
- **Timing patterns** - When you code (night owl or early bird?)
- **Model preferences** - Opus, Sonnet, or Haiku usage
- **Your Developer Persona** - Fun personality based on your patterns

## Privacy

- **Local analysis only** - Your prompts are analyzed locally, never transmitted
- **Anonymous stats** - Only aggregated numbers are sent to the web app
- **No PII** - No personally identifiable information leaves your machine
- **Open source** - Full transparency on what data is collected

## Personas

You might be assigned one of these developer personas:

### Legendary
- **TOKEN TITAN** - Massive token usage
- **PROMPT WHISPERER** - High efficiency, surgical prompts
- **TOOL MASTER** - Diverse tool usage
- **MCP PIONEER** - Custom integrations

### Lifestyle
- **MIDNIGHT ARCHITECT** - Late night coder
- **DAWN WARRIOR** - Early morning commits
- **PROJECT NOMAD** - Many different projects
- **DEEP FOCUS MONK** - Long, focused sessions

### Personality
- **THE PERFECTIONIST** - Lots of refactoring
- **THE EXPLORER** - Read-heavy, curious
- **THE SPEEDRUNNER** - Fast iterations
- **THE DIPLOMAT** - Polite and collaborative
- **THE COMMANDER** - Direct and efficient

### Roast
- **BASH BERSERKER** - Command line warrior
- **OPUS MAXIMALIST** - Only the best model
- **CONTEXT AMNESIAC** - Low cache hit rate
- **AGENT INTERRUPTER** - Frequently interrupts Claude

## Requirements

- Claude Code CLI
- Python 3.8+ (**required**)
  - macOS: `brew install python3`
  - Ubuntu/Debian: `sudo apt install python3`

## Contributing

Contributions welcome! Please read our contributing guidelines first.

## License

MIT License - see LICENSE file for details.
