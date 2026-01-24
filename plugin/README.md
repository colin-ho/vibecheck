# Claude Code Wrapped Plugin

Your year in code with Claude - A Spotify Wrapped-like experience for Claude Code users.

## Installation

### Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/claude-wrapped/plugin/main/install.sh | bash
```

### Manual Install

1. Clone this repository to your Claude plugins directory:
   ```bash
   git clone https://github.com/claude-wrapped/claude-code-plugin ~/.claude/plugins/claude-wrapped
   ```

2. Make scripts executable:
   ```bash
   chmod +x ~/.claude/plugins/claude-wrapped/scripts/*.sh
   ```

## Usage

Simply run the `/wrapped` command in Claude Code:

```
/wrapped
```

Claude will:
1. Analyze your usage statistics
2. Determine your developer persona
3. Open an interactive web experience with your personalized results

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

You might be assigned one of these fun personas:

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
- `jq` for JSON processing (recommended)
- `gzip` and `base64` for data encoding

## Contributing

Contributions welcome! Please read our contributing guidelines first.

## License

MIT License - see LICENSE file for details.
