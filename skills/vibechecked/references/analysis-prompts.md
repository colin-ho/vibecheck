# Prompt Analysis Instructions

Three parallel analyses, each writing its own JSON output file.

---

## Analysis A: Memorable Prompts & Contrasts

**Output file:** `/tmp/vibes-quotes.json`

Search through the prompt files in `/tmp/vibes-prompts/` to find specific examples.

### Strategy
- Use `Glob` to list all files in `/tmp/vibes-prompts/`
- Use `Grep` to search for patterns: ALL CAPS lines, very short lines, keywords like "please", "sorry", "ugh", "wtf", "why"
- Use `Read` to sample representative files (first, last, and 1-2 middle files)

### 1. Memorable Prompts (aim for ALL 4, truncate to ~150 chars)
- **funniest**: Most amusing/entertaining request
- **mostFrustrated**: When they were clearly annoyed (caps, swearing, exasperation)
- **mostAmbitious**: Biggest/most complex ask
- **weirdest**: Most unusual or unexpected request

For each, include a brief "context" explaining why you picked it. Use null if a category truly doesn't exist.

### 2. Contrasts (aim for ALL 4)
- **shortestEffective**: Shortest prompt that still made sense
- **longestRamble**: When they really went off (truncate to ~200 chars)
- **politestMoment**: Most courteous request (truncate to ~150 chars)
- **mostDemanding**: Most direct/demanding request (truncate to ~150 chars)

Use null if a contrast truly doesn't exist.

### 3. Roast Indicators (counts)
- **capsLockPrompts**: Count of prompts that were mostly in ALL CAPS
- **vaguePromptCount**: Count of very short/vague prompts (<30 chars)
- **undoRequests**: How many undo/revert/go back requests

### Output Schema

Write this exact JSON structure to `/tmp/vibes-quotes.json` using the Write tool:

```json
{
  "memorablePrompts": {
    "funniest": {"prompt": "the actual prompt text", "context": "why it's funny"} or null,
    "mostFrustrated": {"prompt": "...", "context": "..."} or null,
    "mostAmbitious": {"prompt": "...", "context": "..."} or null,
    "weirdest": {"prompt": "...", "context": "..."} or null
  },
  "contrasts": {
    "shortestEffective": "shortest prompt text" or null,
    "longestRamble": "truncated long prompt..." or null,
    "politestMoment": "polite prompt text" or null,
    "mostDemanding": "demanding prompt text" or null,
    "capsLockPrompts": 0,
    "vaguePromptCount": 0,
    "undoRequests": 0
  }
}
```

---

## Analysis B: Communication Style & Obsessions

**Output file:** `/tmp/vibes-style.json`

Read the prompt files in `/tmp/vibes-prompts/` and also read the pre-computed top words from `/tmp/vibes-stats.json` (the `topWords` field).

### Strategy
- Read `/tmp/vibes-stats.json` to get the `topWords` list for reference
- Use `Grep` to search for repeated phrases, filler words, opening patterns
- Use `Read` to sample prompt files for style analysis

### 1. Communication Style (find roastable patterns)
- **catchphrases**: 2-5 lazy phrases they repeat ("just fix", "make it work", "idk")
- **signatureOpeners**: 2-3 ways they start prompts, especially low-effort ones
- **verbalTics**: Filler words, hedging ("basically", "just", "like", "idk")
- **politenessLevel**: One of: "diplomatic", "direct", "demanding", "apologetic"
- **averagePromptLength**: Estimate average character length
- **promptingEvolution**: One roasty sentence about their style

### 2. Phrase Analysis
- **topPhrases**: 5 most common 2-3 word phrases with estimated counts
- **dominantTopics**: REQUIRED — Pick 3-5 from: debugging, frontend, backend, devops, ai, testing, refactoring

### 3. Obsessions
- **topics**: 4-5 technical areas they focus on most
- **frequentlyRevisited**: 4-5 problems they kept coming back to
- **actualProjects**: 4-5 things they were building (infer from context)

### Output Schema

Write this exact JSON structure to `/tmp/vibes-style.json` using the Write tool:

```json
{
  "communicationStyle": {
    "catchphrases": ["phrase1", "phrase2"],
    "signatureOpeners": ["opener1", "opener2"],
    "verbalTics": ["tic1", "tic2"],
    "politenessLevel": "direct",
    "averagePromptLength": 150,
    "promptingEvolution": "One roasty sentence"
  },
  "topPhrases": [
    {"phrase": "just fix", "count": 10},
    {"phrase": "make it", "count": 8}
  ],
  "dominantTopics": ["debugging", "frontend", "backend"],
  "obsessions": {
    "topics": ["topic1", "topic2"],
    "frequentlyRevisited": ["problem1", "problem2"],
    "actualProjects": ["project1", "project2"]
  }
}
```

---

## Analysis C: Persona, Traits, Style, Tone, Fun Facts

**Output file:** `/tmp/vibes-persona.json`

Read the numeric stats from `/tmp/vibes-stats.json` and sample the prompt files in `/tmp/vibes-prompts/`.

### Strategy
- Read `/tmp/vibes-stats.json` for full numeric stats (sessions, tokens, tools, hours, quirks, topWords)
- Sample prompt files for qualitative patterns
- Use the persona definitions below to pick the best match

### Persona Definitions

Pick the ONE persona that roasts the user HARDEST:

1. **`token-burner`**: Over 2M tokens, uses 8+ tools with 2000+ calls, has MCP tools. "Anthropic's favorite customer"
2. **`vibe-coder`**: Short/vague prompts, high "fix"/"help" counts. "just make it work lol"
3. **`debug-demon`**: Constant debugging, high error/bug counts. "Your code: broken. Your spirit: also broken."
4. **`essay-writer`**: Average prompt > 400 chars. "Your prompts need a TL;DR"
5. **`3am-demon`**: >20% night sessions (10PM-4AM). "Sleep is for the weak"
6. **`squirrel-brain`**: Many interrupts/abandoned sessions, CAPS usage. "Ooh shiny— wait what were we doing?"
7. **`bash-berserker`**: >50% Bash tool usage. "When in doubt, sudo"
8. **`domain-disaster`**: CSS/regex/git struggles dominate. "Centering a div is your villain origin story"
9. **`code-roulette`**: Trial and error, refactoring working code. "Spin the wheel, see what happens"

Check in order 1-9, assign the first strong match. Fallback: `totalSessions % 5` indexes into `[vibe-coder, code-roulette, debug-demon, squirrel-brain, essay-writer]`.

### What to Generate
- **persona**: One persona ID from the 9 options
- **traits**: 3-5 roasty keywords (e.g., "accepting", "chaotic", "repetitive")
- **promptingStyle**: One savage sentence about their prompting style
- **communicationTone**: One savage sentence about their communication tone
- **funFacts**: 3-5 specific, number-backed ROASTS using actual stats (e.g., "You said 'fix' 847 times. Have you considered writing code that works?")

### Output Schema

Write this exact JSON structure to `/tmp/vibes-persona.json` using the Write tool:

```json
{
  "persona": "debug-demon",
  "traits": ["persistent", "repetitive", "chaotic"],
  "promptingStyle": "One savage sentence",
  "communicationTone": "One savage sentence",
  "funFacts": [
    "Number-backed roast 1",
    "Number-backed roast 2",
    "Number-backed roast 3"
  ]
}
```
