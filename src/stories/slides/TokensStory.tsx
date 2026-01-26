import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { HeroStat } from '../../components/HeroStat'
import { ArcPair } from '../../components/viz/ArcPair'
import { SlideLayout } from '../../components/SlideLayout'

export function TokensStory({ data, isActive }: StorySlideProps) {
	const { stats, percentiles } = data
	const totalTokens = stats.totalTokens ?? { input: 0, output: 0, cached: 0 }

	const total = totalTokens.input + totalTokens.output

	const getTokenComment = (tokens: number): string => {
		if (tokens > 10000000) return "Anthropic's accountants thank you for your service"
		if (tokens > 5000000) return "That's a small fortune in API calls"
		if (tokens > 1000000) return 'A million tokens? Your wallet is crying'
		if (tokens > 500000) return 'Half a million tokens of asking Claude to fix things'
		return "Either you're efficient or you're not trying hard enough"
	}

	return (
		<SlideLayout>
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				YOU BURNED THROUGH
			</motion.div>

			{/* Hero stat */}
			{isActive && (
				<HeroStat
					value={total / 1000000}
					suffix="M"
					label="TOKENS WITH CLAUDE"
					color="cream"
					glow={false}
					size="lg"
					decimals={1}
					delay={0.3}
				/>
			)}

			{/* Dual arc visualization - input vs output */}
			<motion.div
				className="mt-10"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 1 }}
			>
				<ArcPair
					leftValue={totalTokens.input}
					rightValue={totalTokens.output}
					leftColor="#bdb7fc"
					rightColor="#da1c1c"
					leftLabel="INPUT"
					rightLabel="OUTPUT"
					leftGradient={['#bdb7fc', '#dd5013']}
					rightGradient={['#da1c1c', '#dd5013']}
					size={260}
					strokeWidth={14}
					delay={1.2}
				/>
			</motion.div>

			{/* Cached tokens inline stat */}
			{totalTokens.cached > 0 && (
				<motion.div
					className="mt-8 text-sm"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.2 }}
				>
					<span className="text-sunset-accent font-semibold">
						{(totalTokens.cached / 1000000).toFixed(1)}M
					</span>
					<span className="text-dark/80 ml-2">from cache</span>
				</motion.div>
			)}

			{/* Comment */}
			<motion.div
				className="leading-[1.65] mt-6 text-dark/80 text-sm"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 2.5 }}
			>
				{getTokenComment(total)}
			</motion.div>

			{/* Percentile badge */}
			{percentiles.tokenUsage <= 20 && (
				<motion.div
					className="mt-4 text-sm"
					initial={{ opacity: 0, y: 10 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 2.8 }}
				>
					<span className="text-lavender font-semibold">
						Top {Math.round(percentiles.tokenUsage)}%
					</span>
					<span className="text-dark/80 ml-2">token user</span>
				</motion.div>
			)}
		</SlideLayout>
	)
}
