// Prompt samples (LOCAL DISPLAY ONLY - not sent to server)
export interface PromptSamples {
  first: string;           // First ever prompt
  shortest: string;        // Laziest moment
  longest: string;         // Essay mode
  mostFrustrated?: string; // ALL CAPS or swear words
  samples: string[];       // Representative samples
}

export interface PromptStats {
  totalPrompts: number;
  averageLength: number;
  shortestLength: number;
  longestLength: number;
  allCapsPrompts: number;
}

// Word analysis
export interface WordAnalysis {
  topWords: Array<{ word: string; count: number }>;
  topPhrases: Array<{ phrase: string; count: number }>;
  swearCount: number;
  politenessScore: number;  // 0-100
  commandRatio: number;
  questionMarkRatio: number;
  exclamationCount: number;
  pleaseCount: number;
  thanksCount: number;
  helpCount: number;
  fixCount: number;
  commandCounts: {
    fix: number;
    help: number;
    make: number;
    write: number;
    add: number;
    update: number;
    create: number;
    delete: number;
    debug: number;
  };
}

// Topic breakdown
export interface Topics {
  debugging: number;
  frontend: number;
  backend: number;
  devops: number;
  ai: number;
  testing: number;
  refactoring: number;
}

// Behavioral quirks
export interface Quirks {
  interruptCount: number;
  abandonedSessions: number;
  lateNightSessions: number;
  earlyMorningSessions: number;
  weekendPercentage: number;
  shortestSessionSeconds: number;
  longestStreakDays: number;
}

// Roast evidence for persona reveal
export interface RoastEvidence {
  samplePrompt: string;
  topWord: string;
  topWordCount: number;
}

// Anonymous bundle sent to server - no PII
export interface AnonymousBundle {
  stats: {
    totalSessions: number;
    totalMessages: number;
    totalTokens: {
      input: number;
      output: number;
      cached: number;
    };
    totalToolCalls: number;
    toolUsage: Record<string, number>;
    modelUsage: Record<string, number>;
    hourCounts: number[];
    peakHour: number;
    longestSessionMinutes: number;
    projectCount: number;
    daysActive: number;
  };

  // Enhanced roast data
  promptSamples?: PromptSamples;
  promptStats?: PromptStats;
  wordAnalysis?: WordAnalysis;
  topics?: Topics;
  quirks?: Quirks;
  roastEvidence?: RoastEvidence;

  personaId: string;
  traits: string[];
  promptingStyle: string;
  communicationTone: string;
  funFacts: string[];

  generatedAt: string;
}

// Server-computed percentiles
export interface Percentiles {
  tokenUsage: number;
  toolDiversity: number;
  nightCoding: number;
  sessionLength: number;
  cacheEfficiency: number;
  totalSessions: number;
}

// Full data for rendering (bundle + server enrichment)
export interface WrappedData extends AnonymousBundle {
  percentiles: Percentiles;
  persona: PersonaDefinition;
}

// Persona definition
export interface PersonaDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  gradient: string;
  category: 'legendary' | 'lifestyle' | 'personality' | 'roast';
  icon: string;
  evidence?: string[];  // Evidence lines for why they got this persona
}

// Story slide data
export interface StorySlide {
  id: string;
  component: React.ComponentType<StorySlideProps>;
  duration?: number; // auto-advance time in ms
}

export interface StorySlideProps {
  data: WrappedData;
  onNext: () => void;
  isActive: boolean;
}

// Global stats for landing page
export interface GlobalStats {
  totalWraps: number;
  totalTokensProcessed: number;
  topPersona: string;
  avgSessions: number;
}
