# VibeChecked

An interactive journey through your Claude Code usage statistics.

## Usage

```bash
curl -fsSL https://raw.githubusercontent.com/colin-ho/vibecheck/main/skill/install.sh | bash
```

This command:
1. Downloads the analysis script
2. Analyzes your Claude Code usage locally
3. Calls Claude to determine your persona
4. Outputs a personalized URL to visit

**Requirements:**
- Claude Code CLI installed and in PATH
- Python 3.8+
- Existing Claude Code usage stats (`~/.claude/stats-cache.json`)

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
- Python 3.8+
  - macOS: `brew install python3`
  - Ubuntu/Debian: `sudo apt install python3`

## License

MIT License - see LICENSE file for details.
