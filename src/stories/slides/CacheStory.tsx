import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { HeroStat } from '../../components/HeroStat'
import { FillGauge } from '../../components/viz/CircularProgress'
import { SlideLayout } from '../../components/SlideLayout'

export function CacheStory({ data, isActive }: StorySlideProps) {
	const { stats, percentiles } = data

	const cacheRate = (stats.totalTokens.cached / Math.max(stats.totalTokens.input, 1)) * 100
	const cachedTokens = stats.totalTokens.cached

	// Estimate savings (rough: cached tokens at ~$0.003 per 1K vs $0.015 per 1K = $0.012 saved per 1K)
	const estimatedSavings = (cachedTokens / 1000) * 0.012

	const getCacheComment = (rate: number): string => {
		if (rate > 50) return 'Context efficiency master!'
		if (rate > 30) return 'Smart use of context caching'
		if (rate > 15) return 'Building up that cache game'
		if (rate > 5) return "There's room for more caching"
		return 'Fresh context every time'
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
