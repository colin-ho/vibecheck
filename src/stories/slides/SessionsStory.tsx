import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { HeroStat } from '../../components/HeroStat'
import { RadialBurst } from '../../components/viz/RadialBurst'
import { SlideLayout } from '../../components/SlideLayout'

export function SessionsStory({ data, isActive }: StorySlideProps) {
	const { stats, percentiles } = data

	const getSessionsComment = (sessions: number): string => {
		if (sessions > 1000) return 'You basically live inside Claude at this point'
		if (sessions > 500) return 'Touch grass? Never heard of her.'
		if (sessions > 200) return 'Claude knows you better than your therapist'
		if (sessions > 100) return 'Getting comfortable with AI dependency'
		if (sessions > 50) return 'Building a habit. Or an addiction.'
		return 'Baby steps. Everyone starts somewhere (even you).'
	}

	return (
		<SlideLayout>
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				YOU'VE STARTED
			</motion.div>

			{/* Hero stat */}
			{isActive && (
				<HeroStat value={stats.totalSessions} color="cream" glow={false} size="xl" delay={0.3} />
			)}

			<motion.div
				className="text-dark text-xl mt-2"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 1.2 }}
			>
				coding sessions
			</motion.div>

			{/* Radial burst visualization */}
			<motion.div
				className="mt-8"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 1 }}
			>
				<RadialBurst
					count={stats.totalSessions}
					color="#da1c1c"
					secondaryColor="#dd5013"
					size={220}
					rings={4}
					maxDots={80}
					delay={1.2}
				/>
			</motion.div>

			{/* Comment */}
			<motion.div
				className="leading-[1.65] mt-8 text-dark/80 max-w-sm"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 2.2 }}
			>
				{getSessionsComment(stats.totalSessions)}
			</motion.div>

			{/* Percentile - inline text */}
			{percentiles.totalSessions <= 20 && (
				<motion.div
					className="mt-6 text-sm"
					initial={{ opacity: 0, y: 10 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 2.6 }}
				>
					<span className="text-lavender font-semibold">
						Top {Math.round(percentiles.totalSessions)}%
					</span>
					<span className="text-dark/80 ml-2">of all Claude Code users</span>
				</motion.div>
			)}
		</SlideLayout>
	)
}
