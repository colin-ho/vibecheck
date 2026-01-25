# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VibeChecked is an interactive journey through your Claude Code usage statistics. It generates personalized, animated story experiences showcasing coding stats, developer personas, and shareable cards. Privacy-first design with local-only analysis.

## Commands

```bash
npm run dev          # Start Vite dev server on http://localhost:5173
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build locally
npm run lint         # ESLint check
```

## Architecture

### Data Flow

1. **Skill** (`skill/`): User runs `/vibes` in Claude Code → Python script extracts stats from `~/.claude/stats-cache.json` and session JSONL files → compiled into `AnonymousBundle`

2. **Encoding**: Bundle → pako.deflate → base64url → URL param `?d=<encoded>`

3. **Frontend** (`src/`): Decode URL → enrich with percentiles + persona → render 15 animated story slides

4. **API** (`api/`): Vercel serverless functions compute percentiles using Upstash Redis (or in-memory fallback)

### Key Directories

- `src/stories/slides/` - 15 individual animated story slides, each implements `StorySlideProps`
- `src/personas/definitions.ts` - 16 persona definitions with metadata
- `src/data/` - Types, URL encoding/decoding, bundle enrichment, mock data
- `skill/scripts/` - Python script for local stats extraction
- `api/` - Vercel serverless endpoints

### Slide Component Pattern

All story slides:
- Accept `data: UsageData`, `onNext: () => void`, `isActive: boolean`
- Use Framer Motion for timing-based reveal sequences
- Exit animations handled by `StoryContainer`

### Persona System

16 personas across 4 categories (legendary, lifestyle, personality, roast). Determination algorithm in `decoder.ts` considers token usage, time patterns, tool diversity, prompt style, and quirks.

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7
- Tailwind CSS 4 with sunset theme (dawn #FFF8F0 to twilight #FF8A5B, accents: lavender #bdb7fc, sunset #dd5013, red #da1c1c)
- Framer Motion for animations
- html-to-image for PNG/JPEG export
- Vercel serverless with optional Upstash Redis

## Privacy Model

No raw prompts or PII transmitted. Only anonymous aggregated stats sent to server for percentile computation. All analysis happens locally in plugin and browser.
