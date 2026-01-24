import { WrappedData } from './types';
import { getPersona } from '../personas/definitions';

export const mockData: WrappedData = {
  stats: {
    totalSessions: 847,
    totalMessages: 12453,
    totalTokens: {
      input: 4521890,
      output: 2134567,
      cached: 1876543,
    },
    totalToolCalls: 8934,
    toolUsage: {
      'Read': 2847,
      'Bash': 2341,
      'Edit': 1876,
      'Write': 892,
      'Grep': 534,
      'Glob': 298,
      'Task': 146,
    },
    modelUsage: {
      'sonnet': 3245678,
      'opus': 1876543,
      'haiku': 534236,
    },
    hourCounts: [
      23, 18, 12, 8, 5, 12, 34, 56,   // 0-7
      78, 89, 92, 87, 76, 82, 91, 95, // 8-15
      89, 78, 67, 54, 45, 38, 32, 28  // 16-23
    ],
    peakHour: 15,
    longestSessionMinutes: 247,
    projectCount: 23,
    daysActive: 156,
  },

  // Prompt samples for roast mode
  promptSamples: {
    first: "help me fix this authentication bug its been 3 hours and I can't figure out why the JWT token isn't being validated correctly",
    shortest: "fix it",
    longest: "I need you to help me understand why this React component is re-rendering so many times. I've tried using useMemo and useCallback but nothing seems to work. The component receives props from a parent that fetches data from an API. When the data changes, the entire tree re-renders even though only some parts need to update. I've also tried React.memo but the comparison function doesn't seem to help. Can you analyze the code and suggest optimizations? Also, should I be using a state management library like Redux or Zustand instead?",
    mostFrustrated: "WHY IS THIS NOT WORKING I HAVE TRIED EVERYTHING",
    samples: [
      "can you help me debug this function",
      "add a loading spinner to the button",
      "fix the CSS alignment issue",
      "why is this test failing",
      "refactor this to use async/await",
      "add error handling to the API call",
      "how do I center this div",
      "fix the type error on line 42",
      "make this component responsive",
      "help me understand this error message"
    ]
  },

  promptStats: {
    totalPrompts: 12453,
    averageLength: 87,
    shortestLength: 6,
    longestLength: 2341,
    allCapsPrompts: 23,
  },

  // Word analysis
  wordAnalysis: {
    topWords: [
      { word: 'fix', count: 847 },
      { word: 'help', count: 634 },
      { word: 'error', count: 521 },
      { word: 'code', count: 498 },
      { word: 'function', count: 432 },
      { word: 'component', count: 387 },
      { word: 'add', count: 356 },
      { word: 'update', count: 298 },
      { word: 'test', count: 267 },
      { word: 'file', count: 234 },
      { word: 'debug', count: 212 },
      { word: 'api', count: 198 },
      { word: 'data', count: 187 },
      { word: 'please', count: 156 },
      { word: 'working', count: 143 },
      { word: 'change', count: 132 },
      { word: 'create', count: 121 },
      { word: 'issue', count: 109 },
      { word: 'need', count: 98 },
      { word: 'why', count: 87 },
    ],
    topPhrases: [
      { phrase: 'can you', count: 234 },
      { phrase: 'help me', count: 198 },
      { phrase: 'fix this', count: 167 },
      { phrase: 'not working', count: 143 },
      { phrase: 'how do', count: 132 },
      { phrase: 'add a', count: 121 },
      { phrase: 'error message', count: 98 },
      { phrase: 'this function', count: 87 },
      { phrase: 'please help', count: 76 },
      { phrase: 'why is', count: 65 },
    ],
    swearCount: 12,
    politenessScore: 45,
    commandRatio: 0.67,
    questionMarkRatio: 0.34,
    exclamationCount: 89,
    pleaseCount: 156,
    thanksCount: 87,
    helpCount: 634,
    fixCount: 847,
    commandCounts: {
      fix: 847,
      help: 634,
      make: 234,
      write: 198,
      add: 356,
      update: 298,
      create: 121,
      delete: 67,
      debug: 212,
    }
  },

  // Topic breakdown
  topics: {
    debugging: 1234,
    frontend: 876,
    backend: 654,
    devops: 234,
    ai: 156,
    testing: 432,
    refactoring: 298,
  },

  // Behavioral quirks
  quirks: {
    interruptCount: 23,
    abandonedSessions: 47,
    lateNightSessions: 89,
    earlyMorningSessions: 34,
    weekendPercentage: 28,
    shortestSessionSeconds: 12,
    longestStreakDays: 14,
  },

  // Roast evidence
  roastEvidence: {
    samplePrompt: "idk why this doesn't work just fix it please",
    topWord: "fix",
    topWordCount: 847,
  },

  personaId: 'vibe-coder',
  traits: ['night-owl', 'impatient', 'debugging-heavy'],
  promptingStyle: 'terse and direct',
  communicationTone: 'casual with occasional frustration',
  funFacts: [
    'You said "fix" 847 times',
    'Your longest session was 4 hours 7 minutes',
    'You\'ve worked on 23 different projects',
    '89 sessions happened after midnight',
    'You interrupted Claude 23 times',
  ],
  generatedAt: new Date().toISOString(),
  percentiles: {
    tokenUsage: 15,
    toolDiversity: 8,
    nightCoding: 3,
    sessionLength: 12,
    cacheEfficiency: 25,
    totalSessions: 5,
  },
  persona: getPersona('vibe-coder'),
};

// Generate varied mock data for testing different personas
export function generateMockData(personaId?: string): WrappedData {
  const id = personaId || 'vibe-coder';
  return {
    ...mockData,
    personaId: id,
    persona: getPersona(id),
  };
}

// Generate mock data for a "polite" user
export function generatePoliteMockData(): WrappedData {
  return {
    ...mockData,
    wordAnalysis: {
      ...mockData.wordAnalysis!,
      politenessScore: 85,
      pleaseCount: 456,
      thanksCount: 387,
    },
    personaId: 'polite-menace',
    persona: getPersona('polite-menace'),
    traits: ['polite', 'methodical', 'thorough'],
    promptingStyle: 'detailed and courteous',
    communicationTone: 'professional and appreciative',
  };
}

// Generate mock data for a "3AM demon"
export function generateNightOwlMockData(): WrappedData {
  return {
    ...mockData,
    quirks: {
      ...mockData.quirks!,
      lateNightSessions: 234,
      earlyMorningSessions: 12,
    },
    stats: {
      ...mockData.stats,
      hourCounts: [
        45, 38, 32, 28, 18, 8, 12, 23,   // 0-7 (high late night)
        34, 45, 56, 67, 78, 89, 91, 95,  // 8-15
        89, 78, 67, 56, 67, 78, 89, 67   // 16-23
      ],
      peakHour: 1,
    },
    personaId: '3am-demon',
    persona: getPersona('3am-demon'),
    traits: ['night-owl', 'caffeinated', 'deadline-driven'],
    promptingStyle: 'increasingly desperate',
    communicationTone: 'exhausted but determined',
  };
}

// Generate mock data for an "essay writer"
export function generateEssayWriterMockData(): WrappedData {
  return {
    ...mockData,
    promptStats: {
      ...mockData.promptStats!,
      averageLength: 456,
      longestLength: 4567,
    },
    promptSamples: {
      ...mockData.promptSamples!,
      longest: "I need a comprehensive analysis of this codebase including all the architectural decisions, the patterns used, potential improvements, performance optimizations, security considerations, testing strategies, documentation needs, deployment pipelines, monitoring solutions, and a detailed roadmap for the next six months of development with specific milestones and deliverables for each sprint including story point estimates and risk assessments for each major feature...",
    },
    personaId: 'essay-writer',
    persona: getPersona('essay-writer'),
    traits: ['verbose', 'thorough', 'context-heavy'],
    promptingStyle: 'exhaustively detailed',
    communicationTone: 'professional and comprehensive',
  };
}
