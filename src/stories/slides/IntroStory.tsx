import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { SlideLayout } from '../../components/SlideLayout'

export function IntroStory({ data, isActive }: StorySlideProps) {
	const { funFacts, generatedAt } = data

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

	// Pick a random fun fact for the teaser
	const funFactTeaser = funFacts && funFacts.length > 0 ? funFacts[0] : null

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
							className="text-sunset-accent text-sm"
						>
							<span className="text-dark/50">[</span>
							<motion.span
								initial={{ width: 0 }}
								animate={isActive ? { width: '100%' } : {}}
								transition={{ delay: 1, duration: 1, ease: 'linear' }}
								className="inline-block overflow-hidden"
							>
								████████████████████
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
							Analysis complete. Generating your journey...
						</motion.div>

						{/* Fun fact teaser */}
						{funFactTeaser && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={isActive ? { opacity: 1 } : {}}
								transition={{ delay: 2.4 }}
								className="mt-3 text-sunset-accent text-xs"
							>
								<span className="text-dark/50">{'>'}</span> {funFactTeaser}
							</motion.div>
						)}

						{/* Generated timestamp */}
						{formattedDate && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={isActive ? { opacity: 1 } : {}}
								transition={{ delay: 2.6 }}
								className="mt-4 pt-3 border-t border-dark/10 text-dark/40 text-xs"
							>
								Session analyzed: {formattedDate}
							</motion.div>
						)}
					</motion.div>
				</div>
			</motion.div>

			{/* Main title - larger with gradient */}
			<motion.div
				className="mt-14"
				initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
				animate={isActive ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
				transition={{ delay: 2.5, duration: 1 }}
			>
				<h1 className="leading-[1.05] text-6xl md:text-8xl font-black tracking-tightest text-sunset-accent">
					YOUR JOURNEY
				</h1>
				<h1 className="leading-[1.05] text-6xl md:text-8xl font-black tracking-tightest mt-1">
					<span className="text-dark">IN CODE</span>
				</h1>
			</motion.div>

			<motion.p
				className="leading-[1.65] text-dark/70 mt-8 text-base tracking-wide"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 3.2 }}
			>
				A journey through your Claude Code sessions
			</motion.p>

			{/* Animated cursor */}
			<motion.div
				className="mt-10 text-sunset-accent font-mono text-xl"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 3.6 }}
			>
				<motion.span
					animate={{ opacity: [1, 0, 1] }}
					transition={{ duration: 1.2, repeat: Infinity }}
				>
					_
				</motion.span>
			</motion.div>
		</SlideLayout>
	)
}
