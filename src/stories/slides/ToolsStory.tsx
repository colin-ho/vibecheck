import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { HeroStat } from '../../components/HeroStat'
import { RadialBarChart } from '../../components/viz/RadialChart'
import { SlideLayout } from '../../components/SlideLayout'

// Updated to warm color palette
const toolColors: Record<string, string> = {
	Read: '#bdb7fc', // lavender
	Bash: '#dd5013', // sunset-orange
	Edit: '#da1c1c', // gander-red
	Write: '#a05f1a', // coffee
	Grep: '#8b372b', // cinnamon
	Glob: '#5d3d3a', // cocoa
	Task: '#bdb7fc', // lavender
	WebFetch: '#dd5013', // sunset-orange
	WebSearch: '#da1c1c', // gander-red
}

export function ToolsStory({ data, isActive }: StorySlideProps) {
	const { stats, percentiles } = data

	const sortedTools = Object.entries(stats.toolUsage)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 6)

	const maxUsage = sortedTools[0]?.[1] || 1
	const totalTools = Object.values(stats.toolUsage).reduce((a, b) => a + b, 0)
	const toolCount = Object.keys(stats.toolUsage).length

	const topTool = sortedTools[0]

	const getToolComment = (tool: string): string => {
		switch (tool) {
			case 'Read':
				return 'You like to understand before you act'
			case 'Bash':
				return 'Command line warrior detected'
			case 'Edit':
				return 'Precision editing is your style'
			case 'Write':
				return 'Creating new things from scratch'
			case 'Grep':
				return 'Searching for that needle in the haystack'
			case 'Glob':
				return 'Pattern matching pro'
			case 'Task':
				return 'Delegation master'
			default:
				return 'A diverse toolkit'
		}
	}

	// Prepare data for radial bar chart
	const chartSegments = sortedTools.map(([tool, count]) => ({
		value: count,
		maxValue: maxUsage,
		color: toolColors[tool] || '#8b372b',
		label: tool,
	}))

	return (
		<SlideLayout>
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				YOUR TOOL ARSENAL
			</motion.div>

			{/* Total tool calls */}
			<motion.div
				className="text-center mb-6"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.3 }}
			>
				{isActive && (
					<HeroStat
						value={totalTools}
						label="TOTAL TOOL CALLS"
						color="cream"
						size="md"
						delay={0.3}
					/>
				)}
			</motion.div>

			{/* Radial bar chart */}
			<motion.div
				className="relative"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.7 }}
			>
				<RadialBarChart
					segments={chartSegments}
					size={260}
					innerRadius={50}
					outerRadius={110}
					animate={true}
					delay={1}
					highlightIndex={0}
				/>

				{/* Center content - top tool */}
				{topTool && (
					<motion.div
						className="absolute inset-0 flex flex-col items-center justify-center"
						initial={{ opacity: 0 }}
						animate={isActive ? { opacity: 1 } : {}}
						transition={{ delay: 1.8 }}
					>
						<div className="text-2xl font-bold text-dark">{topTool[0]}</div>
						<div className="text-xs text-dark/80 mt-1">{topTool[1].toLocaleString()}</div>
					</motion.div>
				)}
			</motion.div>

			{/* Tool legend */}
			<motion.div
				className="mt-6 flex flex-wrap justify-center gap-3 max-w-md"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 2 }}
			>
				{sortedTools.map(([tool, count], index) => (
					<motion.div
						key={tool}
						className="flex items-center gap-2 text-xs"
						initial={{ opacity: 0, y: 10 }}
						animate={isActive ? { opacity: 1, y: 0 } : {}}
						transition={{ delay: 2 + index * 0.1 }}
					>
						<div
							className="w-2 h-2 rounded-full"
							style={{ backgroundColor: toolColors[tool] || '#8b372b' }}
						/>
						<span className="text-dark/60">{tool}</span>
						<span className="text-dark/80">{count.toLocaleString()}</span>
					</motion.div>
				))}
			</motion.div>

			{/* Tool comment */}
			{topTool && (
				<motion.div
					className="leading-[1.65] mt-6 text-dark/80 text-sm"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.5 }}
				>
					{getToolComment(topTool[0])}
				</motion.div>
			)}

			{/* Tool diversity badge */}
			{percentiles.toolDiversity <= 20 && (
				<motion.div
					className="mt-4 text-sm"
					initial={{ opacity: 0, y: 10 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 2.8 }}
				>
					<span className="text-sunset-accent font-semibold">
						Top {Math.round(percentiles.toolDiversity)}%
					</span>
					<span className="text-dark/80 ml-2">in tool diversity ({toolCount} tools)</span>
				</motion.div>
			)}
		</SlideLayout>
	)
}
