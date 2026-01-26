import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { SlideLayout } from '../../components/SlideLayout'
import { PromptWithContext } from '../../data/bundle.generated'

// Category labels for memorable prompts (all 4 are required)
const promptLabels: Record<string, string> = {
	mostAmbitious: 'Most Ambitious',
	funniest: 'Funniest',
	weirdest: 'Weirdest',
	mostFrustrated: 'Peak Frustration',
}

interface PromptCandidate {
	key: string
	label: string
	prompt: string
	context?: string
}

export function OpeningMemoryStory({ data, isActive }: StorySlideProps) {
	const { insights } = data

	// Build list of available memorable prompts in priority order
	const availablePrompts = useMemo(() => {
		const candidates: PromptCandidate[] = []
		const memorablePrompts = insights?.memorablePrompts

		// All 4 memorable prompts are required
		const priorityOrder: (keyof typeof promptLabels)[] = [
			'mostAmbitious',
			'funniest',
			'weirdest',
			'mostFrustrated',
		]

		for (const key of priorityOrder) {
			const promptData = memorablePrompts?.[key as keyof typeof memorablePrompts] as
				| PromptWithContext
				| undefined
			if (promptData?.prompt) {
				candidates.push({
					key,
					label: promptLabels[key],
					prompt: promptData.prompt,
					context: promptData.context,
				})
			}
		}

		// Fallback if no memorable prompts
		if (candidates.length === 0) {
			// Try contrasts.longestRamble as last resort
			if (insights?.contrasts?.longestRamble) {
				candidates.push({
					key: 'longestRamble',
					label: 'A Memorable Moment',
					prompt: insights.contrasts.longestRamble,
					context: 'Your journey began',
				})
			} else {
				candidates.push({
					key: 'fallback',
					label: 'A Memorable Moment',
					prompt: 'help me with something',
					context: 'Your journey began',
				})
			}
		}

		// Limit to first 5 prompts
		return candidates.slice(0, 5)
	}, [insights])

	// Pre-generate stable random positions for floating particles
	const floatingParticles = useMemo(
		() =>
			[...Array(6)].map(() => ({
				left: 20 + Math.random() * 60,
				top: 20 + Math.random() * 60,
				duration: 5 + Math.random() * 2,
				delay: Math.random() * 2,
			})),
		[]
	)

	// Truncate prompt if too long
	const truncatePrompt = (prompt: string, maxLen: number = 100) => {
		return prompt.length > maxLen ? prompt.slice(0, maxLen) + '...' : prompt
	}

	return (
		<SlideLayout className="relative">
			{/* Header */}
			<motion.div
				className="text-center mb-6"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				<div className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70">
					YOUR GREATEST HITS (AND MISSES)
				</div>
			</motion.div>

			{/* Stacked prompts list */}
			<motion.div
				className="w-full max-w-md space-y-3"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.2, duration: 0.6 }}
			>
				{availablePrompts.map((item, index) => {
					// Alternate colors for variety - using hex values for reliability
					const colorSchemes = [
						{ border: '#bdb7fc', bg: 'rgba(189,183,252,0.2)' }, // lavender
						{ border: '#dd5013', bg: 'rgba(221,80,19,0.15)' }, // sunset
						{ border: '#da1c1c', bg: 'rgba(218,28,28,0.15)' }, // red
						{ border: '#bdb7fc', bg: 'rgba(189,183,252,0.2)' }, // lavender
						{ border: '#dd5013', bg: 'rgba(221,80,19,0.15)' }, // sunset
					]
					const scheme = colorSchemes[index % colorSchemes.length]

					return (
						<motion.div
							key={item.key}
							className="rounded-xl overflow-hidden shadow-sm"
							style={{
								background:
									'linear-gradient(to right, rgba(255,248,240,0.95), rgba(255,248,240,0.8))',
								borderLeft: `4px solid ${scheme.border}`,
							}}
							initial={{ opacity: 0, y: 20 }}
							animate={isActive ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
						>
							{/* Category label header */}
							<div
								className="flex items-center gap-2 px-4 py-2"
								style={{ backgroundColor: scheme.bg }}
							>
								<motion.div
									className="w-1.5 h-1.5 rounded-full"
									style={{ backgroundColor: scheme.border }}
									animate={{
										opacity: [0.5, 1, 0.5],
									}}
									transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
								/>
								<span className="text-xs font-semibold" style={{ color: scheme.border }}>
									{item.label}
								</span>
							</div>

							{/* Prompt content */}
							<div className="p-4">
								<div className="pl-3" style={{ borderLeft: `2px solid ${scheme.border}80` }}>
									<p className="text-dark/85 text-sm font-mono leading-relaxed">
										"{truncatePrompt(item.prompt)}"
									</p>
								</div>
								{item.context && (
									<p className="text-sunset-accent text-xs italic mt-2 pl-3">{item.context}</p>
								)}
							</div>
						</motion.div>
					)
				})}
			</motion.div>

			{/* Subtle floating particles */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{floatingParticles.map((p, i) => (
					<motion.div
						key={i}
						className="absolute w-1 h-1 bg-lavender/30 rounded-full"
						style={{
							left: `${p.left}%`,
							top: `${p.top}%`,
						}}
						animate={{
							y: [0, -30, 0],
							opacity: [0.2, 0.4, 0.2],
						}}
						transition={{
							duration: p.duration,
							repeat: Infinity,
							delay: p.delay,
						}}
					/>
				))}
			</div>
		</SlideLayout>
	)
}
