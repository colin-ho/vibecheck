import { PersonaDefinition } from '../data/types'

export const personas: Record<string, PersonaDefinition> = {
	// ===== NON-ROASTS (~20%) - Only for truly exceptional users =====

	'token-titan': {
		id: 'token-titan',
		name: 'TOKEN TITAN',
		tagline: 'Feeding the machine since day one',
		description:
			"You've processed more tokens than most people have typed characters. The models know you by name. Genuinely impressive dedication.",
		color: '#ffd700',
		gradient: 'linear-gradient(135deg, #ffd700, #ff8c00, #ff4500)',
		category: 'legendary',
		icon: '⚡',
	},
	'tool-master': {
		id: 'tool-master',
		name: 'TOOL MASTER',
		tagline: 'Every tool, every situation',
		description:
			"Read, Write, Bash, Edit, Grep... you've mastered them all. You actually understand what each tool does. A rare specimen.",
		color: '#00d4ff',
		gradient: 'linear-gradient(135deg, #00d4ff, #0099cc, #006699)',
		category: 'legendary',
		icon: '🛠️',
	},
	'mcp-pioneer': {
		id: 'mcp-pioneer',
		name: 'MCP PIONEER',
		tagline: 'Extending the boundaries',
		description:
			"Custom integrations, custom tools. You're not just using Claude, you're augmenting it. Actually impressive.",
		color: '#a855f7',
		gradient: 'linear-gradient(135deg, #a855f7, #8b5cf6, #7c3aed)',
		category: 'legendary',
		icon: '🔮',
	},
	'prompt-surgeon': {
		id: 'prompt-surgeon',
		name: 'PROMPT SURGEON',
		tagline: 'Maximum output, minimum input',
		description:
			'Your prompts are surgical. High efficiency, low waste. You actually think before you type. We stan.',
		color: '#00ff88',
		gradient: 'linear-gradient(135deg, #00ff88, #00cc6a, #009944)',
		category: 'legendary',
		icon: '🎯',
	},

	// ===== ROASTS (~80%) - The majority =====

	// --- Vibe Coders / Lazy Prompters ---

	'vibe-coder': {
		id: 'vibe-coder',
		name: 'VIBE CODER',
		tagline: '"just make it work lol"',
		description:
			"You don't write code, you manifest it. Your prompts are vibes, not instructions. \"idk fix it\" is your love language. You're not lazy, you're ✨delegating✨.",
		color: '#ff6b6b',
		gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24, #ff3838)',
		category: 'roast',
		icon: '🎲',
		evidence: [
			'Your most common prompt: variations of "fix"',
			'Context provided: none. Vibes provided: immaculate.',
			'You expect AI to read your mind. Bold.',
		],
	},

	'one-word-wonder': {
		id: 'one-word-wonder',
		name: 'ONE WORD WONDER',
		tagline: 'fix. help. why. done.',
		description:
			'Your prompts are haikus without the poetry. "fix" "help" "why" - that\'s the entire conversation. Claude isn\'t a mind reader, but you\'re testing that theory daily.',
		color: '#95a5a6',
		gradient: 'linear-gradient(135deg, #95a5a6, #7f8c8d, #636e72)',
		category: 'roast',
		icon: '💬',
		evidence: [
			'Average prompt length: a tweet',
			'Your vocabulary: fix, help, why, ok, do it',
			'Context is a foreign concept',
		],
	},

	'yolo-delegator': {
		id: 'yolo-delegator',
		name: 'YOLO DELEGATOR',
		tagline: 'Let the AI figure it out',
		description:
			"Why think when Claude can think for you? Your job is to press enter and accept whatever comes back. You're not coding, you're supervising. Barely.",
		color: '#e056fd',
		gradient: 'linear-gradient(135deg, #e056fd, #be2edd, #8e44ad)',
		category: 'roast',
		icon: '🎰',
		evidence: [
			'You accept every suggestion without reading',
			'Your review process: "looks good to me"',
			'Due diligence? Never heard of her.',
		],
	},

	'plan-skipper': {
		id: 'plan-skipper',
		name: 'PLAN SKIPPER',
		tagline: 'Reading is for nerds',
		description:
			'Claude writes a thoughtful plan. You say "yes" without reading a single word. Every. Single. Time. You trust Claude more than you trust yourself. Concerning.',
		color: '#00cec9',
		gradient: 'linear-gradient(135deg, #00cec9, #0984e3, #6c5ce7)',
		category: 'roast',
		icon: '⏭️',
		evidence: [
			'Plans accepted: all of them',
			'Plans actually read: approximately zero',
			'Your code review strategy: "ship it"',
		],
	},

	'magic-words-believer': {
		id: 'magic-words-believer',
		name: 'MAGIC WORDS BELIEVER',
		tagline: '"please work this time"',
		description:
			'You think adding "please" and "correctly" to your prompts changes the output. "Please fix this correctly and make sure it works" - ah yes, the secret incantation.',
		color: '#fd79a8',
		gradient: 'linear-gradient(135deg, #fd79a8, #e84393, #d63031)',
		category: 'roast',
		icon: '🪄',
		evidence: [
			'"correctly" appears in most of your prompts',
			'"please make sure" is your catchphrase',
			'You believe in prompt magic',
		],
	},

	// --- Debug Obsessed ---

	'debug-addict': {
		id: 'debug-addict',
		name: 'DEBUG ADDICT',
		tagline: 'Your code: broken. Your spirit: also broken.',
		description:
			'You\'ve said "fix" more times than "hello". Debugging is your entire personality. Maybe... write tests? Or read the error message? Just a thought.',
		color: '#e67e22',
		gradient: 'linear-gradient(135deg, #e67e22, #d35400, #c0392b)',
		category: 'roast',
		icon: '🐛',
		evidence: [
			'Debugging sessions: too many to count',
			'Your relationship with bugs: codependent',
			'You should try writing code that works the first time',
		],
	},

	'bug-whisperer': {
		id: 'bug-whisperer',
		name: 'BUG WHISPERER',
		tagline: 'You attract bugs like honey attracts flies',
		description:
			"Your code doesn't have bugs, it IS bugs. Every session starts with \"it's broken again\". At this point, the bugs have squatter's rights.",
		color: '#d63031',
		gradient: 'linear-gradient(135deg, #d63031, #c0392b, #a93226)',
		category: 'roast',
		icon: '🪲',
		evidence: [
			'Error messages: your most common conversation topic',
			'Stack traces: your bedtime reading',
			'Working code: a rare achievement',
		],
	},

	'infinite-looper': {
		id: 'infinite-looper',
		name: 'INFINITE LOOPER',
		tagline: 'Fix it → Break it → Repeat',
		description:
			'You fix one bug, create two more. It\'s like whack-a-mole but the moles are winning. Every "fix" spawns a new issue. You\'re job security for Claude.',
		color: '#6c5ce7',
		gradient: 'linear-gradient(135deg, #6c5ce7, #5f27cd, #341f97)',
		category: 'roast',
		icon: '🔄',
		evidence: [
			'Sessions that never seem to end',
			'The same file edited 50+ times',
			'Progress: questionable',
		],
	},

	// --- Essay Writers / Verbose ---

	'essay-writer': {
		id: 'essay-writer',
		name: 'ESSAY WRITER',
		tagline: 'Your prompts need a TL;DR',
		description:
			'Your prompts are longer than the code you want written. You provide the entire history of the project, your life story, and your hopes and dreams. Just ask the question.',
		color: '#3498db',
		gradient: 'linear-gradient(135deg, #3498db, #2980b9, #1a5276)',
		category: 'roast',
		icon: '📚',
		evidence: [
			'Average prompt length: dissertation',
			'You explain context that was already obvious',
			'Your prompts have prompts',
		],
	},

	'context-novelist': {
		id: 'context-novelist',
		name: 'CONTEXT NOVELIST',
		tagline: 'Once upon a time, I needed a function...',
		description:
			'You could literally just write the code yourself in the time it takes you to explain what you want. Your "quick question" comes with 3 paragraphs of backstory.',
		color: '#9b59b6',
		gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad, #6c3483)',
		category: 'roast',
		icon: '📖',
		evidence: [
			'Your prompts have chapters',
			'You provide context for the context',
			'Claude takes a coffee break reading your messages',
		],
	},

	'over-explainer': {
		id: 'over-explainer',
		name: 'OVER EXPLAINER',
		tagline: 'You could have written it yourself by now',
		description:
			'You spend more time explaining what you want than it would take to just... do it. Your prompt-to-code ratio is concerning. Have you considered typing less?',
		color: '#1abc9c',
		gradient: 'linear-gradient(135deg, #1abc9c, #16a085, #0d7377)',
		category: 'roast',
		icon: '🗣️',
		evidence: [
			'Words typed explaining: thousands',
			'Lines of code received: dozens',
			'Efficiency: not your strong suit',
		],
	},

	// --- Behavioral Quirks ---

	'3am-demon': {
		id: '3am-demon',
		name: '3AM DEMON',
		tagline: 'Sleep is for the weak',
		description:
			'Your peak coding hours are when normal humans are unconscious. Your circadian rhythm is a myth. The bugs you write at 3AM will haunt you by 9AM.',
		color: '#2c3e50',
		gradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
		category: 'roast',
		icon: '👹',
		evidence: [
			'Most active between midnight and 4 AM',
			'Sunlight is a rumor to you',
			'Your code quality decreases after midnight. Drastically.',
		],
	},

	'squirrel-brain': {
		id: 'squirrel-brain',
		name: 'SQUIRREL BRAIN',
		tagline: 'Ooh shiny— wait what were we doing?',
		description:
			'You interrupt Claude mid-thought. You abandon sessions constantly. Your attention span is measured in nanoseconds. You started 47 things and finished 2.',
		color: '#f39c12',
		gradient: 'linear-gradient(135deg, #f39c12, #f1c40f, #e67e22)',
		category: 'roast',
		icon: '🐿️',
		evidence: [
			'Interrupted Claude multiple times per session',
			'Abandoned sessions everywhere',
			'Commitment issues extend to your code',
		],
	},

	'caps-lock-commander': {
		id: 'caps-lock-commander',
		name: 'CAPS LOCK COMMANDER',
		tagline: 'YOUR PROMPTS ARE VERY LOUD',
		description:
			"CALM DOWN. THE CODE ISN'T GOING ANYWHERE. Your caps lock key is crying. Your prompts read like a frustrated parent. Maybe try decaf?",
		color: '#e74c3c',
		gradient: 'linear-gradient(135deg, #e74c3c, #c0392b, #a93226)',
		category: 'roast',
		icon: '📢',
		evidence: [
			'Multiple ALL CAPS prompts detected',
			'Exclamation marks: excessive',
			'Frustration level: palpable',
		],
	},

	'polite-menace': {
		id: 'polite-menace',
		name: 'POLITE MENACE',
		tagline: 'Says please while destroying production',
		description:
			'You\'re suspiciously polite for someone whose code is on fire. "Could you please fix this critical bug? Thank you so much! 🙏" Manners won\'t save your deploy.',
		color: '#2ecc71',
		gradient: 'linear-gradient(135deg, #2ecc71, #27ae60, #1abc9c)',
		category: 'roast',
		icon: '🎭',
		evidence: [
			'Said "please" an alarming number of times',
			'Unfailing politeness during chaos',
			'Canadian energy',
		],
	},

	'undo-enthusiast': {
		id: 'undo-enthusiast',
		name: 'UNDO ENTHUSIAST',
		tagline: 'Actually wait go back',
		description:
			'"Do this. Wait no, undo that. Actually, do it again but different. Never mind, go back." Your sessions are a choose-your-own-adventure where you choose wrong.',
		color: '#00b894',
		gradient: 'linear-gradient(135deg, #00b894, #00cec9, #0984e3)',
		category: 'roast',
		icon: '↩️',
		evidence: [
			'Undo requests: constant',
			'"Actually..." is your favorite word',
			'Decision making is not your forte',
		],
	},

	'copy-paste-warrior': {
		id: 'copy-paste-warrior',
		name: 'COPY PASTE WARRIOR',
		tagline: 'Ctrl+C Ctrl+V is a lifestyle',
		description:
			"Why understand code when you can just copy it? You paste code, get errors, paste the errors, get fixes, paste those. It's copy-paste all the way down.",
		color: '#4ecdc4',
		gradient: 'linear-gradient(135deg, #4ecdc4, #44a08d, #009688)',
		category: 'roast',
		icon: '📋',
		evidence: [
			'Heavy code pasting in prompts',
			'Understanding: optional',
			'Your clipboard: exhausted',
		],
	},

	// --- Tool & Model Usage ---

	'bash-berserker': {
		id: 'bash-berserker',
		name: 'BASH BERSERKER',
		tagline: 'When in doubt, sudo',
		description:
			'Your solution to everything is a bash command. Read a file? Bash. Edit code? Bash. Emotional problems? Probably bash. You live in the terminal.',
		color: '#fb923c',
		gradient: 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)',
		category: 'roast',
		icon: '💥',
		evidence: ['Bash usage: over 60%', 'You think in terminal commands', 'GUI is for the weak'],
	},

	'opus-maximalist': {
		id: 'opus-maximalist',
		name: 'OPUS MAXIMALIST',
		tagline: 'Only the best for "hello world"',
		description:
			'Why use Haiku when Opus exists? You use the most expensive model for everything. Your token bill could fund a startup. Simple tasks deserve premium treatment.',
		color: '#c084fc',
		gradient: 'linear-gradient(135deg, #c084fc, #a855f7, #9333ea)',
		category: 'roast',
		icon: '👑',
		evidence: [
			'Opus for everything, even typo fixes',
			'Your token bill: concerning',
			'Budget: what budget?',
		],
	},

	'context-amnesiac': {
		id: 'context-amnesiac',
		name: 'CONTEXT AMNESIAC',
		tagline: 'Cache? What cache?',
		description:
			"You pay full price for the same context every single time. Your cache hit rate is tragic. You're basically funding Anthropic's holiday party.",
		color: '#94a3b8',
		gradient: 'linear-gradient(135deg, #94a3b8, #64748b, #475569)',
		category: 'roast',
		icon: '🤔',
		evidence: [
			'Cache hit rate: embarrassingly low',
			'Same context, paid for repeatedly',
			'Efficiency: not your thing',
		],
	},

	// --- Domain Struggles ---

	'css-casualty': {
		id: 'css-casualty',
		name: 'CSS CASUALTY',
		tagline: 'Centering a div is your villain origin story',
		description:
			"Flexbox? More like flex-nope. You've asked how to center things more times than you'd like to admit. The cascade has claimed another victim.",
		color: '#e84393',
		gradient: 'linear-gradient(135deg, #e84393, #d63031, #c0392b)',
		category: 'roast',
		icon: '🎨',
		evidence: [
			'CSS keywords appear constantly',
			'"center" is in your top 10 words',
			'You and flexbox are not friends',
		],
	},

	'regex-refugee': {
		id: 'regex-refugee',
		name: 'REGEX REFUGEE',
		tagline: 'Now you have two problems',
		description:
			'You came with one problem and asked for regex help. Now you have two problems. Every regex prompt ends with "why doesn\'t this work?" You know why.',
		color: '#636e72',
		gradient: 'linear-gradient(135deg, #636e72, #2d3436, #1e272e)',
		category: 'roast',
		icon: '🔣',
		evidence: [
			'Regex requests: too many',
			'Regex understanding: insufficient',
			'You Google the same patterns repeatedly',
		],
	},

	'git-disaster': {
		id: 'git-disaster',
		name: 'GIT DISASTER',
		tagline: 'git push --force origin main',
		description:
			'Your git history is a crime scene. You\'ve asked how to undo a force push. Multiple times. "git rebase" gives you nightmares. At least your commits are... committed.',
		color: '#f97316',
		gradient: 'linear-gradient(135deg, #f97316, #ea580c, #c2410c)',
		category: 'roast',
		icon: '📜',
		evidence: [
			'Git questions: suspiciously frequent',
			'"undo" + "git" in many prompts',
			'Your merge conflicts have merge conflicts',
		],
	},

	// --- Specific Behaviors ---

	'deadline-demon': {
		id: 'deadline-demon',
		name: 'DEADLINE DEMON',
		tagline: 'Due tomorrow. Started today.',
		description:
			'Your usage spikes right before deadlines. Procrastination is your art form. You work best under pressure because you only work under pressure.',
		color: '#ff4757',
		gradient: 'linear-gradient(135deg, #ff4757, #ff6b81, #ee5a24)',
		category: 'roast',
		icon: '⏰',
		evidence: [
			'Usage spikes before deadlines',
			'Frantic session patterns',
			'Panic is your productivity hack',
		],
	},

	'refactor-addict': {
		id: 'refactor-addict',
		name: 'REFACTOR ADDICT',
		tagline: 'It works, but it could be prettier',
		description:
			'Your code works perfectly but you want to "clean it up." Three refactors later, it\'s broken and you don\'t know why. The enemy of good is perfect.',
		color: '#a29bfe',
		gradient: 'linear-gradient(135deg, #a29bfe, #6c5ce7, #5f27cd)',
		category: 'roast',
		icon: '✨',
		evidence: [
			'Refactoring working code: your hobby',
			'"make it cleaner" requests: excessive',
			"If it ain't broke, you'll fix it anyway",
		],
	},

	'yolo-deployer': {
		id: 'yolo-deployer',
		name: 'YOLO DEPLOYER',
		tagline: 'Tests are for people with time',
		description:
			"Straight to production. No tests. No staging. Pure chaos energy. You don't believe in safety nets. Your deploys are acts of faith.",
		color: '#22d3ee',
		gradient: 'linear-gradient(135deg, #22d3ee, #06b6d4, #0891b2)',
		category: 'roast',
		icon: '🚀',
		evidence: [
			'Testing mentioned: rarely',
			'Deployment confidence: misplaced',
			'Your users are your QA team',
		],
	},

	// --- Fallback Roast ---
	'code-roulette': {
		id: 'code-roulette',
		name: 'CODE ROULETTE',
		tagline: 'Spin the wheel, see what happens',
		description:
			'Your coding style is best described as "let\'s see what happens." You try things until something works. Science? No. Effective? Sometimes. Chaotic? Always.',
		color: '#00ff41',
		gradient: 'linear-gradient(135deg, #00ff41, #00d4ff, #a855f7)',
		category: 'roast',
		icon: '🎰',
		evidence: [
			'Trial and error is your methodology',
			'You code by intuition (guessing)',
			'Whatever works, works',
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

	// Opus usage
	const opusTokens = stats.modelUsage['claude-3-opus-20240229'] || stats.modelUsage['opus'] || 0
	const totalModelTokens = Object.values(stats.modelUsage).reduce((a, b) => a + b, 0)
	const opusPercentage = opusTokens / Math.max(totalModelTokens, 1)

	// Get communication style and dominant topics from insights
	const politenessLevel = insights?.communicationStyle?.politenessLevel
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

	// ===== ROASTS FIRST (80% of users should get roasted) =====

	// --- Vibe Coders / Lazy Prompters (check first - most common) ---

	// One Word Wonder - very short average prompts
	if (averagePromptLength > 0 && averagePromptLength < 25) {
		return 'one-word-wonder'
	}

	// Vibe coder - lots of "fix", "help", vague prompts
	const fixCount = getWordCount('fix')
	const helpCount = getWordCount('help')
	const justCount = getWordCount('just')
	if (fixCount > 30 || (fixCount > 15 && helpCount > 15) || (justCount > 20 && fixCount > 10)) {
		return 'vibe-coder'
	}

	// Magic words believer - lots of "correctly", "please make sure", "properly"
	const correctlyCount = getWordCount('correctly')
	const properlyCount = getWordCount('properly')
	const makeSureCount = getPhraseCount('make sure')
	if (correctlyCount > 10 || properlyCount > 10 || makeSureCount > 10) {
		return 'magic-words-believer'
	}

	// Plan skipper - check traits for "accepts everything" pattern
	if (
		traits.includes('accepting') ||
		traits.includes('trusting') ||
		traits.includes('non-reviewing')
	) {
		return 'plan-skipper'
	}

	// YOLO delegator - vague requests, low engagement
	if (traits.includes('delegating') || traits.includes('hands-off') || traits.includes('passive')) {
		return 'yolo-delegator'
	}

	// --- Essay Writers / Verbose ---

	// Context novelist - extremely long prompts (> 800 chars)
	if (averagePromptLength > 800) {
		return 'context-novelist'
	}

	// Essay writer - very long prompts (> 400 chars)
	if (averagePromptLength > 400) {
		return 'essay-writer'
	}

	// Over explainer - long prompts with lots of context words
	if (averagePromptLength > 250 && (getWordCount('because') > 10 || getWordCount('context') > 5)) {
		return 'over-explainer'
	}

	// --- Debug Obsessed ---

	// Debug addict - debugging is dominant
	if (dominantTopics.includes('debugging') && dominantTopics[0] === 'debugging') {
		return 'debug-addict'
	}

	// Bug whisperer - lots of error-related words
	const errorCount = getWordCount('error')
	const bugCount = getWordCount('bug')
	const brokenCount = getWordCount('broken')
	if (
		errorCount > 30 ||
		bugCount > 20 ||
		brokenCount > 15 ||
		errorCount + bugCount + brokenCount > 40
	) {
		return 'bug-whisperer'
	}

	// Infinite looper - high session count with repeated topics
	if (stats.totalSessions > 50 && traits.includes('repetitive')) {
		return 'infinite-looper'
	}

	// --- Behavioral Quirks ---

	// Caps Lock Commander - many ALL CAPS prompts
	if (capsLockPrompts > 3) {
		return 'caps-lock-commander'
	}

	// 3AM Demon - heavy late night usage
	if (nightPercentage > 0.2 || (quirks?.lateNightSessions && quirks.lateNightSessions > 15)) {
		return '3am-demon'
	}

	// Squirrel brain - many interrupts or abandoned sessions
	if (
		(quirks?.interruptCount && quirks.interruptCount > 5) ||
		(quirks?.abandonedSessions && quirks.abandonedSessions > 10)
	) {
		return 'squirrel-brain'
	}

	// Polite menace - very polite/apologetic communication
	if (politenessLevel === 'diplomatic' || politenessLevel === 'apologetic') {
		return 'polite-menace'
	}

	// Undo enthusiast - lots of "undo", "revert", "go back"
	const undoCount = getWordCount('undo')
	const revertCount = getWordCount('revert')
	const actuallyCount = getWordCount('actually')
	if (undoCount > 10 || revertCount > 5 || actuallyCount > 20) {
		return 'undo-enthusiast'
	}

	// Copy paste warrior - traits indicate heavy pasting
	if (traits.includes('copy-paster') || traits.includes('pasting')) {
		return 'copy-paste-warrior'
	}

	// --- Tool & Model Usage ---

	// Bash berserker - over 50% bash usage
	if (bashPercentage > 0.5) {
		return 'bash-berserker'
	}

	// Opus maximalist - heavy opus usage for low token counts
	if (opusPercentage > 0.6 && totalTokens < 200000) {
		return 'opus-maximalist'
	}

	// Context amnesiac - very low cache rate
	if (cacheRate < 0.15 && totalTokens > 30000) {
		return 'context-amnesiac'
	}

	// --- Domain Struggles ---

	// CSS casualty - heavy frontend/CSS work
	if (dominantTopics.includes('frontend') && dominantTopics[0] === 'frontend') {
		return 'css-casualty'
	}

	const cssCount = getWordCount('css')
	const centerCount = getWordCount('center')
	const flexboxCount = getWordCount('flexbox')
	if (cssCount > 15 || centerCount > 10 || flexboxCount > 5) {
		return 'css-casualty'
	}

	// Regex refugee - lots of regex questions
	const regexCount = getWordCount('regex')
	const patternCount = getWordCount('pattern')
	if (regexCount > 8 || (regexCount > 3 && patternCount > 5)) {
		return 'regex-refugee'
	}

	// Git disaster - heavy git usage with problems
	const gitCount = getWordCount('git')
	const rebaseCount = getWordCount('rebase')
	const mergeCount = getWordCount('merge')
	if ((gitCount > 20 && (undoCount > 3 || revertCount > 3)) || rebaseCount > 5 || mergeCount > 10) {
		return 'git-disaster'
	}

	// --- Specific Behaviors ---

	// Refactor addict - lots of refactoring
	if (
		dominantTopics.includes('refactoring') ||
		getWordCount('refactor') > 10 ||
		getWordCount('clean') > 15
	) {
		return 'refactor-addict'
	}

	// YOLO deployer - no testing mentioned, deployment heavy
	if (dominantTopics.includes('deployment') && !dominantTopics.includes('testing')) {
		return 'yolo-deployer'
	}

	// ===== NON-ROASTS (only for truly exceptional ~20%) =====

	// These require genuinely impressive stats

	// Token titan - over 2M tokens (very high bar)
	if (totalTokens > 2000000) {
		return 'token-titan'
	}

	// Tool master - uses 8+ tools extensively
	if (toolCount >= 8 && totalTools > 2000) {
		return 'tool-master'
	}

	// MCP pioneer - uses custom MCP tools
	const hasMcpTools = Object.keys(stats.toolUsage).some(
		(tool) => tool.startsWith('mcp__') && stats.toolUsage[tool] > 50
	)
	if (hasMcpTools) {
		return 'mcp-pioneer'
	}

	// Prompt surgeon - high cache rate AND good efficiency
	if (
		cacheRate > 0.6 &&
		totalTokens > 200000 &&
		averagePromptLength > 50 &&
		averagePromptLength < 200
	) {
		return 'prompt-surgeon'
	}

	// ===== FALLBACK ROASTS =====

	// Random roast for everyone else
	const fallbackRoasts = [
		'vibe-coder',
		'code-roulette',
		'yolo-delegator',
		'copy-paste-warrior',
		'debug-addict',
		'squirrel-brain',
		'yolo-deployer',
		'plan-skipper',
	]

	// Use session count to pick a deterministic-ish roast
	const roastIndex = stats.totalSessions % fallbackRoasts.length
	return fallbackRoasts[roastIndex]
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

// Get all roast persona IDs (for random selection)
export function getRoastPersonaIds(): string[] {
	return Object.entries(personas)
		.filter(([, p]) => p.category === 'roast')
		.map(([id]) => id)
}

// Get all legendary persona IDs
export function getLegendaryPersonaIds(): string[] {
	return Object.entries(personas)
		.filter(([, p]) => p.category === 'legendary')
		.map(([id]) => id)
}
