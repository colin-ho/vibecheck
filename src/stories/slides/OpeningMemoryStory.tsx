import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { SlideLayout } from '../../components/SlideLayout'
import { PromptWithContext } from '../../data/bundle.generated'

// Category labels for memorable prompts
const promptLabels: Record<string, string> = {
	mostAmbitious: 'Your Most Ambitious Ask',
	biggestFacepalm: 'Biggest Facepalm Moment',
	funniest: 'Your Funniest Request',
	weirdest: 'Your Weirdest Ask',
	mostFrustrated: 'Peak Frustration',
	mostGrateful: 'Most Grateful Moment',
	lateNightRamble: 'Late Night Ramble',
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

		// Priority order: mostAmbitious → biggestFacepalm → funniest → weirdest → mostFrustrated → mostGrateful → lateNightRamble
		const priorityOrder: (keyof typeof promptLabels)[] = [
			'mostAmbitious',
			'biggestFacepalm',
			'funniest',
			'weirdest',
			'mostFrustrated',
			'mostGrateful',
			'lateNightRamble',
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

		return candidates
	}, [insights])

	// Use the first (highest priority) available prompt
	const selectedPrompt = availablePrompts[0]
	const memorablePrompt = selectedPrompt.prompt
	const promptContext = selectedPrompt.context
	const promptLabel = selectedPrompt.label

	// Truncate if too long
	const displayPrompt =
		memorablePrompt.length > 180 ? memorablePrompt.slice(0, 180) + '...' : memorablePrompt

	// Pre-generate stable random positions for floating particles
	const floatingParticles = useMemo(
		() =>
			[...Array(8)].map(() => ({
				left: 20 + Math.random() * 60,
				top: 20 + Math.random() * 60,
				duration: 5 + Math.random() * 2,
				delay: Math.random() * 2,
			})),
		[]
	)

	// Use context from insights or generate based on characteristics
	const getRoast = () => {
		if (promptContext && promptContext !== 'Your journey began') {
			return promptContext
		}
		const lowerPrompt = memorablePrompt.toLowerCase()
		if (
			lowerPrompt.includes('fix') ||
			lowerPrompt.includes('bug') ||
			lowerPrompt.includes('error')
		) {
			return 'Debugging mode activated. Some things never change.'
		}
		if (lowerPrompt.includes('help')) {
			return 'A humble request. Claude was happy to assist.'
		}
		if (memorablePrompt === memorablePrompt.toUpperCase() && memorablePrompt.length > 10) {
			return 'ALL CAPS energy. We can hear you.'
		}
		if (lowerPrompt.includes('please')) {
			return 'Polite! Claude appreciates the manners.'
		}
		return 'And so the journey continued...'
	}

	return (
		<SlideLayout className="relative">
			{/* Header with category badge */}
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-10"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				{promptLabel.toUpperCase()}
			</motion.div>

			{/* Memory card - warm refined style */}
			<motion.div
				className="w-full max-w-md"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.3, duration: 0.8 }}
			>
				<div className="bg-cream/90 border border-dark/10 rounded-xl overflow-hidden">
					{/* Terminal header - warm minimal */}
					<div className="flex items-center gap-2 px-4 py-2.5 bg-sunset-afternoon border-b border-dark/10">
						<motion.div
							className="w-2 h-2 rounded-full bg-lavender"
							animate={{
								opacity: [0.5, 1, 0.5],
							}}
							transition={{ duration: 2.5, repeat: Infinity }}
						/>
						<span className="text-dark/70 text-xs font-mono">your-journey</span>
					</div>

					{/* Content */}
					<div className="p-5">
						{/* "You wrote:" label */}
						<motion.div
							className="text-dark/80 text-xs mb-2"
							initial={{ opacity: 0 }}
							animate={isActive ? { opacity: 1 } : {}}
							transition={{ delay: 0.7 }}
						>
							You wrote:
						</motion.div>

						{/* The actual prompt with typing cursor */}
						<motion.div
							className="relative"
							initial={{ opacity: 0, x: -10 }}
							animate={isActive ? { opacity: 1, x: 0 } : {}}
							transition={{ delay: 0.9, duration: 0.6 }}
						>
							<div className="border-l-2 border-lavender/60 pl-4 py-2">
								<p className="text-dark/90 text-base font-mono leading-relaxed">
									"{displayPrompt}"
									<motion.span
										className="inline-block w-2 h-4 bg-lavender/50 ml-1 align-middle"
										animate={{ opacity: [1, 0, 1] }}
										transition={{ duration: 1.2, repeat: Infinity }}
									/>
								</p>
							</div>
						</motion.div>

						{/* Roast/comment - italic sunset orange */}
						<motion.p
							className="leading-[1.65] text-sunset-accent text-sm italic mt-5"
							initial={{ opacity: 0 }}
							animate={isActive ? { opacity: 1 } : {}}
							transition={{ delay: 1.8 }}
						>
							{getRoast()}
						</motion.p>
					</div>
				</div>
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
