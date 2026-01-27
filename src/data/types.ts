// Re-export generated bundle types (shared with Python)
export type {
	AnonymousBundle,
	Stats,
	TokenCounts,
	DailyActivity,
	Quirks,
	Insights,
	MemorablePrompts,
	PromptWithContext,
	CommunicationStyle,
	Obsessions,
	Contrasts,
	WordCount,
	PhraseCount,
} from './bundle.generated'

// Import for use in this file
import type { AnonymousBundle } from './bundle.generated'

// ============================================================
// TypeScript-only types (not shared with Python)
// ============================================================

// Server-computed percentiles
export interface Percentiles {
	tokenUsage: number
	toolDiversity: number
	nightCoding: number
	sessionLength: number
	cacheEfficiency: number
	totalSessions: number
}

// Full data for rendering (bundle + server enrichment)
export interface UsageData extends AnonymousBundle {
	percentiles: Percentiles
	persona: PersonaDefinition
	bundleId?: string // Short ID for sharing (when loaded via ?id=)
}

// Persona definition - all personas roast
export interface PersonaDefinition {
	id: string
	name: string
	tagline: string
	description: string
	color: string
	gradient: string
	icon: string
	evidence?: string[] // Evidence lines for why they got this persona
}

// Story slide data
export interface StorySlide {
	id: string
	component: React.ComponentType<StorySlideProps>
	duration?: number // auto-advance time in ms
}

export interface StorySlideProps {
	data: UsageData
	onNext: () => void
	isActive: boolean
}

// Global stats for landing page
export interface GlobalStats {
	totalWraps: number
	totalTokensProcessed: number
	topPersona: string
	avgSessions: number
}
