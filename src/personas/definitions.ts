import { PersonaDefinition } from '../data/types'

export const personas: Record<string, PersonaDefinition> = {
	// ===== 9 CONSOLIDATED PERSONAS =====

	// 1. TOKEN BURNER - Heavy/power users
	'token-burner': {
		id: 'token-burner',
		name: 'TOKEN BURNER',
		tagline: "Anthropic's favorite customer",
		description:
			"You've burned through more tokens than most people have read words. Custom MCP tools, every model maxed out, elaborate workflows for simple tasks. Your API bill could fund a startup. At least someone at Anthropic is getting a holiday bonus.",
		color: '#ffd700',
		gradient: 'linear-gradient(135deg, #ffd700, #ff8c00, #ff4500)',
		icon: '🔥',
		evidence: [
			'Token usage: absolutely unhinged',
			"You're keeping the lights on at Anthropic",
			'Used every tool in the arsenal',
		],
	},

	// 2. VIBE CODER - Lazy prompting (merged: one-word-wonder, yolo-delegator, plan-skipper, magic-words-believer, copy-paste-warrior, yolo-deployer)
	'vibe-coder': {
		id: 'vibe-coder',
		name: 'VIBE CODER',
		tagline: '"just make it work lol"',
		description:
			'You don\'t write code, you manifest it. "fix" "help" "why" - that\'s your entire vocabulary. You accept every plan without reading, deploy without testing, and add "please" like it\'s a magic spell. You\'re not lazy, you\'re ✨delegating✨.',
		color: '#ff6b6b',
		gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24, #ff3838)',
		icon: '🎲',
		evidence: [
			'Average prompt: vibes only',
			'Plans read: approximately zero',
			'Testing: your users handle that',
		],
	},

	// 3. DEBUG DEMON - Debugging pain (merged: debug-addict, bug-whisperer, infinite-looper)
	'debug-demon': {
		id: 'debug-demon',
		name: 'DEBUG DEMON',
		tagline: 'Your code: broken. Your spirit: also broken.',
		description:
			'You\'ve said "fix" more times than "hello". Your code doesn\'t have bugs, it IS bugs. You fix one thing, break two more - it\'s whack-a-mole but the moles are winning. At this point, debugging is your entire personality.',
		color: '#e67e22',
		gradient: 'linear-gradient(135deg, #e67e22, #d35400, #c0392b)',
		icon: '🐛',
		evidence: [
			'Error messages: your love language',
			'The same file edited 50+ times',
			'Working code: a rare achievement',
		],
	},

	// 4. ESSAY WRITER - Verbose (merged: context-novelist, over-explainer)
	'essay-writer': {
		id: 'essay-writer',
		name: 'ESSAY WRITER',
		tagline: 'Your prompts need a TL;DR',
		description:
			"Your prompts are longer than the code you want written. You provide context for the context, backstory for the backstory. You could've written the code yourself in the time it took to explain it. Claude takes a coffee break reading your messages.",
		color: '#3498db',
		gradient: 'linear-gradient(135deg, #3498db, #2980b9, #1a5276)',
		icon: '📚',
		evidence: [
			'Average prompt length: dissertation',
			'Your prompts have chapters',
			'Words typed: thousands. Code received: dozens.',
		],
	},

	// 5. 3AM DEMON - Time-based chaos (merged: deadline-demon)
	'3am-demon': {
		id: '3am-demon',
		name: '3AM DEMON',
		tagline: 'Sleep is for the weak',
		description:
			'Your peak coding hours are when normal humans are unconscious. Due tomorrow, started today. Your circadian rhythm is a myth and procrastination is your art form. The bugs you write at 3AM will haunt you by 9AM.',
		color: '#2c3e50',
		gradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
		icon: '👹',
		evidence: [
			'Most active between midnight and 4 AM',
			'Panic is your productivity hack',
			'Sunlight is a rumor to you',
		],
	},

	// 6. SQUIRREL BRAIN - Behavioral chaos (merged: caps-lock-commander, undo-enthusiast, polite-menace)
	'squirrel-brain': {
		id: 'squirrel-brain',
		name: 'SQUIRREL BRAIN',
		tagline: 'Ooh shiny— wait what were we doing?',
		description:
			'You interrupt Claude mid-thought. You abandon sessions constantly. "Actually wait go back" is your catchphrase. You started 47 things, finished 2, and said "please" while doing it. Your attention span is measured in nanoseconds.',
		color: '#f39c12',
		gradient: 'linear-gradient(135deg, #f39c12, #f1c40f, #e67e22)',
		icon: '🐿️',
		evidence: [
			'Interrupted Claude: constantly',
			'Abandoned sessions: everywhere',
			'"Actually..." is your favorite word',
		],
	},

	// 7. BASH BERSERKER - Terminal warriors (merged: context-amnesiac)
	'bash-berserker': {
		id: 'bash-berserker',
		name: 'BASH BERSERKER',
		tagline: 'When in doubt, sudo',
		description:
			'Your solution to everything is a bash command. Read a file? Bash. Edit code? Bash. Emotional problems? Probably bash. You pay full price for the same context every time because cache is for cowards. You live in the terminal.',
		color: '#fb923c',
		gradient: 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)',
		icon: '💥',
		evidence: ['Bash usage: over 60%', 'GUI is for the weak', 'Cache hit rate: tragic'],
	},

	// 8. DOMAIN DISASTER - Domain struggles (merged: css-casualty, regex-refugee, git-disaster)
	'domain-disaster': {
		id: 'domain-disaster',
		name: 'DOMAIN DISASTER',
		tagline: 'Centering a div is your villain origin story',
		description:
			"CSS, regex, git - your holy trinity of pain. Flexbox? More like flex-nope. Regex? Now you have two problems. Git history? A crime scene. Your merge conflicts have merge conflicts and you've asked how to undo a force push. Multiple times.",
		color: '#e84393',
		gradient: 'linear-gradient(135deg, #e84393, #636e72, #f97316)',
		icon: '💀',
		evidence: [
			'"center" is in your top 10 words',
			'Regex understanding: insufficient',
			'Your commits are... committed',
		],
	},

	// 9. CODE ROULETTE - Fallback/chaotic (merged: refactor-addict)
	'code-roulette': {
		id: 'code-roulette',
		name: 'CODE ROULETTE',
		tagline: 'Spin the wheel, see what happens',
		description:
			"Your coding style is \"let's see what happens.\" It works? Better refactor it until it doesn't. You try things until something sticks. Science? No. Effective? Sometimes. The enemy of good is perfect, and you're chasing perfect.",
		color: '#00ff41',
		gradient: 'linear-gradient(135deg, #00ff41, #00d4ff, #a855f7)',
		icon: '🎰',
		evidence: [
			'Trial and error is your methodology',
			'Refactoring working code: your hobby',
			'Whatever works, works (until you touch it)',
		],
	},
}

export function getPersona(id: string): PersonaDefinition {
	return personas[id] || personas['code-roulette']
}

export function determinePersona(bundle: {
	stats: {
		totalTokens: { input: number; output: number; cached: number }
		toolUsage: Record<string, number>
		hourCounts: number[]
		longestSessionMinutes: number
		projectCount: number
		totalSessions: number
		modelUsage: Record<string, number>
	}
	traits: string[]
	insights?: {
		communicationStyle?: {
			politenessLevel?: string
			averagePromptLength?: number
		}
		dominantTopics?: string[]
		topWords?: Array<{ word: string; count: number }>
		topPhrases?: Array<{ phrase: string; count: number }>
		contrasts?: {
			capsLockPrompts?: number
		}
	}
	quirks?: {
		interruptCount: number
		abandonedSessions: number
		lateNightSessions: number
	}
}): string {
	const { stats, traits, insights, quirks } = bundle

	// Calculate derived metrics
	const totalTokens = stats.totalTokens.input + stats.totalTokens.output
	const cacheRate = stats.totalTokens.cached / Math.max(stats.totalTokens.input, 1)
	const toolCount = Object.keys(stats.toolUsage).length
	const totalTools = Object.values(stats.toolUsage).reduce((a, b) => a + b, 0)
	const bashPercentage = (stats.toolUsage['Bash'] || 0) / Math.max(totalTools, 1)

	// Night hours (10PM - 4AM)
	const nightHours = [22, 23, 0, 1, 2, 3, 4]
	const nightSessions = nightHours.reduce((sum, h) => sum + (stats.hourCounts[h] || 0), 0)
	const totalHourSessions = stats.hourCounts.reduce((a, b) => a + b, 0)
	const nightPercentage = nightSessions / Math.max(totalHourSessions, 1)

	// Get communication style and dominant topics from insights
	const averagePromptLength = insights?.communicationStyle?.averagePromptLength || 0
	const dominantTopics = insights?.dominantTopics || []
	const topWords = insights?.topWords || []
	const topPhrases = insights?.topPhrases || []
	const capsLockPrompts = insights?.contrasts?.capsLockPrompts || 0

	// Helper to check if a word appears frequently
	const getWordCount = (word: string) => {
		const found = topWords.find((w) => w.word.toLowerCase() === word.toLowerCase())
		return found?.count || 0
	}

	// Helper to check phrase frequency
	const getPhraseCount = (phrase: string) => {
		const found = topPhrases.find((p) => p.phrase.toLowerCase().includes(phrase.toLowerCase()))
		return found?.count || 0
	}

	// ===== PERSONA DETERMINATION (9 consolidated personas) =====

	// --- 1. TOKEN BURNER - Heavy/power users ---
	// Check first for high usage patterns
	const hasMcpTools = Object.keys(stats.toolUsage).some(
		(tool) => tool.startsWith('mcp__') && stats.toolUsage[tool] > 50
	)
	if (totalTokens > 2000000 || (toolCount >= 8 && totalTools > 2000) || hasMcpTools) {
		return 'token-burner'
	}

	// --- 2. VIBE CODER - Lazy prompting ---
	// Short prompts, lots of "fix"/"help", accepts plans without reading, no testing
	const fixCount = getWordCount('fix')
	const helpCount = getWordCount('help')
	const justCount = getWordCount('just')
	const correctlyCount = getWordCount('correctly')
	const properlyCount = getWordCount('properly')
	const makeSureCount = getPhraseCount('make sure')

	const isVibeCoder =
		(averagePromptLength > 0 && averagePromptLength < 25) ||
		fixCount > 30 ||
		(fixCount > 15 && helpCount > 15) ||
		(justCount > 20 && fixCount > 10) ||
		correctlyCount > 10 ||
		properlyCount > 10 ||
		makeSureCount > 10 ||
		traits.includes('accepting') ||
		traits.includes('trusting') ||
		traits.includes('non-reviewing') ||
		traits.includes('delegating') ||
		traits.includes('hands-off') ||
		traits.includes('passive') ||
		traits.includes('copy-paster') ||
		traits.includes('pasting') ||
		(dominantTopics.includes('deployment') && !dominantTopics.includes('testing'))

	if (isVibeCoder) {
		return 'vibe-coder'
	}

	// --- 3. DEBUG DEMON - Debugging pain ---
	const errorCount = getWordCount('error')
	const bugCount = getWordCount('bug')
	const brokenCount = getWordCount('broken')

	const isDebugDemon =
		(dominantTopics.includes('debugging') && dominantTopics[0] === 'debugging') ||
		errorCount > 30 ||
		bugCount > 20 ||
		brokenCount > 15 ||
		errorCount + bugCount + brokenCount > 40 ||
		(stats.totalSessions > 50 && traits.includes('repetitive'))

	if (isDebugDemon) {
		return 'debug-demon'
	}

	// --- 4. ESSAY WRITER - Verbose ---
	const isEssayWriter =
		averagePromptLength > 400 ||
		(averagePromptLength > 250 && (getWordCount('because') > 10 || getWordCount('context') > 5))

	if (isEssayWriter) {
		return 'essay-writer'
	}

	// --- 5. 3AM DEMON - Time-based chaos ---
	const is3amDemon =
		nightPercentage > 0.2 || (quirks?.lateNightSessions && quirks.lateNightSessions > 15)

	if (is3amDemon) {
		return '3am-demon'
	}

	// --- 6. SQUIRREL BRAIN - Behavioral chaos ---
	const undoCount = getWordCount('undo')
	const revertCount = getWordCount('revert')
	const actuallyCount = getWordCount('actually')

	const isSquirrelBrain =
		capsLockPrompts > 3 ||
		(quirks?.interruptCount && quirks.interruptCount > 5) ||
		(quirks?.abandonedSessions && quirks.abandonedSessions > 10) ||
		undoCount > 10 ||
		revertCount > 5 ||
		actuallyCount > 20

	if (isSquirrelBrain) {
		return 'squirrel-brain'
	}

	// --- 7. BASH BERSERKER - Terminal warriors ---
	const isBashBerserker = bashPercentage > 0.5 || (cacheRate < 0.15 && totalTokens > 30000)

	if (isBashBerserker) {
		return 'bash-berserker'
	}

	// --- 8. DOMAIN DISASTER - Domain struggles (CSS, regex, git) ---
	const cssCount = getWordCount('css')
	const centerCount = getWordCount('center')
	const flexboxCount = getWordCount('flexbox')
	const regexCount = getWordCount('regex')
	const patternCount = getWordCount('pattern')
	const gitCount = getWordCount('git')
	const rebaseCount = getWordCount('rebase')
	const mergeCount = getWordCount('merge')

	const isDomainDisaster =
		(dominantTopics.includes('frontend') && dominantTopics[0] === 'frontend') ||
		cssCount > 15 ||
		centerCount > 10 ||
		flexboxCount > 5 ||
		regexCount > 8 ||
		(regexCount > 3 && patternCount > 5) ||
		(gitCount > 20 && (undoCount > 3 || revertCount > 3)) ||
		rebaseCount > 5 ||
		mergeCount > 10

	if (isDomainDisaster) {
		return 'domain-disaster'
	}

	// --- 9. CODE ROULETTE - Fallback/chaotic ---
	// Also catches refactor addicts
	if (
		dominantTopics.includes('refactoring') ||
		getWordCount('refactor') > 10 ||
		getWordCount('clean') > 15
	) {
		return 'code-roulette'
	}

	// ===== FALLBACK =====
	// Deterministic fallback based on session count
	const fallbackPersonas = [
		'vibe-coder',
		'code-roulette',
		'debug-demon',
		'squirrel-brain',
		'essay-writer',
	]
	const fallbackIndex = stats.totalSessions % fallbackPersonas.length
	return fallbackPersonas[fallbackIndex]
}

// Generate roast copy based on word frequency
export function getWordRoast(topWord: string, count: number): string {
	const roasts: Record<string, string> = {
		fix: `You said "fix" ${count} times. Have you considered writing code that works?`,
		help: `"Help" appeared ${count} times. Learned helplessness is your superpower.`,
		please: `${count} "please"s. Manners won't fix your code, but we appreciate the effort.`,
		why: `You asked "why" ${count} times. The code is judging you back.`,
		error: `${count} errors discussed. Your code is a support group for bugs.`,
		bug: `${count} bugs mentioned. At this point, it's a feature farm.`,
		work: `"Work" appeared ${count} times. The code disagrees.`,
		test: `${count} test mentions. Running them is a different story though.`,
		just: `"Just" appeared ${count} times. Nothing is ever "just" anything.`,
		actually: `"Actually" ${count} times. Changing your mind is your cardio.`,
		correctly: `"Correctly" ${count} times. Adding this word doesn't make it happen.`,
		broken: `"Broken" ${count} times. Yeah, we noticed.`,
		undo: `"Undo" ${count} times. Ctrl+Z is your love language.`,
		again: `"Again" ${count} times. Groundhog Day vibes.`,
		weird: `"Weird" ${count} times. Your code is weird, not the behavior.`,
		somehow: `"Somehow" ${count} times. You don't know why it works either.`,
		idk: `"idk" ${count} times. That makes two of us.`,
		sorry: `"Sorry" ${count} times. Canadian energy detected.`,
		thanks: `"Thanks" ${count} times. Claude appreciates it but can't spend it.`,
		quick: `"Quick" ${count} times. Nothing you asked for was quick.`,
	}

	return (
		roasts[topWord.toLowerCase()] || `You said "${topWord}" ${count} times. Interesting choice.`
	)
}

// Generate behavioral roasts
export function getQuirkRoast(quirk: string, value: number): string {
	const roasts: Record<string, (v: number) => string> = {
		interruptCount: (v) =>
			`Interrupted Claude ${v} times. Patience of a caffeinated squirrel on espresso.`,
		abandonedSessions: (v) => `${v} abandoned sessions. Your code has abandonment issues now.`,
		lateNightSessions: (v) => `${v} sessions after midnight. Your 3AM code will haunt you at 9AM.`,
		weekendPercentage: (v) => `${v}% weekend coding. Work-life balance left the chat.`,
		shortestSessionSeconds: (v) =>
			`Shortest session: ${v} seconds. Just checking if Claude was home.`,
		longestStreakDays: (v) => `${v} day coding streak. The sun misses you.`,
		earlyMorningSessions: (v) => `${v} sessions before 8AM. Disgusting. Respect.`,
	}

	return roasts[quirk]?.(value) || `${quirk}: ${value}. Make of that what you will.`
}

// Generate topic roasts
export function getTopicRoast(topic: string, percentage: number): string {
	const roasts: Record<string, string> = {
		debugging: `${percentage}% debugging - your code is a bug sanctuary.`,
		frontend: `${percentage}% frontend - CSS: Can't Style Stuff.`,
		backend: `${percentage}% backend - REST in peace to your endpoints.`,
		devops: `${percentage}% devops - YAML indentation is your nemesis.`,
		ai: `${percentage}% AI/ML - using AI to write AI prompts. Very meta.`,
		testing: `${percentage}% testing - writing tests for code that's already broken.`,
		refactoring: `${percentage}% refactoring - if it works, make it not work prettier.`,
		deployment: `${percentage}% deployment - shipping bugs to production at scale.`,
		database: `${percentage}% database - SELECT * FROM problems WHERE solution IS NULL.`,
		security: `${percentage}% security - closing the barn door after the horses left.`,
		performance: `${percentage}% performance - making slow code faster, then slower again.`,
	}

	return roasts[topic] || `${percentage}% ${topic} - a choice was made.`
}

// Get all persona IDs (all are roasts now)
export function getAllPersonaIds(): string[] {
	return Object.keys(personas)
}
