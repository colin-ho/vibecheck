import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { SlideLayout } from '../../components/SlideLayout'

// Warm color palette for topics
const topicColors: Record<string, string> = {
	debugging: '#da1c1c',
	frontend: '#bdb7fc',
	backend: '#dd5013',
	devops: '#a05f1a',
	ai: '#8b372b',
	testing: '#5d3d3a',
	refactoring: '#3b110c',
}

const defaultColors = ['#bdb7fc', '#dd5013', '#da1c1c', '#a05f1a', '#8b372b']

function getTopicColor(topic: string, index: number): string {
	const lowerTopic = topic.toLowerCase()
	return topicColors[lowerTopic] || defaultColors[index % defaultColors.length]
}

function getTopicRoast(topic: string): string {
	const roasts: Record<string, string> = {
		debugging: "You spent most of your time hunting bugs. At least you're consistent.",
		frontend: 'CSS centering issues haunted your dreams. We understand.',
		backend: 'APIs, databases, and existential dread about production deployments.',
		devops: "Containers, pipelines, and the occasional 3AM alert. You're dedicated.",
		ai: 'Teaching machines to think. What could possibly go wrong?',
		testing: "Writing tests means you care. Or you've been burned before.",
		refactoring: 'Perfection is a journey, not a destination. You took the scenic route.',
	}
	return roasts[topic.toLowerCase()] || `${topic} was clearly on your mind. A lot.`
}

export function ObsessionsStory({ data, isActive }: StorySlideProps) {
	const { insights } = data

	// Get dominant topics from insights
	const dominantTopics = insights?.dominantTopics || []
	const obsessions = insights?.obsessions

	// Get detailed topics from obsessions (more specific than dominantTopics)
	const detailedTopics = obsessions?.topics || []

	// Build topic data with percentages (equal distribution if we just have names)
	const topicCount = dominantTopics.length || 1
	const topicData = dominantTopics.map((topic, index) => ({
		name: topic,
		percentage: Math.round(100 / topicCount), // Simple equal distribution
		color: getTopicColor(topic, index),
	}))

	const topTopic = topicData[0]

	// Get actual projects and frequently revisited items
	const actualProjects = obsessions?.actualProjects || []
	const frequentlyRevisited = obsessions?.frequentlyRevisited || []

	// Calculate max percentage for bubble sizing
	const maxPercentage = Math.max(...topicData.map((t) => t.percentage), 1)

	return (
		<SlideLayout>
			{/* Header */}
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				WHAT KEPT YOU UP AT NIGHT
			</motion.div>

			{/* Detailed topics pills */}
			{detailedTopics.length > 0 && (
				<motion.div
					className="flex flex-wrap justify-center gap-2 mb-6"
					initial={{ opacity: 0, y: 10 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.2, duration: 0.6 }}
				>
					{detailedTopics.slice(0, 5).map((topic, i) => (
						<motion.span
							key={i}
							className="text-xs px-3 py-1.5 rounded-full bg-lavender/20 text-dark/80 border border-lavender/30"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={isActive ? { opacity: 1, scale: 1 } : {}}
							transition={{ delay: 0.3 + i * 0.1 }}
						>
							{topic}
						</motion.span>
					))}
				</motion.div>
			)}

			{/* Bubble cluster visualization */}
			{topicData.length > 0 && (
				<motion.div
					className="relative w-72 h-72 mb-6"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={isActive ? { opacity: 1, scale: 1 } : {}}
					transition={{ delay: 0.3, duration: 0.8 }}
				>
					{topicData.slice(0, 6).map((topic, index) => {
						// Position bubbles in a cluster
						const angle = (index / Math.min(topicData.length, 6)) * Math.PI * 2 - Math.PI / 2
						const distanceFromCenter = index === 0 ? 0 : 80 + (index % 2) * 20
						const size = 40 + (topic.percentage / maxPercentage) * 60

						const x = 144 + (index === 0 ? 0 : Math.cos(angle) * distanceFromCenter)
						const y = 144 + (index === 0 ? 0 : Math.sin(angle) * distanceFromCenter)

						return (
							<motion.div
								key={topic.name}
								className="absolute flex flex-col items-center justify-center rounded-full"
								style={{
									left: x - size / 2,
									top: y - size / 2,
									width: size,
									height: size,
									background: `radial-gradient(circle, ${topic.color}50, ${topic.color}30)`,
									border: `2px solid ${topic.color}70`,
								}}
								initial={{ opacity: 0, scale: 0 }}
								animate={isActive ? { opacity: 1, scale: 1 } : {}}
								transition={{
									delay: 0.6 + index * 0.15,
									type: 'spring',
									stiffness: 200,
								}}
							>
								{index === 0 && (
									<>
										<span className="text-dark text-xs font-bold capitalize">{topic.name}</span>
									</>
								)}
							</motion.div>
						)
					})}
				</motion.div>
			)}

			{/* Topic list */}
			<motion.div
				className="w-full max-w-sm space-y-2"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 1.7 }}
			>
				{topicData.slice(0, 5).map((topic, index) => (
					<motion.div
						key={topic.name}
						className="flex items-center gap-3"
						initial={{ opacity: 0, x: -20 }}
						animate={isActive ? { opacity: 1, x: 0 } : {}}
						transition={{ delay: 1.7 + index * 0.1 }}
					>
						<div className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }} />
						<span className="text-dark/60 text-xs w-24 capitalize">{topic.name}</span>
						<div className="flex-1 h-1.5 bg-cream/40 rounded-full overflow-hidden">
							<motion.div
								className="h-full rounded-full"
								style={{ backgroundColor: topic.color }}
								initial={{ width: 0 }}
								animate={isActive ? { width: `${topic.percentage}%` } : {}}
								transition={{ delay: 1.9 + index * 0.1, duration: 0.8 }}
							/>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* What you built */}
			{actualProjects.length > 0 && (
				<motion.div
					className="mt-6 text-center"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.2 }}
				>
					<div className="text-xs text-dark/70 mb-2">What you were building:</div>
					<div className="flex flex-wrap justify-center gap-2">
						{actualProjects.slice(0, 4).map((project, i) => (
							<span key={i} className="text-xs bg-cream/60 px-3 py-1 rounded-full text-dark/80">
								{project}
							</span>
						))}
					</div>
				</motion.div>
			)}

			{/* Frequently revisited */}
			{frequentlyRevisited.length > 0 && (
				<motion.div
					className="mt-4 text-center"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.4 }}
				>
					<div className="text-xs text-dark/70 mb-2">Kept coming back to:</div>
					<div className="flex flex-wrap justify-center gap-2">
						{frequentlyRevisited.slice(0, 3).map((item, i) => (
							<span
								key={i}
								className="text-xs bg-sunset/20 px-3 py-1 rounded-full text-dark/80 italic"
							>
								"{item}"
							</span>
						))}
					</div>
				</motion.div>
			)}

			{/* Roast for top topic */}
			{topTopic && (
				<motion.div
					className="leading-[1.65] mt-6 text-sunset-accent text-sm italic text-center max-w-sm"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.6 }}
				>
					{getTopicRoast(topTopic.name)}
				</motion.div>
			)}
		</SlideLayout>
	)
}
