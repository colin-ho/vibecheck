import { motion } from 'framer-motion'

interface ArcPairProps {
	leftValue: number
	rightValue: number
	leftColor?: string
	rightColor?: string
	leftLabel?: string
	rightLabel?: string
	size?: number
	strokeWidth?: number
	animate?: boolean
	delay?: number
	leftGradient?: [string, string]
	rightGradient?: [string, string]
}

export function ArcPair({
	leftValue,
	rightValue,
	leftColor = '#dd5013',
	rightColor = '#bdb7fc',
	leftLabel,
	rightLabel,
	size = 240,
	strokeWidth = 16,
	animate = true,
	delay = 0,
	leftGradient,
	rightGradient,
}: ArcPairProps) {
	const total = leftValue + rightValue
	const leftPercentage = (leftValue / total) * 100
	const rightPercentage = (rightValue / total) * 100

	const radius = (size - strokeWidth) / 2
	const circumference = Math.PI * radius // Half circle

	const leftArcLength = (leftPercentage / 100) * circumference
	const rightArcLength = (rightPercentage / 100) * circumference

	const formatNumber = (n: number): string => {
		if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
		if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
		return n.toString()
	}

	return (
		<div className="relative" style={{ width: size, height: size / 2 + 60 }}>
			<svg
				viewBox={`0 0 ${size} ${size / 2 + 20}`}
				className="w-full"
				style={{ height: size / 2 + 20 }}
			>
				<defs>
					{leftGradient && (
						<linearGradient id="leftArcGradient" x1="0%" y1="100%" x2="100%" y2="100%">
							<stop offset="0%" stopColor={leftGradient[0]} />
							<stop offset="100%" stopColor={leftGradient[1]} />
						</linearGradient>
					)}
					{rightGradient && (
						<linearGradient id="rightArcGradient" x1="0%" y1="100%" x2="100%" y2="100%">
							<stop offset="0%" stopColor={rightGradient[0]} />
							<stop offset="100%" stopColor={rightGradient[1]} />
						</linearGradient>
					)}
				</defs>

				{/* Background arc */}
				<path
					d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
					fill="none"
					stroke="rgba(59, 17, 12, 0.08)"
					strokeWidth={strokeWidth}
				/>

				{/* Left arc (from left to center) */}
				<motion.path
					d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size / 2} ${strokeWidth / 2}`}
					fill="none"
					stroke={leftGradient ? 'url(#leftArcGradient)' : leftColor}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circumference / 2}
					initial={animate ? { strokeDashoffset: circumference / 2 } : undefined}
					animate={{ strokeDashoffset: circumference / 2 - leftArcLength / 2 }}
					transition={{
						delay,
						duration: 1.2,
						ease: 'easeOut',
					}}
					style={{
						filter: `drop-shadow(0 0 10px ${leftColor}60)`,
					}}
				/>

				{/* Right arc (from right to center) */}
				<motion.path
					d={`M ${size - strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 0 ${size / 2} ${strokeWidth / 2}`}
					fill="none"
					stroke={rightGradient ? 'url(#rightArcGradient)' : rightColor}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circumference / 2}
					initial={animate ? { strokeDashoffset: circumference / 2 } : undefined}
					animate={{ strokeDashoffset: circumference / 2 - rightArcLength / 2 }}
					transition={{
						delay: delay + 0.2,
						duration: 1.2,
						ease: 'easeOut',
					}}
					style={{
						filter: `drop-shadow(0 0 10px ${rightColor}60)`,
					}}
				/>
			</svg>

			{/* Labels and values */}
			<div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
				<motion.div
					className="text-center"
					initial={animate ? { opacity: 0, y: 10 } : undefined}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: delay + 0.8 }}
				>
					<div className="text-2xl font-bold" style={{ color: leftColor }}>
						{formatNumber(leftValue)}
					</div>
					{leftLabel && (
						<div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-cocoa/60 mt-1">
							{leftLabel}
						</div>
					)}
				</motion.div>

				<motion.div
					className="text-center"
					initial={animate ? { opacity: 0, y: 10 } : undefined}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: delay + 1 }}
				>
					<div className="text-2xl font-bold" style={{ color: rightColor }}>
						{formatNumber(rightValue)}
					</div>
					{rightLabel && (
						<div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-cocoa/60 mt-1">
							{rightLabel}
						</div>
					)}
				</motion.div>
			</div>
		</div>
	)
}

// Dual arc variant - two complete arcs side by side
interface DualArcProps {
	leftValue: number
	leftMax: number
	rightValue: number
	rightMax: number
	leftColor?: string
	rightColor?: string
	leftLabel?: string
	rightLabel?: string
	size?: number
	strokeWidth?: number
	animate?: boolean
	delay?: number
}

export function DualArc({
	leftValue,
	leftMax,
	rightValue,
	rightMax,
	leftColor = '#dd5013',
	rightColor = '#bdb7fc',
	leftLabel,
	rightLabel,
	size = 120,
	strokeWidth = 10,
	animate = true,
	delay = 0,
}: DualArcProps) {
	const radius = (size - strokeWidth) / 2
	const circumference = 2 * Math.PI * radius

	const leftPercentage = (leftValue / leftMax) * 100
	const rightPercentage = (rightValue / rightMax) * 100

	return (
		<div className="flex gap-8 items-center">
			{/* Left arc */}
			<div className="relative" style={{ width: size, height: size }}>
				<svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="rgba(59, 17, 12, 0.1)"
						strokeWidth={strokeWidth}
					/>
					<motion.circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={leftColor}
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						strokeDasharray={circumference}
						initial={animate ? { strokeDashoffset: circumference } : undefined}
						animate={{ strokeDashoffset: circumference - (leftPercentage / 100) * circumference }}
						transition={{ delay, duration: 1.2, ease: 'easeOut' }}
						style={{ filter: `drop-shadow(0 0 8px ${leftColor}60)` }}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<div className="text-xl font-bold text-dark">{Math.round(leftPercentage)}%</div>
					{leftLabel && <div className="text-xs text-dark/50">{leftLabel}</div>}
				</div>
			</div>

			{/* Right arc */}
			<div className="relative" style={{ width: size, height: size }}>
				<svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="rgba(59, 17, 12, 0.1)"
						strokeWidth={strokeWidth}
					/>
					<motion.circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={rightColor}
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						strokeDasharray={circumference}
						initial={animate ? { strokeDashoffset: circumference } : undefined}
						animate={{ strokeDashoffset: circumference - (rightPercentage / 100) * circumference }}
						transition={{ delay: delay + 0.2, duration: 1.2, ease: 'easeOut' }}
						style={{ filter: `drop-shadow(0 0 8px ${rightColor}60)` }}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<div className="text-xl font-bold text-dark">{Math.round(rightPercentage)}%</div>
					{rightLabel && <div className="text-xs text-dark/50">{rightLabel}</div>}
				</div>
			</div>
		</div>
	)
}
