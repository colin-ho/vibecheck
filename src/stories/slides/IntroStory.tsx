import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { SlideLayout } from '../../components/SlideLayout'

export function IntroStory({ data, isActive }: StorySlideProps) {
	const { funFacts, generatedAt, stats } = data

	// Format the generated date
	const formattedDate = useMemo(() => {
		if (!generatedAt) return null
		try {
			const date = new Date(generatedAt)
			return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
		} catch {
			return null
		}
	}, [generatedAt])

	// Get multiple fun facts (up to 3)
	const displayFunFacts = funFacts?.slice(0, 3) || []

	// Format large numbers
	const formatNumber = (n: number): string => {
		if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
		if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
		return n.toString()
	}

	const totalTokens = (stats.totalTokens?.input ?? 0) + (stats.totalTokens?.output ?? 0)

	return (
		<SlideLayout>
			{/* Terminal frame - warm refined style */}
			<motion.div
				className="relative max-w-xl w-full"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ duration: 1 }}
			>
				{/* Terminal header - warm colors */}
				<div className="bg-sunset-afternoon border border-dark/10 rounded-t-lg px-4 py-2.5 flex items-center gap-3">
					{/* Single lavender pulse indicator */}
					<motion.div
						className="w-2.5 h-2.5 rounded-full bg-lavender"
						animate={{
							boxShadow: [
								'0 0 4px rgba(189, 183, 252, 0.5)',
								'0 0 12px rgba(189, 183, 252, 0.8)',
								'0 0 4px rgba(189, 183, 252, 0.5)',
							],
						}}
						transition={{ duration: 2.5, repeat: Infinity }}
					/>
					<span className="text-dark/80 text-xs font-mono tracking-wider">vibechecked</span>
				</div>

				{/* Terminal content */}
				<div className="bg-sunset-morning border-x border-b border-dark/10 rounded-b-lg p-6 md:p-8">
					<motion.div
						className="font-mono text-left"
						initial={{ opacity: 0 }}
						animate={isActive ? { opacity: 1 } : {}}
						transition={{ delay: 0.5 }}
					>
						<div className="text-dark/60 text-sm mb-3">$ claude --vibes</div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={isActive ? { opacity: 1 } : {}}
							transition={{ delay: 1 }}
							className="text-sunset-accent text-sm whitespace-nowrap overflow-hidden"
						>
							<span className="text-dark/50">[</span>
							<motion.span
								initial={{ width: 0 }}
								animate={isActive ? { width: '8ch' } : {}}
								transition={{ delay: 1, duration: 1, ease: 'linear' }}
								className="inline-block overflow-hidden"
							>
								████████
							</motion.span>
							<span className="text-dark/50">]</span>
							<span className="ml-2">100%</span>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={isActive ? { opacity: 1 } : {}}
							transition={{ delay: 2.1 }}
							className="mt-4 text-dark/70 text-sm"
						>
							Analysis complete. We saw everything.
						</motion.div>

						{/* Key stats summary */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={isActive ? { opacity: 1 } : {}}
							transition={{ delay: 2.3 }}
							className="mt-4 grid grid-cols-3 gap-3 text-center"
						>
							<div className="bg-cream/50 rounded-lg py-2 px-1">
								<div className="text-dark font-bold text-lg">{formatNumber(totalTokens)}</div>
								<div className="text-dark/60 text-[10px]">tokens</div>
							</div>
							<div className="bg-cream/50 rounded-lg py-2 px-1">
								<div className="text-dark font-bold text-lg">{stats.totalSessions}</div>
								<div className="text-dark/60 text-[10px]">sessions</div>
							</div>
							<div className="bg-cream/50 rounded-lg py-2 px-1">
								<div className="text-dark font-bold text-lg">{stats.projectCount}</div>
								<div className="text-dark/60 text-[10px]">projects</div>
							</div>
						</motion.div>

						{/* Fun facts */}
						{displayFunFacts.length > 0 && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={isActive ? { opacity: 1 } : {}}
								transition={{ delay: 2.6 }}
								className="mt-4 space-y-1.5"
							>
								{displayFunFacts.map((fact, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, x: -10 }}
										animate={isActive ? { opacity: 1, x: 0 } : {}}
										transition={{ delay: 2.6 + i * 0.15 }}
										className="text-sunset-accent text-xs"
									>
										<span className="text-dark/50">{'>'}</span> {fact}
									</motion.div>
								))}
							</motion.div>
						)}

						{/* Generated timestamp */}
						{formattedDate && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={isActive ? { opacity: 1 } : {}}
								transition={{ delay: 3.1 }}
								className="mt-4 pt-3 border-t border-dark/10 text-dark/40 text-xs"
							>
								Coding crimes documented: {formattedDate}
							</motion.div>
						)}
					</motion.div>
				</div>
			</motion.div>

			{/* Animated cursor */}
			<motion.div
				className="mt-10 text-sunset-accent font-mono text-xl"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 3.4 }}
			>
				<motion.span
					animate={{ opacity: [1, 0, 1] }}
					transition={{ duration: 1.2, repeat: Infinity }}
				>
					_
				</motion.span>
			</motion.div>

			{/* CTA to continue */}
			<motion.div
				className="mt-6 text-dark/60 text-sm"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 3.6 }}
			>
				Welcome to your vibe check
			</motion.div>
		</SlideLayout>
	)
}
