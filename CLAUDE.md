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

1. **Skill** (`skills/vibechecked/`): User installs via `npx skills add colinho/vibechecked`, invokes `/vibechecked` in Claude Code → Python script extracts stats → 3 parallel Claude analyses → deterministic merge into `AnonymousBundle`

2. **Encoding**: Bundle → pako.deflate → base64url → URL param `?d=<encoded>` (or short ID via `?id=<id>`)

3. **Frontend** (`src/`): Decode URL → enrich with percentiles + persona → render 15 animated story slides

4. **API** (`api/`): Vercel serverless functions compute percentiles using Upstash Redis (or in-memory fallback)

### Key Directories

- `src/stories/slides/` - 15 individual animated story slides, each implements `StorySlideProps`
- `src/personas/definitions.ts` - 16+ persona definitions with metadata and `determinePersona()` algorithm
- `src/data/` - Types, URL encoding/decoding, bundle enrichment, mock data
- `skills/vibechecked/` - Claude Code skill with SKILL.md, extract_stats.py, merge_and_upload.py
- `api/` - Vercel serverless endpoints (`submit.ts` for percentiles, `store.ts` for bundle storage)

### Slide Component Pattern

All story slides:
- Accept `data: UsageData`, `onNext: () => void`, `isActive: boolean`
- Use Framer Motion for timing-based reveal sequences
- Exit animations handled by `StoryContainer`

### Persona System

16+ personas across 4 categories (legendary, lifestyle, personality, roast). Determination algorithm in `src/personas/definitions.ts` considers token usage, time patterns, tool diversity, prompt style, and quirks.

### Key Types

- `AnonymousBundle` - Stats sent to server (no PII) - **generated from JSON Schema**
- `UsageData` - Bundle enriched with percentiles and persona for rendering
- `StorySlideProps` - Standard props for all slide components

### Shared Schema

The `AnonymousBundle` type is defined via JSON Schema:

```
schema/bundle.schema.json     # Single source of truth
        ↓
   npm run generate:types
        ↓
└── src/data/bundle.generated.ts   # TypeScript types
```

When modifying the bundle structure:
1. Edit `schema/bundle.schema.json`
2. Run `npm run generate:types`
3. Update `skills/vibechecked/scripts/extract_stats.py` and `merge_and_upload.py` if needed

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7
- Tailwind CSS 4 with sunset theme (dawn #FFF8F0 to twilight #FF8A5B, accents: lavender #bdb7fc, sunset #dd5013, red #da1c1c)
- Framer Motion for animations
- html-to-image for PNG/JPEG export
- Vercel serverless with optional Upstash Redis

## Development Notes

### Testing with Mock Data
Visit `http://localhost:5173/` with no URL params to see mock data. Sample routes available at `/sample_1` through `/sample_4`.

### Testing with production data

To test locally with real data stored on the production server, add a proxy to `vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://getyourvibechecked.vercel.app'
    }
  }
})
```

Then visit `http://localhost:5173/vibes?id=<id>` where `<id>` is a bundle ID from production.

### Skill Scripts

The extraction scripts in `skills/vibechecked/scripts/` use Python stdlib only (no external dependencies).

```bash
python3 skills/vibechecked/scripts/extract_stats.py                              # Extract stats JSON
python3 skills/vibechecked/scripts/extract_stats.py --prompts-dir /tmp/vibes     # Custom prompts dir
python3 skills/vibechecked/scripts/merge_and_upload.py --dry-run                 # Preview merged bundle
```

## Privacy Model

No raw prompts or PII transmitted. Only anonymous aggregated stats sent to server for percentile computation. All analysis happens locally in skill and browser.
