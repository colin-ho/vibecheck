# VibeChecked

An interactive journey through your Claude Code usage statistics.

## Overview

VibeChecked generates a personalized, animated story experience that showcases your Claude Code usage statistics, determines your developer persona, and creates shareable cards for social media.

## Features

- **12-Screen Story Experience** - Animated slides showing your coding journey
- **Usage Statistics** - Sessions, tokens, tool usage, timing patterns
- **Developer Persona** - Fun personality assigned based on your patterns
- **Shareable Cards** - Download images or share directly to Twitter/X
- **Privacy-First** - Raw prompts never leave your machine

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Image Export**: html-to-image
- **Deployment**: Vercel

## Project Structure

```
vibechecked/
├── api/                          # Vercel serverless functions
│   ├── submit.ts                 # Receive bundles, compute percentiles
│   └── stats.ts                  # Global aggregate stats
│
├── skill/                        # Stats extraction scripts
│   ├── scripts/
│   │   ├── vibes.py              # Main script: extract stats, call Claude, upload
│   │   └── bundle_types.py       # Pydantic models (generated from schema)
│   ├── tests/                    # Python tests
│   ├── install.sh                # One-line installer
│   └── README.md
│
├── src/
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global styles + Tailwind
│   │
│   ├── data/
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── decoder.ts            # URL param decoding
│   │   └── mockData.ts           # Development data
│   │
│   ├── personas/
│   │   └── definitions.ts        # Persona definitions & logic
│   │
│   ├── stories/
│   │   ├── StoryContainer.tsx    # Story orchestrator
│   │   └── slides/               # Individual story slides
│   │       ├── IntroStory.tsx
│   │       ├── SessionsStory.tsx
│   │       ├── TimeStory.tsx
│   │       ├── TokensStory.tsx
│   │       ├── CacheStory.tsx
│   │       ├── ToolsStory.tsx
│   │       ├── TimingStory.tsx
│   │       ├── ModelsStory.tsx
│   │       ├── ProjectsStory.tsx
│   │       ├── QuirksStory.tsx
│   │       ├── PersonaStory.tsx
│   │       └── ShareStory.tsx
│   │
│   ├── share/
│   │   └── imageGenerator.ts     # Share card generation
│   │
│   └── components/
│       ├── AnimatedNumber.tsx    # Counting animations
│       ├── GradientBackground.tsx
│       └── ShareCard.tsx         # Social share card
│
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running with Mock Data

The app automatically loads mock data when no URL parameters are present. Visit `http://localhost:5173/` to see the experience with sample data.

### Testing with Custom Data

Encode your data and pass it as a URL parameter:

```
http://localhost:5173/?d=<base64url-encoded-gzipped-json>
```

## Usage

```bash
curl -fsSL https://howsyourvibecoding.vercel.app/install.sh | bash
```

This downloads and runs the script, which:
1. Extracts your Claude Code usage stats locally
2. Calls Claude to analyze and determine your persona
3. Uploads anonymous stats and returns a personalized URL

**Requirements:** Claude Code CLI, Python 3.8+, existing usage stats

## Story Screens

1. **Intro** - Terminal-themed "YOUR JOURNEY IN CODE" opening
2. **Sessions** - Total sessions with comparison
3. **Time** - Hours spent pair programming
4. **Tokens** - Input/output token flow visualization
5. **Cache** - Cache hit rate and estimated savings
6. **Tools** - Animated bar chart of tool usage
7. **Timing** - 24-hour heatmap and peak hour
8. **Models** - Opus/Sonnet/Haiku pie chart
9. **Projects** - Project diversity stats
10. **Quirks** - Fun observations and facts
11. **Persona** - The big reveal with 3D card flip
12. **Share** - Summary card and social sharing

## Personas

### Legendary (Top performers)
- TOKEN TITAN - Massive token usage
- PROMPT WHISPERER - High efficiency
- TOOL MASTER - Diverse tool usage
- MCP PIONEER - Custom integrations

### Lifestyle (Usage patterns)
- MIDNIGHT ARCHITECT - Late night coder
- DAWN WARRIOR - Early morning commits
- PROJECT NOMAD - Many projects
- DEEP FOCUS MONK - Long sessions

### Personality (Based on style)
- THE PERFECTIONIST - Lots of refactoring
- THE EXPLORER - Read-heavy, curious
- THE SPEEDRUNNER - Fast iterations
- THE DIPLOMAT - Polite and collaborative
- THE COMMANDER - Direct and efficient

### Roast (Self-deprecating humor)
- BASH BERSERKER - >60% Bash usage
- OPUS MAXIMALIST - Heavy Opus usage
- CONTEXT AMNESIAC - Low cache rate
- AGENT INTERRUPTER - Frequently interrupts

## Privacy

- **Local Analysis** - Prompts analyzed locally, never transmitted
- **Anonymous Stats** - Only aggregated numbers sent to web app
- **No PII** - No personally identifiable information leaves your machine
- **Open Source** - Full transparency on data collection

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

No environment variables required for basic deployment. For persistent storage, configure Vercel KV or a database.

## License

MIT
