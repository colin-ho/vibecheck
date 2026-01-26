import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { SlideLayout } from '../../components/SlideLayout'

// Warm color palette for models
const modelInfo: Record<string, { name: string; color: string; description: string }> = {
	opus: { name: 'Claude Opus', color: '#da1c1c', description: 'The powerhouse' },
	'claude-opus-4-20250514': {
		name: 'Claude Opus 4',
		color: '#da1c1c',
		description: 'Latest powerhouse',
	},
	sonnet: { name: 'Claude Sonnet', color: '#bdb7fc', description: 'The sweet spot' },
	'claude-sonnet-4-20250514': {
		name: 'Claude Sonnet 4',
		color: '#bdb7fc',
		description: 'Latest balance',
	},
	haiku: { name: 'Claude Haiku', color: '#dd5013', description: 'Speed demon' },
	'claude-3-opus-20240229': {
		name: 'Claude 3 Opus',
		color: '#da1c1c',
		description: 'The powerhouse',
	},
	'claude-3-5-sonnet-20241022': {
		name: 'Claude 3.5 Sonnet',
		color: '#bdb7fc',
		description: 'The sweet spot',
	},
	'claude-3-haiku-20240307': {
		name: 'Claude 3 Haiku',
		color: '#dd5013',
		description: 'Speed demon',
	},
}

export function ModelsStory({ data, isActive }: StorySlideProps) {
	const { stats } = data

	const total = Object.values(stats.modelUsage).reduce((a, b) => a + b, 0)
	const sortedModels = Object.entries(stats.modelUsage)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3)

	// Handle empty model data
	const hasModelData = sortedModels.length > 0 && total > 0

	const modelData = sortedModels.map(([model, tokens]) => ({
		model,
		tokens,
		percentage: total > 0 ? (tokens / total) * 100 : 0,
		...(modelInfo[model] || { name: model, color: '#8b372b', description: 'Model' }),
	}))

	const topModel = modelData[0]

	const getModelComment = (model: string, percentage: number): string => {
		const modelKey = model.toLowerCase()
		if (modelKey.includes('opus')) {
			if (percentage > 80) return 'Expensive taste for simple problems'
			if (percentage > 50) return 'Your token bill could fund a startup'
			return 'Opus for everything? Bold. Expensive.'
		}
		if (modelKey.includes('sonnet')) {
			if (percentage > 80) return 'Middle of the road. Very you.'
			if (percentage > 50) return 'The safe choice. Predictable.'
			return "Can't commit to one model either"
		}
		if (modelKey.includes('haiku')) {
			if (percentage > 50) return 'Speed over quality? Bold choice.'
			return 'Quick and cheap. Like your code.'
		}
		return 'Model indecision detected.'
	}

	// Concentric rings visualization
	const ringData = modelData.map((model, index) => ({
		...model,
		radius: 80 - index * 20,
		strokeWidth: Math.max(8, 16 - index * 4),
	}))

	// Empty state
	if (!hasModelData) {
		return (
			<SlideLayout>
				<motion.div
					className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6 text-center"
					initial={{ opacity: 0, y: -20 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					YOUR MODEL MIX
				</motion.div>
				<motion.div
					className="text-dark/60 text-sm text-center"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 0.3 }}
				>
					No model usage data available yet.
				</motion.div>
			</SlideLayout>
		)
	}

	return (
		<SlideLayout>
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				YOUR MODEL MIX
			</motion.div>

			{/* Concentric rings visualization */}
			<motion.div
				className="relative my-6"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.3, type: 'spring' }}
			>
				<svg viewBox="0 0 200 200" className="w-56 h-56">
					{ringData.map((model, index) => {
						const circumference = 2 * Math.PI * model.radius
						const dashLength = (model.percentage / 100) * circumference

						return (
							<motion.circle
								key={model.model}
								cx="100"
								cy="100"
								r={model.radius}
								fill="none"
								stroke={model.color}
								strokeWidth={model.strokeWidth}
								strokeLinecap="round"
								strokeDasharray={`${dashLength} ${circumference}`}
								transform="rotate(-90 100 100)"
								initial={{ strokeDashoffset: circumference }}
								animate={isActive ? { strokeDashoffset: 0 } : {}}
								transition={{
									delay: 0.6 + index * 0.2,
									duration: 1.2,
									ease: 'easeOut',
								}}
								style={{
									filter: index === 0 ? `drop-shadow(0 0 10px ${model.color}60)` : undefined,
								}}
							/>
						)
					})}

					{/* Background rings */}
					{ringData.map((model) => (
						<circle
							key={`bg-${model.model}`}
							cx="100"
							cy="100"
							r={model.radius}
							fill="none"
							stroke="rgba(59, 17, 12, 0.08)"
							strokeWidth={model.strokeWidth}
						/>
					))}
				</svg>

				{/* Center - top model name */}
				<motion.div
					className="absolute inset-0 flex flex-col items-center justify-center"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 1.4 }}
				>
					<div className="text-xl font-bold text-dark">{topModel?.name.split(' ').pop()}</div>
					<div className="text-2xl font-black" style={{ color: topModel?.color }}>
						{topModel?.percentage.toFixed(0)}%
					</div>
				</motion.div>
			</motion.div>

			{/* Model legend */}
			<motion.div
				className="flex flex-col gap-3 w-full max-w-xs"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 1.7 }}
			>
				{modelData.map((model, index) => (
					<motion.div
						key={model.model}
						className="flex items-center gap-3"
						initial={{ opacity: 0, x: -20 }}
						animate={isActive ? { opacity: 1, x: 0 } : {}}
						transition={{ delay: 1.7 + index * 0.15 }}
					>
						<div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
						<div className="flex-1">
							<div className="text-dark text-sm font-medium">{model.name}</div>
						</div>
						<div className="text-right">
							<div className="text-dark text-sm font-bold">{model.percentage.toFixed(1)}%</div>
							<div className="text-dark/70 text-xs">{(model.tokens / 1000000).toFixed(1)}M</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Comment */}
			{topModel && (
				<motion.div
					className="leading-[1.65] mt-8 text-dark/80 text-sm text-center"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.4 }}
				>
					{getModelComment(topModel.model, topModel.percentage)}
				</motion.div>
			)}
		</SlideLayout>
	)
}
