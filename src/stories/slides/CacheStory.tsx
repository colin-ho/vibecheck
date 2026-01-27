import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { HeroStat } from '../../components/HeroStat'
import { FillGauge } from '../../components/viz/CircularProgress'
import { SlideLayout } from '../../components/SlideLayout'

export function CacheStory({ data, isActive }: StorySlideProps) {
	const { stats, percentiles } = data

	// Cache efficiency = cache reads / total input tokens (per Anthropic docs)
	// total_input = cache_read + cache_creation + input
	const { cached, cacheCreation, input } = stats.totalTokens
	const totalInput = cached + (cacheCreation ?? 0) + input
	const cacheRate = totalInput > 0 ? (cached / totalInput) * 100 : 0
	const cachedTokens = cached

	// Estimate savings based on current Anthropic pricing (Jan 2026)
	// Opus 4.5: $5/MTok full, $0.50/MTok cache = $4.50/MTok savings
	// Sonnet 4.5: $3/MTok full, $0.30/MTok cache = $2.70/MTok savings
	// Using ~$4/MTok = $0.004 per 1K tokens (assuming mostly Opus usage)
	const estimatedSavings = (cachedTokens / 1000) * 0.004

	const getCacheComment = (rate: number): string => {
		if (rate > 50) return 'At least something about you is efficient'
		if (rate > 30) return 'Room for improvement. Like everything else.'
		if (rate > 15) return 'Your cache game needs work'
		if (rate > 5) return 'Claude forgets you exist between sessions'
		return 'Paying full price every time. Anthropic thanks you.'
	}

	const formatMoney = (n: number): string => {
		if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`
		if (n >= 1) return `$${n.toFixed(0)}`
		return `$${n.toFixed(2)}`
	}

	return (
		<SlideLayout>
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				YOUR CACHE HIT RATE
			</motion.div>

			{/* Fill gauge visualization */}
			<motion.div
				className="flex items-center gap-12"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.3, duration: 0.8 }}
			>
				<FillGauge
					value={cacheRate}
					max={100}
					width={50}
					height={180}
					color="#dd5013"
					animate={true}
					delay={0.6}
				/>

				{/* Hero stat */}
				<div className="text-left">
					{isActive && (
						<HeroStat
							value={cacheRate}
							suffix="%"
							color="sunset"
							glow={true}
							size="lg"
							decimals={1}
							delay={0.6}
						/>
					)}
					<motion.div
						className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-dark/70 mt-2"
						initial={{ opacity: 0 }}
						animate={isActive ? { opacity: 1 } : {}}
						transition={{ delay: 1.4 }}
					>
						CACHE EFFICIENCY
					</motion.div>
				</div>
			</motion.div>

			{/* Savings badge */}
			{estimatedSavings > 1 && (
				<motion.div
					className="mt-10 bg-dark/10 border border-dark/20 px-6 py-3 rounded-full"
					initial={{ opacity: 0, y: 20 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 2 }}
				>
					<span className="text-sunset-accent font-bold text-lg">
						~{formatMoney(estimatedSavings)}
					</span>
					<span className="text-dark/60 text-sm ml-2">estimated savings</span>
				</motion.div>
			)}

			{/* Comment */}
			<motion.div
				className="leading-[1.65] mt-8 text-dark/80 text-sm max-w-sm"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 2.4 }}
			>
				{getCacheComment(cacheRate)}
			</motion.div>

			{/* Percentile badge */}
			{percentiles.cacheEfficiency <= 25 && (
				<motion.div
					className="mt-4 text-sm"
					initial={{ opacity: 0, y: 10 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 2.7 }}
				>
					<span className="text-sunset-accent font-semibold">
						Top {Math.round(percentiles.cacheEfficiency)}%
					</span>
					<span className="text-dark/80 ml-2">in cache efficiency</span>
				</motion.div>
			)}
		</SlideLayout>
	)
}
