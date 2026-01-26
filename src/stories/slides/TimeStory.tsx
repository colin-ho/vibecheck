import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { DailyActivity, StorySlideProps } from '../../data/types'

// Build contribution grid from real activity dates
function buildContributionGrid(
	activeDates: DailyActivity[] | undefined,
	daysActive: number,
	totalSessions: number
) {
	const weeks = 52
	const days = 7
	const totalCells = weeks * days

	// Fallback for bundles without activeDates
	if (!activeDates?.length) {
		return generateFallbackGrid(daysActive, totalSessions)
	}

	// Build activity map from real dates
	const activityMap = new Map(activeDates.map((d) => [d.date, d.sessions]))
	const maxSessions = Math.max(...activeDates.map((d) => d.sessions), 1)

	// Build grid: week 0 = 51 weeks ago, week 51 = current week
	// Each week column: day 0 = Sunday, day 6 = Saturday
	const today = new Date()
	const grid: number[] = new Array(totalCells).fill(0)

	for (let i = 0; i < totalCells; i++) {
		const date = new Date(today)
		date.setDate(today.getDate() - (totalCells - 1 - i))
		const dateStr = date.toISOString().split('T')[0]
		const sessions = activityMap.get(dateStr) || 0
		if (sessions > 0) {
			// Intensity 1-4 based on relative session count
			grid[i] = Math.ceil((sessions / maxSessions) * 4)
		}
	}

	return { grid, weeks, days }
}

// Fallback for backwards compatibility with old bundles
function generateFallbackGrid(daysActive: number, totalSessions: number, seed: number = 42) {
	const weeks = 52
	const days = 7
	const totalCells = weeks * days

	const seededRandom = (i: number) => {
		const x = Math.sin(seed + i * 9999) * 10000
		return x - Math.floor(x)
	}

	const grid: number[] = new Array(totalCells).fill(0)
	const activeCells = Math.min(daysActive, totalCells)
	const avgSessionsPerDay = totalSessions / Math.max(daysActive, 1)

	let filled = 0
	let attempts = 0
	while (filled < activeCells && attempts < totalCells * 3) {
		const idx = Math.floor(seededRandom(attempts) * totalCells)
		if (grid[idx] === 0) {
			const baseIntensity = Math.min(4, Math.ceil(avgSessionsPerDay / 3))
			const variance = Math.floor(seededRandom(attempts + 1000) * 3) - 1
			grid[idx] = Math.max(1, Math.min(4, baseIntensity + variance))
			filled++
		}
		attempts++
	}

	return { grid, weeks, days }
}

// Intensity to color mapping (GitHub-style, but with sunset palette)
const intensityColors = [
	'rgba(221, 80, 19, 0.1)', // 0 - empty
	'rgba(221, 80, 19, 0.3)', // 1 - light
	'rgba(221, 80, 19, 0.5)', // 2 - medium
	'rgba(221, 80, 19, 0.7)', // 3 - high
	'rgba(221, 80, 19, 0.9)', // 4 - intense
]

export function TimeStory({ data, isActive }: StorySlideProps) {
	const { stats } = data

	// Use real totalMinutes if available, fall back to estimate for old bundles
	const totalMinutes = stats.totalMinutes ?? (stats.totalSessions || 1) * 45
	const totalHours = Math.round(totalMinutes / 60) || 1

	const { grid, weeks, days } = useMemo(
		() => buildContributionGrid(stats.activeDates, stats.daysActive, stats.totalSessions),
		[stats.activeDates, stats.daysActive, stats.totalSessions]
	)

	const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

	// Generate month labels spanning the weeks (12 months for full year)
	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]
	const now = new Date()
	const monthLabels: { name: string; span: number }[] = []

	// Work backwards from current month, ~4-5 weeks per month
	const currentMonth = now.getMonth()
	let weeksRemaining = weeks

	for (let i = 0; i < 12 && weeksRemaining > 0; i++) {
		const monthIdx = (currentMonth - i + 12) % 12
		// Approximate weeks per month (some months have 4, some 5)
		const weeksInThisMonth = Math.min(i === 0 ? 4 : i % 3 === 0 ? 5 : 4, weeksRemaining)
		monthLabels.unshift({ name: monthNames[monthIdx], span: weeksInThisMonth })
		weeksRemaining -= weeksInThisMonth
	}

	// Distribute any remaining weeks to the first month
	if (weeksRemaining > 0 && monthLabels.length > 0) {
		monthLabels[0].span += weeksRemaining
	}

	return (
		<div className="min-h-dvh h-dvh w-full flex flex-col items-center justify-center text-center p-8">
			<motion.div
				className="text-xs font-semibold tracking-widest uppercase text-dark/60"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
			>
				YOUR CODING ADDICTION VISUALIZED
			</motion.div>

			<motion.div
				className="text-7xl font-black text-sunset-accent mt-4"
				initial={{ opacity: 0, scale: 0.9 }}
				animate={isActive ? { opacity: 1, scale: 1 } : {}}
				transition={{ delay: 0.3 }}
			>
				{totalHours}h
			</motion.div>

			<motion.div
				className="text-xl text-dark/70 mt-2"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 0.6 }}
			>
				of your life given to Claude
			</motion.div>

			{/* GitHub-style contribution graph */}
			<motion.div
				className="mt-8"
				initial={{ opacity: 0, y: 20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ delay: 0.9 }}
			>
				{/* Month labels */}
				<div className="flex mb-1" style={{ paddingLeft: 32 }}>
					{monthLabels.map((label, i) => (
						<div
							key={i}
							className="text-[9px] text-dark/50"
							style={{ width: label.span * 15, textAlign: 'left' }}
						>
							{label.name}
						</div>
					))}
				</div>

				<div className="flex gap-[4px]">
					{/* Day labels */}
					<div className="flex flex-col gap-[4px] mr-1 justify-center">
						{dayLabels.map((label, i) => (
							<div
								key={i}
								className="text-[9px] text-dark/50 h-[11px] flex items-center justify-end pr-1"
								style={{ width: 24 }}
							>
								{label}
							</div>
						))}
					</div>

					{/* Grid columns (weeks) */}
					{Array.from({ length: weeks }).map((_, weekIdx) => (
						<div key={weekIdx} className="flex flex-col gap-[4px]">
							{Array.from({ length: days }).map((_, dayIdx) => {
								const cellIdx = weekIdx * days + dayIdx
								const intensity = grid[cellIdx]
								const delay = 0.9 + cellIdx * 0.003

								return (
									<motion.div
										key={dayIdx}
										className="rounded-sm"
										style={{
											width: 11,
											height: 11,
											backgroundColor: intensityColors[intensity],
										}}
										initial={{ opacity: 0, scale: 0 }}
										animate={isActive ? { opacity: 1, scale: 1 } : {}}
										transition={{ delay, duration: 0.2 }}
									/>
								)
							})}
						</div>
					))}
				</div>

				{/* Legend */}
				<motion.div
					className="flex items-center justify-end gap-[4px] mt-3"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2 }}
				>
					<span className="text-[9px] text-dark/50 mr-1">Less</span>
					{intensityColors.map((color, i) => (
						<div
							key={i}
							className="rounded-sm"
							style={{ width: 10, height: 10, backgroundColor: color }}
						/>
					))}
					<span className="text-[9px] text-dark/50 ml-1">More</span>
				</motion.div>
			</motion.div>

			<motion.div
				className="flex gap-12 mt-8"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 2.2 }}
			>
				<div className="text-center">
					<div className="text-2xl font-bold text-sunset-accent">{stats.daysActive}</div>
					<div className="text-xs text-dark/60 mt-1">active days</div>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold text-sunset-accent">{stats.totalSessions}</div>
					<div className="text-xs text-dark/60 mt-1">sessions</div>
				</div>
			</motion.div>
		</div>
	)
}
