import { PersonaDefinition } from '../data/types'

export const personas: Record<string, PersonaDefinition> = {
	// Legendary (Top 5% in category)
	'token-titan': {
		id: 'token-titan',
		name: 'TOKEN TITAN',
		tagline: 'Feeding the machine since day one',
		description:
			"You've processed more tokens than most people have typed characters. The models know you by name.",
		color: '#ffd700',
		gradient: 'linear-gradient(135deg, #ffd700, #ff8c00, #ff4500)',
		category: 'legendary',
		icon: '⚡',
	},
	'prompt-whisperer': {
		id: 'prompt-whisperer',
		name: 'PROMPT WHISPERER',
		tagline: 'Maximum output, minimum input',
		description:
			'Your prompts are surgical. High efficiency, low waste. You speak and Claude understands.',
		color: '#00ff88',
		gradient: 'linear-gradient(135deg, #00ff88, #00cc6a, #009944)',
		category: 'legendary',
		icon: '🎯',
	},
	'tool-master': {
		id: 'tool-master',
		name: 'TOOL MASTER',
		tagline: 'Every tool, every situation',
		description:
			"Read, Write, Bash, Edit, Grep... you've mastered them all. A true multi-tool operator.",
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
			"Custom integrations, custom tools. You're not just using Claude, you're augmenting it.",
		color: '#a855f7',
		gradient: 'linear-gradient(135deg, #a855f7, #8b5cf6, #7c3aed)',
		category: 'legendary',
		icon: '🔮',
	},

	// Lifestyle (Usage patterns)
	'midnight-architect': {
		id: 'midnight-architect',
		name: 'MIDNIGHT ARCHITECT',
		tagline: 'When the world sleeps, you code',
		description: 'Your best work happens after midnight. The quiet hours are your domain.',
		color: '#6366f1',
		gradient: 'linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)',
		category: 'lifestyle',
		icon: '🌙',
	},
	'dawn-warrior': {
		id: 'dawn-warrior',
		name: 'DAWN WARRIOR',
		tagline: 'First commit before breakfast',
		description: "Early bird gets the clean codebase. You're shipping while others are snoozing.",
		color: '#f97316',
		gradient: 'linear-gradient(135deg, #fbbf24, #f97316, #ea580c)',
		category: 'lifestyle',
		icon: '🌅',
	},
	'project-nomad': {
		id: 'project-nomad',
		name: 'PROJECT NOMAD',
		tagline: 'No codebase is home for long',
		description: 'You wander from project to project, leaving improved code in your wake.',
		color: '#22c55e',
		gradient: 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)',
		category: 'lifestyle',
		icon: '🗺️',
	},
	'deep-focus-monk': {
		id: 'deep-focus-monk',
		name: 'DEEP FOCUS MONK',
		tagline: 'Flow state is your natural habitat',
		description: "Long sessions, deep work. When you start, you don't stop until it's done.",
		color: '#8b5cf6',
		gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9)',
		category: 'lifestyle',
		icon: '🧘',
	},
	'weekend-warrior': {
		id: 'weekend-warrior',
		name: 'WEEKEND WARRIOR',
		tagline: 'Side projects are your battlefield',
		description: 'Saturday morning? Time to code. Sunday evening? Still coding.',
		color: '#ec4899',
		gradient: 'linear-gradient(135deg, #ec4899, #db2777, #be185d)',
		category: 'lifestyle',
		icon: '⚔️',
	},

	// Personality (LLM-analyzed)
	'the-perfectionist': {
		id: 'the-perfectionist',
		name: 'THE PERFECTIONIST',
		tagline: 'Good enough never is',
		description: "Refactoring, polishing, improving. Your code isn't done until it's beautiful.",
		color: '#f472b6',
		gradient: 'linear-gradient(135deg, #f472b6, #ec4899, #db2777)',
		category: 'personality',
		icon: '✨',
	},
	'the-explorer': {
		id: 'the-explorer',
		name: 'THE EXPLORER',
		tagline: 'Understanding before acting',
		description: 'Read-heavy, question-filled sessions. You map the territory before you build.',
		color: '#38bdf8',
		gradient: 'linear-gradient(135deg, #38bdf8, #0ea5e9, #0284c7)',
		category: 'personality',
		icon: '🔍',
	},
	'the-speedrunner': {
		id: 'the-speedrunner',
		name: 'THE SPEEDRUNNER',
		tagline: 'Ship it yesterday',
		description: 'Short sessions, fast iterations. You move at the speed of thought.',
		color: '#f43f5e',
		gradient: 'linear-gradient(135deg, #f43f5e, #e11d48, #be123c)',
		category: 'personality',
		icon: '🏃',
	},
	'the-diplomat': {
		id: 'the-diplomat',
		name: 'THE DIPLOMAT',
		tagline: 'Please and thank you go a long way',
		description: 'Polite, collaborative, respectful. You treat Claude like the partner it is.',
		color: '#a3e635',
		gradient: 'linear-gradient(135deg, #a3e635, #84cc16, #65a30d)',
		category: 'personality',
		icon: '🤝',
	},
	'the-commander': {
		id: 'the-commander',
		name: 'THE COMMANDER',
		tagline: 'Direct orders, clear results',
		description: 'No fluff, no filler. You know what you want and you ask for it directly.',
		color: '#ef4444',
		gradient: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
		category: 'personality',
		icon: '🎖️',
	},

	// ===== NEW SAVAGE ROAST PERSONAS =====

	'vibe-coder': {
		id: 'vibe-coder',
		name: 'VIBE CODER',
		tagline: 'Error messages are just suggestions',
		description:
			'You don\'t read error messages, you just retry and hope. Stack traces? Never heard of \'em. Your debugging strategy is "idk just fix it".',
		color: '#ff6b6b',
		gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24, #ff3838)',
		category: 'roast',
		icon: '🎲',
		evidence: [
			'You said "just make it work" multiple times',
			'Sessions had minimal error checking',
			'Your favorite approach: trial and error',
		],
	},

	'copy-paste-warrior': {
		id: 'copy-paste-warrior',
		name: 'COPY PASTE WARRIOR',
		tagline: "Stack Overflow's #1 customer",
		description:
			"Why understand code when you can just copy it? Your clipboard has seen things. Typing is for people who don't know where the good code lives.",
		color: '#4ecdc4',
		gradient: 'linear-gradient(135deg, #4ecdc4, #44a08d, #009688)',
		category: 'roast',
		icon: '📋',
		evidence: [
			'Heavy use of "can you help me understand"',
			'Lots of code pasting in prompts',
			'Your documentation: "works somehow"',
		],
	},

	'3am-demon': {
		id: '3am-demon',
		name: '3AM DEMON',
		tagline: 'Your best code happens when normal people sleep',
		description:
			"Sleep is for the weak. Coffee is your co-pilot. The quietest hours of the night are when you truly come alive. Your circadian rhythm is a suggestion you've ignored.",
		color: '#9b59b6',
		gradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
		category: 'roast',
		icon: '👹',
		evidence: [
			'Peak activity between midnight and 4 AM',
			'Your most productive hours are technically tomorrow',
			'Sunlight is just a rumor to you',
		],
	},

	'polite-menace': {
		id: 'polite-menace',
		name: 'POLITE MENACE',
		tagline: 'Says please while destroying production',
		description:
			'You\'re suspiciously polite for someone writing code at this hour. Every "please" and "thank you" hides the chaos you\'re about to unleash. Manners maketh the menace.',
		color: '#2ecc71',
		gradient: 'linear-gradient(135deg, #2ecc71, #27ae60, #1abc9c)',
		category: 'roast',
		icon: '🎭',
		evidence: [
			'Said "please" an alarming number of times',
			'Always says thanks, even for breaking changes',
			'Politeness level: Canadian',
		],
	},

	'caps-lock-commander': {
		id: 'caps-lock-commander',
		name: 'CAPS LOCK COMMANDER',
		tagline: 'YOUR PROMPTS ARE VERY LOUD',
		description:
			"CALM DOWN. IT'S JUST CODE. Your caps lock key has seen some things. We can hear you through the screen. Maybe try decaf?",
		color: '#e74c3c',
		gradient: 'linear-gradient(135deg, #e74c3c, #c0392b, #a93226)',
		category: 'roast',
		icon: '📢',
		evidence: [
			'Multiple ALL CAPS prompts detected',
			'Exclamation count: concerning',
			'Your keyboard is filing for workers comp',
		],
	},

	'essay-writer': {
		id: 'essay-writer',
		name: 'ESSAY WRITER',
		tagline: 'Your prompts need a TL;DR',
		description:
			"Your average prompt could be a Medium article. You've written more context than code. Claude needs a coffee break after reading your messages.",
		color: '#3498db',
		gradient: 'linear-gradient(135deg, #3498db, #2980b9, #1a5276)',
		category: 'roast',
		icon: '📚',
		evidence: [
			'Average prompt length: novella',
			'Your context windows need context windows',
			'Brevity is not your love language',
		],
	},

	'one-word-wonder': {
		id: 'one-word-wonder',
		name: 'ONE WORD WONDER',
		tagline: 'fix. help. why.',
		description:
			"Your entire vocabulary fits on a Post-it note. Claude has to read minds because you certainly aren't providing context. Efficiency king or just lazy?",
		color: '#95a5a6',
		gradient: 'linear-gradient(135deg, #95a5a6, #7f8c8d, #636e72)',
		category: 'roast',
		icon: '💬',
		evidence: [
			'Average prompt length: a tweet',
			'Your most-used prompt: "fix it"',
			'Context is optional, apparently',
		],
	},

	'debug-addict': {
		id: 'debug-addict',
		name: 'DEBUG ADDICT',
		tagline: 'Your code: broken. Your spirit: also broken.',
		description:
			'You\'ve said "fix" more times than you\'ve said "I love you". Debugging is your cardio. At this point, the bugs are a feature.',
		color: '#e67e22',
		gradient: 'linear-gradient(135deg, #e67e22, #d35400, #c0392b)',
		category: 'roast',
		icon: '🐛',
		evidence: [
			'Debugging is your primary activity',
			'Your relationship with error messages: complicated',
			'Maybe try writing tests first?',
		],
	},

	'css-struggler': {
		id: 'css-struggler',
		name: 'CSS STRUGGLER',
		tagline: "Centering a div shouldn't take 47 prompts",
		description:
			'Flexbox? More like flex-nope. Your relationship with CSS is... complicated. Every centered div is a small victory. We believe in you.',
		color: '#9b59b6',
		gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad, #6c3483)',
		category: 'roast',
		icon: '🎨',
		evidence: [
			'Frontend work dominates your sessions',
			'CSS keywords appear frequently',
			'You and margin: 0 auto are not friends',
		],
	},

	'squirrel-brain': {
		id: 'squirrel-brain',
		name: 'SQUIRREL BRAIN',
		tagline: "Patience isn't your thing",
		description:
			"You asked Claude to do something, then interrupted. Multiple times. Your attention span is measured in milliseconds. Ooh, what's that shiny thing?",
		color: '#f39c12',
		gradient: 'linear-gradient(135deg, #f39c12, #f1c40f, #e67e22)',
		category: 'roast',
		icon: '🐿️',
		evidence: [
			'Interrupted Claude multiple times',
			'Many abandoned sessions',
			'The definition of "commit issues"',
		],
	},

	// Legacy roast personas (keeping for backwards compatibility)
	'bash-berserker': {
		id: 'bash-berserker',
		name: 'BASH BERSERKER',
		tagline: 'Why read when you can execute?',
		description:
			'Over 60% Bash usage. When in doubt, run a command. Documentation is for the weak.',
		color: '#fb923c',
		gradient: 'linear-gradient(135deg, #fb923c, #f97316, #ea580c)',
		category: 'roast',
		icon: '💥',
	},
	'opus-maximalist': {
		id: 'opus-maximalist',
		name: 'OPUS MAXIMALIST',
		tagline: 'Only the best model for "hello world"',
		description: 'Why use Haiku when Opus exists? Your token bill thanks you for your patronage.',
		color: '#c084fc',
		gradient: 'linear-gradient(135deg, #c084fc, #a855f7, #9333ea)',
		category: 'roast',
		icon: '👑',
	},
	'context-amnesiac': {
		id: 'context-amnesiac',
		name: 'CONTEXT AMNESIAC',
		tagline: 'Cache? What cache?',
		description:
			"Low cache hit rate detected. You're paying full price for the same context. Every. Single. Time.",
		color: '#94a3b8',
		gradient: 'linear-gradient(135deg, #94a3b8, #64748b, #475569)',
		category: 'roast',
		icon: '🤔',
	},
	'agent-interrupter': {
		id: 'agent-interrupter',
		name: 'AGENT INTERRUPTER',
		tagline: 'Patience is overrated anyway',
		description:
			'You asked Claude to do something, then interrupted. Multiple times. Claude forgives you.',
		color: '#fbbf24',
		gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
		category: 'roast',
		icon: '⏸️',
	},
	'yolo-deployer': {
		id: 'yolo-deployer',
		name: 'YOLO DEPLOYER',
		tagline: 'Tests are just suggestions',
		description:
			'Straight to production. No fear. Pure chaos energy. May your deploys be ever green.',
		color: '#22d3ee',
		gradient: 'linear-gradient(135deg, #22d3ee, #06b6d4, #0891b2)',
		category: 'roast',
		icon: '🚀',
	},

	// Default fallback
	'code-companion': {
		id: 'code-companion',
		name: 'CODE COMPANION',
		tagline: 'A balanced approach to AI-assisted development',
		description: "You've found your rhythm with Claude. Balanced, effective, getting things done.",
		color: '#00ff41',
		gradient: 'linear-gradient(135deg, #00ff41, #00d4ff, #a855f7)',
		category: 'personality',
		icon: '💻',
	},
}

export function getPersona(id: string): PersonaDefinition {
	return personas[id] || personas['code-companion']
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
		}
		dominantTopics?: string[]
		topWords?: Array<{ word: string; count: number }>
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

	// Dawn hours (5AM - 8AM)
	const dawnHours = [5, 6, 7, 8]
	const dawnSessions = dawnHours.reduce((sum, h) => sum + (stats.hourCounts[h] || 0), 0)
	const dawnPercentage = dawnSessions / Math.max(totalHourSessions, 1)

	// Opus usage
	const opusTokens = stats.modelUsage['claude-3-opus-20240229'] || stats.modelUsage['opus'] || 0
	const totalModelTokens = Object.values(stats.modelUsage).reduce((a, b) => a + b, 0)
	const opusPercentage = opusTokens / Math.max(totalModelTokens, 1)

	// ===== SAVAGE ROAST PERSONAS (check first for humor) =====

	// Get communication style and dominant topics from insights
	const politenessLevel = insights?.communicationStyle?.politenessLevel
	const dominantTopics = insights?.dominantTopics || []
	const topWords = insights?.topWords || []

	// 3AM Demon - heavy late night usage
	if (nightPercentage > 0.4 || (quirks?.lateNightSessions && quirks.lateNightSessions > 50)) {
		return '3am-demon'
	}

	// Polite menace - very polite/apologetic communication
	if (politenessLevel === 'diplomatic' || politenessLevel === 'apologetic') {
		return 'polite-menace'
	}

	// Debug addict - debugging is dominant topic
	if (dominantTopics.includes('debugging') && dominantTopics[0] === 'debugging') {
		return 'debug-addict'
	}

	// CSS Struggler - heavy frontend work
	if (dominantTopics.includes('frontend') && dominantTopics[0] === 'frontend') {
		return 'css-struggler'
	}

	// Squirrel brain - many interrupts or abandoned sessions
	if (quirks?.interruptCount && quirks.interruptCount > 15) {
		return 'squirrel-brain'
	}
	if (quirks?.abandonedSessions && quirks.abandonedSessions > 30) {
		return 'squirrel-brain'
	}

	// Vibe coder - heavy "fix" and "help" usage
	const fixWord = topWords.find((w) => w.word.toLowerCase() === 'fix')
	const helpWord = topWords.find((w) => w.word.toLowerCase() === 'help')
	if (fixWord && fixWord.count > 200 && helpWord && helpWord.count > 150) {
		return 'vibe-coder'
	}

	// Legacy roast personas
	if (bashPercentage > 0.6) return 'bash-berserker'
	if (opusPercentage > 0.7 && totalTokens < 100000) return 'opus-maximalist'
	if (cacheRate < 0.1 && totalTokens > 50000) return 'context-amnesiac'
	if (traits.includes('impatient')) return 'agent-interrupter'

	// Legendary personas (top performers)
	if (totalTokens > 1000000) return 'token-titan'
	if (toolCount >= 6 && totalTools > 1000) return 'tool-master'
	if (cacheRate > 0.5 && totalTokens > 100000) return 'prompt-whisperer'

	// Lifestyle personas
	if (nightPercentage > 0.5) return 'midnight-architect'
	if (dawnPercentage > 0.5) return 'dawn-warrior'
	if (stats.projectCount > 15) return 'project-nomad'
	if (stats.longestSessionMinutes > 180) return 'deep-focus-monk'

	// Personality personas (based on traits)
	if (traits.includes('perfectionist')) return 'the-perfectionist'
	if (traits.includes('curious') || traits.includes('explorer')) return 'the-explorer'
	if (traits.includes('fast') || traits.includes('impatient')) return 'the-speedrunner'
	if (traits.includes('polite') || traits.includes('diplomatic')) return 'the-diplomat'
	if (traits.includes('direct') || traits.includes('commanding')) return 'the-commander'

	// Default
	return 'code-companion'
}

// Generate roast copy based on word frequency
export function getWordRoast(topWord: string, count: number): string {
	const roasts: Record<string, string> = {
		fix: `You said "fix" ${count} times. Have you considered... not breaking things?`,
		help: `"Help" appeared ${count} times. Learned helplessness is real and you have it.`,
		please: `${count} pleases? Canadian? Or just nervous?`,
		why: `You asked "why" ${count} times. Existential coder. Deep.`,
		error: `${count} errors discussed. Your code makes Claude sad.`,
		bug: `${count} bugs. At this point, it's an insectarium.`,
		work: `"Work" appeared ${count} times. It clearly doesn't.`,
		test: `${count} test mentions. Do you actually run them though?`,
	}

	return roasts[topWord] || `You said "${topWord}" ${count} times. That's a lot.`
}

// Generate behavioral roasts
export function getQuirkRoast(quirk: string, value: number): string {
	const roasts: Record<string, (v: number) => string> = {
		interruptCount: (v) => `Interrupted Claude ${v} times. Patience of a caffeinated squirrel.`,
		abandonedSessions: (v) => `${v} abandoned sessions. Commitment issues extend to your code.`,
		lateNightSessions: (v) =>
			`${v} sessions after midnight. Sleep is for people without deadlines.`,
		weekendPercentage: (v) => `${v}% weekend coding. What's a work-life balance?`,
		shortestSessionSeconds: (v) => `Shortest session: ${v} seconds. Just a vibe check.`,
		longestStreakDays: (v) => `${v} day coding streak. Touching grass is free, you know.`,
	}

	return roasts[quirk]?.(value) || `${quirk}: ${value}`
}

// Generate topic roasts
export function getTopicRoast(topic: string, percentage: number): string {
	const roasts: Record<string, string> = {
		debugging: `${percentage}% debugging - your code: broken. Your spirit: also broken.`,
		frontend: `${percentage}% frontend - CSS is hard, we get it.`,
		backend: `${percentage}% backend - REST in peace to your sanity.`,
		devops: `${percentage}% devops - kubectl get pods | grep -v Running.`,
		ai: `${percentage}% AI/ML - prompt engineering your way through life.`,
		testing: `${percentage}% testing - the tests are lying and you know it.`,
		refactoring: `${percentage}% refactoring - still not done, is it?`,
	}

	return roasts[topic] || `${percentage}% ${topic}`
}
