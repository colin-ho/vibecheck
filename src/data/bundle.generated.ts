/* eslint-disable */
/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from schema/bundle.schema.json
 * Run 'npm run generate:types' to regenerate
 */

/**
 * Anonymous bundle sent to server - no PII. Shared between Python (vibes.py) and TypeScript (types.ts).
 */
export interface AnonymousBundle {
  stats: Stats;
  quirks?: Quirks;
  insights?: Insights;
  /**
   * Persona identifier
   */
  personaId: string;
  /**
   * List of trait keywords
   */
  traits: string[];
  /**
   * Description of prompting style
   */
  promptingStyle: string;
  /**
   * Description of communication tone
   */
  communicationTone: string;
  /**
   * List of fun facts about usage
   */
  funFacts: string[];
  /**
   * ISO 8601 timestamp of bundle generation
   */
  generatedAt: string;
}
/**
 * Core usage statistics
 */
export interface Stats {
  totalSessions: number;
  totalMessages: number;
  totalTokens: TokenCounts;
  totalToolCalls: number;
  /**
   * Map of tool name to usage count
   */
  toolUsage: {
    [k: string]: number;
  };
  /**
   * Map of model name to token count
   */
  modelUsage: {
    [k: string]: number;
  };
  /**
   * Session counts by hour (0-23)
   *
   * @minItems 24
   * @maxItems 24
   */
  hourCounts: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  peakHour: number;
  longestSessionMinutes: number;
  /**
   * Total time across all sessions in minutes (calculated from timestamps)
   */
  totalMinutes?: number;
  projectCount: number;
  daysActive: number;
  /**
   * Daily activity for contribution grid
   */
  activeDates?: DailyActivity[];
}
export interface TokenCounts {
  input: number;
  output: number;
  /**
   * Cache read tokens (served from cache)
   */
  cached: number;
  /**
   * Cache creation tokens (written to cache)
   */
  cacheCreation?: number;
}
export interface DailyActivity {
  /**
   * Date in YYYY-MM-DD format
   */
  date: string;
  sessions: number;
}
/**
 * Behavioral quirks (time-based, computed from session data)
 */
export interface Quirks {
  interruptCount: number;
  abandonedSessions: number;
  lateNightSessions: number;
  earlyMorningSessions: number;
  weekendPercentage: number;
  shortestSessionSeconds: number;
  longestStreakDays: number;
}
/**
 * Claude-generated insights from prompt analysis
 */
export interface Insights {
  memorablePrompts?: MemorablePrompts;
  communicationStyle?: CommunicationStyle;
  obsessions?: Obsessions;
  contrasts?: Contrasts;
  /**
   * Most meaningful words used
   */
  topWords?: WordCount[];
  /**
   * Most common meaningful phrases
   */
  topPhrases?: PhraseCount[];
  /**
   * Primary areas of focus (debugging, frontend, backend, devops, ai, testing, refactoring)
   */
  dominantTopics?: string[];
}
/**
 * Notable prompts found during analysis - aim for all 4, allow nulls if data sparse
 */
export interface MemorablePrompts {
  funniest?: PromptWithContext;
  mostFrustrated?: PromptWithContext;
  mostAmbitious?: PromptWithContext;
  weirdest?: PromptWithContext;
}
export interface PromptWithContext {
  /**
   * The actual prompt text (truncated if needed)
   */
  prompt: string;
  /**
   * Brief context about why this prompt was selected
   */
  context?: string;
}
/**
 * Analysis of how the user communicates
 */
export interface CommunicationStyle {
  /**
   * Unique phrases they repeat
   */
  catchphrases?: string[];
  /**
   * How they typically start prompts
   */
  signatureOpeners?: string[];
  /**
   * Filler words, hedging patterns
   */
  verbalTics?: string[];
  /**
   * Overall politeness characterization
   */
  politenessLevel?: "diplomatic" | "direct" | "demanding" | "apologetic";
  /**
   * Average character length of prompts
   */
  averagePromptLength?: number;
  /**
   * How their style changed over time
   */
  promptingEvolution?: string;
}
/**
 * What the user focused on
 */
export interface Obsessions {
  /**
   * Technical areas they focus on
   */
  topics?: string[];
  /**
   * Problems they kept coming back to
   */
  frequentlyRevisited?: string[];
  /**
   * What they were actually building (inferred)
   */
  actualProjects?: string[];
}
/**
 * Interesting contrasts in prompting style - aim for all 4, allow nulls if data sparse
 */
export interface Contrasts {
  /**
   * Shortest prompt that still got results
   */
  shortestEffective?: string;
  /**
   * When they really went off (truncated)
   */
  longestRamble?: string;
  /**
   * Most courteous request
   */
  politestMoment?: string;
  /**
   * Most direct/demanding request
   */
  mostDemanding?: string;
  /**
   * Count of prompts that were mostly ALL CAPS
   */
  capsLockPrompts?: number;
  /**
   * Count of very short/vague prompts (<30 chars)
   */
  vaguePromptCount?: number;
  /**
   * How many times they asked to undo/revert/go back
   */
  undoRequests?: number;
}
export interface WordCount {
  word: string;
  count: number;
}
export interface PhraseCount {
  phrase: string;
  count: number;
}
