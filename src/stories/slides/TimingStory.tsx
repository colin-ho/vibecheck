import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'

export function TimingStory({ data, isActive }: StorySlideProps) {
	const { stats, percentiles } = data

	// Safe handling for empty/zero hourCounts
	const hasHourData = stats.hourCounts.some((count) => count > 0)
	const maxHour = hasHourData ? Math.max(...stats.hourCounts) : 1
	const peakHour = stats.peakHour ?? 12

	const getTimePersonality = (): { title: string; description: string } => {
		// Peak hour should be the primary signal
		if (peakHour >= 22 || peakHour <= 4) {
			return { title: 'Night Owl', description: 'Sleep is for people with healthy habits' }
		}
		if (peakHour >= 5 && peakHour <= 8) {
			return { title: 'Early Bird', description: 'Coding before your brain wakes up. Bold.' }
		}
		if (peakHour >= 9 && peakHour <= 17) {
			return { title: 'Day Coder', description: '9-5 energy. How... conventional.' }
		}
		// peakHour 18-21
		return { title: 'Evening Warrior', description: 'Work-life balance has left the chat' }
	}

	const personality = getTimePersonality()

	const formatHour = (hour: number): string => {
		if (hour === 0) return '12am'
		if (hour === 12) return '12pm'
		if (hour < 12) return `${hour}am`
		return `${hour - 12}pm`
	}

	// Clock visualization - 24 segments in a circle
	const clockRadius = 100
	const innerRadius = 45
	const segmentAngle = (2 * Math.PI) / 24

	return (
		<div className="min-h-dvh h-dvh w-full p-[clamp(2rem,5vw,4rem)] pb-[clamp(3rem,7vw,5.5rem)] pt-[clamp(3rem,7vw,5.5rem)] flex flex-col items-center justify-center text-center max-w-6xl mx-auto overflow-y-auto">
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-4 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				WHEN YOU CODE
			</motion.div>

			{/* Time personality */}
			<motion.div
				className="text-center mb-4"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.3 }}
			>
				<div className="text-4xl font-black text-dark tracking-tight">{personality.title}</div>
				<div className="text-dark/80 text-sm mt-2">{personality.description}</div>
			</motion.div>

			{/* Circular 24-hour clock */}
			<motion.div
				className="relative flex-shrink-0"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.7 }}
			>
				<svg
					width={clockRadius * 2 + 40}
					height={clockRadius * 2 + 40}
					className="overflow-visible"
				>
					<g transform={`translate(${clockRadius + 20}, ${clockRadius + 20})`}>
						{/* Hour segments */}
						{stats.hourCounts.map((count, hour) => {
							const intensity = maxHour > 0 ? count / maxHour : 0
							const startAngle = (hour - 6) * segmentAngle // Start at 6am (top)
							const endAngle = (hour - 5) * segmentAngle

							const isAM = hour < 12
							// Warm colors: lavender for AM, gander-red for PM
							const baseColor = isAM ? '189, 183, 252' : '218, 28, 28'

							const x1Inner = innerRadius * Math.cos(startAngle)
							const y1Inner = innerRadius * Math.sin(startAngle)
							const x2Inner = innerRadius * Math.cos(endAngle)
							const y2Inner = innerRadius * Math.sin(endAngle)

							const segmentOuter =
								innerRadius + (clockRadius - innerRadius) * Math.max(0.1, intensity)
							const x1Outer = segmentOuter * Math.cos(startAngle)
							const y1Outer = segmentOuter * Math.sin(startAngle)
							const x2Outer = segmentOuter * Math.cos(endAngle)
							const y2Outer = segmentOuter * Math.sin(endAngle)

							const isPeak = hour === peakHour

							return (
								<motion.path
									key={hour}
									d={`M ${x1Inner} ${y1Inner} L ${x1Outer} ${y1Outer} A ${segmentOuter} ${segmentOuter} 0 0 1 ${x2Outer} ${y2Outer} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 0 0 ${x1Inner} ${y1Inner}`}
									fill={`rgba(${baseColor}, ${0.3 + intensity * 0.7})`}
									stroke={isPeak ? (isAM ? '#bdb7fc' : '#da1c1c') : 'rgba(59,17,12,0.1)'}
									strokeWidth={isPeak ? 2 : 0.5}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={isActive ? { opacity: 1, scale: 1 } : {}}
									transition={{ delay: 1 + hour * 0.03 }}
									style={{
										transformOrigin: 'center',
										filter: isPeak ? `drop-shadow(0 0 8px rgba(${baseColor}, 0.8))` : undefined,
									}}
								/>
							)
						})}

						{/* Center content */}
						<motion.text
							x={0}
							y={0}
							textAnchor="middle"
							dominantBaseline="middle"
							className="text-lg font-bold fill-dark"
							initial={{ opacity: 0 }}
							animate={isActive ? { opacity: 1 } : {}}
							transition={{ delay: 1.8 }}
						>
							{formatHour(peakHour)}
						</motion.text>
					</g>
				</svg>

				{/* Hour markers */}
				<div className="absolute inset-0 pointer-events-none">
					{[0, 6, 12, 18].map((hour) => {
						const angle = (hour - 6) * segmentAngle
						const x = clockRadius + 20 + (clockRadius + 15) * Math.cos(angle)
						const y = clockRadius + 20 + (clockRadius + 15) * Math.sin(angle)
						return (
							<div
								key={hour}
								className="absolute text-xs text-dark/70 font-mono"
								style={{
									left: x,
									top: y,
									transform: 'translate(-50%, -50%)',
								}}
							>
								{formatHour(hour)}
							</div>
						)
					})}
				</div>
			</motion.div>

			{/* Peak hour highlight */}
			<motion.div
				className="mt-4 text-center"
				initial={{ opacity: 0, y: 20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ delay: 2.2 }}
			>
				<div className="text-sm text-dark/80">
					Peak hour: <span className="text-dark font-semibold">{formatHour(peakHour)}</span>
				</div>
			</motion.div>

			{/* Night coding percentile */}
			{percentiles.nightCoding <= 20 && (
				<motion.div
					className="mt-3 text-sm"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.5 }}
				>
					<span className="text-brand-red font-semibold">
						Top {Math.round(percentiles.nightCoding)}%
					</span>
					<span className="text-dark/80 ml-2">night coder</span>
				</motion.div>
			)}
		</div>
	)
}
