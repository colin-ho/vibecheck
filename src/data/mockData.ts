import { DailyActivity, UsageData } from './types'
import { getPersona } from '../personas/definitions'

// Generate realistic mock activeDates spread over the past year
function generateMockActiveDates(): DailyActivity[] {
	const dates: DailyActivity[] = []
	const today = new Date()

	// Generate 156 active days with varying session counts
	// Cluster activity in bursts to simulate real usage patterns
	for (let i = 0; i < 364; i++) {
		const date = new Date(today)
		date.setDate(today.getDate() - (363 - i))

		// Simulate realistic patterns: more activity on weekdays, occasional bursts
		const dayOfWeek = date.getDay()
		const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5

		// Base probability of activity
		let activityChance = isWeekday ? 0.5 : 0.2

		// Add some bursts of activity (project deadlines, etc.)
		const weekNum = Math.floor(i / 7)
		if (weekNum % 4 === 0 || weekNum % 4 === 1) {
			activityChance += 0.2 // Higher activity in sprint weeks
		}

		// Seasonal variation - more coding in winter months
		const month = date.getMonth()
		if (month >= 10 || month <= 2) {
			activityChance += 0.1
		}

		if (Math.random() < activityChance) {
			dates.push({
				date: date.toISOString().split('T')[0],
				sessions: Math.floor(Math.random() * 8) + 1, // 1-8 sessions
			})
		}
	}

	return dates
}

const mockActiveDates = generateMockActiveDates()

export const mockData: UsageData = {
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
			Read: 2847,
			Bash: 2341,
			Edit: 1876,
			Write: 892,
			Grep: 534,
			Glob: 298,
			Task: 146,
		},
		modelUsage: {
			sonnet: 3245678,
			opus: 1876543,
			haiku: 534236,
		},
		hourCounts: [
			23,
			18,
			12,
			8,
			5,
			12,
			34,
			56, // 0-7
			78,
			89,
			92,
			87,
			76,
			82,
			91,
			95, // 8-15
			89,
			78,
			67,
			54,
			45,
			38,
			32,
			28, // 16-23
		],
		peakHour: 15,
		longestSessionMinutes: 247,
		projectCount: 23,
		daysActive: mockActiveDates.length,
		activeDates: mockActiveDates,
	},

	// Behavioral quirks (time-based)
	quirks: {
		interruptCount: 23,
		abandonedSessions: 47,
		lateNightSessions: 89,
		earlyMorningSessions: 34,
		weekendPercentage: 28,
		shortestSessionSeconds: 12,
		longestStreakDays: 14,
	},

	// Claude-generated insights
	insights: {
		memorablePrompts: {
			funniest: {
				prompt: 'can you make this code not suck',
				context: 'A refreshingly honest request for code improvement',
			},
			mostFrustrated: {
				prompt: 'WHY IS THIS NOT WORKING I HAVE TRIED EVERYTHING',
				context: "All caps, clearly at wit's end after hours of debugging",
			},
			mostAmbitious: {
				prompt:
					"I need you to help me understand why this React component is re-rendering so many times. I've tried using useMemo and useCallback but nothing seems to work...",
				context: 'A deep dive into React performance optimization spanning multiple components',
			},
			biggestFacepalm: {
				prompt: 'oh wait I forgot to save the file',
				context: 'Classic developer moment after 30 minutes of debugging',
			},
			mostGrateful: {
				prompt: "you're a lifesaver, that fixed everything!",
				context: 'After Claude solved a tricky authentication bug',
			},
			weirdest: {
				prompt: 'make the button more... buttony',
				context: 'A UI request that somehow made perfect sense in context',
			},
			lateNightRamble: {
				prompt:
					'so basically i have this thing and it needs to do the thing but its not doing the thing right now...',
				context: 'Sent at 3:47 AM, coherence optional',
			},
		},
		communicationStyle: {
			catchphrases: ['can you just...', 'help me understand', 'fix this please'],
			signatureOpeners: ['Hey Claude', 'Can you help me', 'Quick question:'],
			verbalTics: ['basically', 'just', 'like'],
			politenessLevel: 'direct',
			promptingEvolution:
				'Started with verbose explanations, gradually became more terse and efficient over time',
		},
		obsessions: {
			topics: ['React performance', 'authentication', 'CSS alignment', 'TypeScript types'],
			frequentlyRevisited: ['that auth bug', 'centering divs', 'async/await patterns'],
			actualProjects: ['E-commerce dashboard', 'CLI tool', 'Personal portfolio', 'API integration'],
		},
		contrasts: {
			shortestEffective: 'fix it',
			longestRamble:
				'I need a comprehensive analysis of this codebase including all the architectural decisions, the patterns used, potential improvements, performance optimizations, security considerations, testing strategies, documentation needs...',
			politestMoment:
				'Would you mind terribly taking a look at this code when you have a moment? No rush at all, but I would really appreciate your help.',
			mostDemanding: 'Just make it work. Now.',
		},
		topWords: [
			{ word: 'fix', count: 847 },
			{ word: 'help', count: 634 },
			{ word: 'error', count: 521 },
			{ word: 'component', count: 387 },
			{ word: 'add', count: 356 },
			{ word: 'update', count: 298 },
			{ word: 'test', count: 267 },
			{ word: 'debug', count: 212 },
			{ word: 'api', count: 198 },
			{ word: 'please', count: 156 },
		],
		topPhrases: [
			{ phrase: 'can you', count: 234 },
			{ phrase: 'help me', count: 198 },
			{ phrase: 'fix this', count: 167 },
			{ phrase: 'not working', count: 143 },
			{ phrase: 'how do', count: 132 },
		],
		dominantTopics: ['debugging', 'frontend', 'testing'],
	},

	personaId: 'the-commander',
	traits: ['night-owl', 'impatient', 'debugging-heavy', 'direct'],
	promptingStyle: 'Terse and direct, gets straight to the point',
	communicationTone: 'Casual with occasional frustration, prefers efficiency over pleasantries',
	funFacts: [
		'You said "fix" 847 times',
		'Your longest session was 4 hours 7 minutes',
		"You've worked on 23 different projects",
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
	persona: getPersona('the-commander'),
}

// Generate varied mock data for testing different personas
export function generateMockData(personaId?: string): UsageData {
	const id = personaId || 'the-commander'
	return {
		...mockData,
		personaId: id,
		persona: getPersona(id),
	}
}

// Generate mock data for a "polite" user
export function generatePoliteMockData(): UsageData {
	return {
		...mockData,
		insights: {
			...mockData.insights!,
			communicationStyle: {
				...mockData.insights!.communicationStyle,
				politenessLevel: 'diplomatic',
				catchphrases: ['if you could please', 'when you have a moment', 'thank you so much'],
			},
			contrasts: {
				...mockData.insights!.contrasts,
				politestMoment:
					'I apologize for bothering you, but would it be possible for you to help me understand this error?',
			},
		},
		personaId: 'the-diplomat',
		persona: getPersona('the-diplomat'),
		traits: ['polite', 'methodical', 'thorough'],
		promptingStyle: 'Detailed and courteous',
		communicationTone: 'Professional and appreciative',
	}
}

// Generate mock data for a "3AM demon"
export function generateNightOwlMockData(): UsageData {
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
				45,
				38,
				32,
				28,
				18,
				8,
				12,
				23, // 0-7 (high late night)
				34,
				45,
				56,
				67,
				78,
				89,
				91,
				95, // 8-15
				89,
				78,
				67,
				56,
				67,
				78,
				89,
				67, // 16-23
			],
			peakHour: 1,
		},
		insights: {
			...mockData.insights!,
			memorablePrompts: {
				...mockData.insights!.memorablePrompts,
				lateNightRamble: {
					prompt:
						'ok so this thing needs to do the stuff but its not working and i think maybe its the database or maybe the api or possibly cosmic rays',
					context: 'Sent at 4:23 AM, caffeine levels critical',
				},
			},
		},
		personaId: 'midnight-architect',
		persona: getPersona('midnight-architect'),
		traits: ['night-owl', 'caffeinated', 'deadline-driven'],
		promptingStyle: 'Increasingly desperate as the night goes on',
		communicationTone: 'Exhausted but determined',
	}
}

// Generate mock data for an "essay writer"
export function generateEssayWriterMockData(): UsageData {
	return {
		...mockData,
		insights: {
			...mockData.insights!,
			contrasts: {
				...mockData.insights!.contrasts,
				longestRamble:
					'I need a comprehensive analysis of this codebase including all the architectural decisions, the patterns used, potential improvements, performance optimizations, security considerations, testing strategies, documentation needs, deployment pipelines, monitoring solutions, and a detailed roadmap...',
			},
			communicationStyle: {
				...mockData.insights!.communicationStyle,
				promptingEvolution: 'Started verbose, became even more verbose. No signs of stopping.',
			},
		},
		personaId: 'the-explorer',
		persona: getPersona('the-explorer'),
		traits: ['verbose', 'thorough', 'context-heavy'],
		promptingStyle: 'Exhaustively detailed',
		communicationTone: 'Professional and comprehensive',
	}
}
