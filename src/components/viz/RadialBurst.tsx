import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface RadialBurstProps {
	count: number
	color?: string
	secondaryColor?: string
	size?: number
	animate?: boolean
	delay?: number
	rings?: number
	maxDots?: number
}

export function RadialBurst({
	count,
	color = '#dd5013',
	secondaryColor,
	size = 300,
	animate = true,
	delay = 0,
	rings = 4,
	maxDots = 100,
}: RadialBurstProps) {
	const displayCount = Math.min(count, maxDots)

	const dots = useMemo(() => {
		const result: Array<{
			x: number
			y: number
			size: number
			ring: number
			angle: number
			delay: number
			opacity: number
		}> = []

		const center = size / 2
		let dotsPlaced = 0

		for (let ring = 0; ring < rings && dotsPlaced < displayCount; ring++) {
			const ringRadius = (ring + 1) * (size / (rings * 2 + 1))
			const dotsInRing = Math.min(Math.floor((ring + 1) * 8), displayCount - dotsPlaced)

			for (let i = 0; i < dotsInRing && dotsPlaced < displayCount; i++) {
				const angle = (i / dotsInRing) * Math.PI * 2 + ring * 0.2
				const jitter = (Math.random() - 0.5) * 10

				result.push({
					x: center + Math.cos(angle) * (ringRadius + jitter),
					y: center + Math.sin(angle) * (ringRadius + jitter),
					size: 3 + Math.random() * 4,
					ring,
					angle,
					delay: ring * 0.1 + i * 0.02,
					opacity: 0.6 + Math.random() * 0.4,
				})

				dotsPlaced++
			}
		}

		return result
	}, [displayCount, size, rings])

	return (
		<div className="relative" style={{ width: size, height: size }}>
			{/* Ring guides (subtle) */}
			<svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full">
				{Array.from({ length: rings }).map((_, ring) => (
					<motion.circle
						key={ring}
						cx={size / 2}
						cy={size / 2}
						r={(ring + 1) * (size / (rings * 2 + 1))}
						fill="none"
						stroke="rgba(59, 17, 12, 0.05)"
						strokeWidth={1}
						initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: delay + ring * 0.1, duration: 0.5 }}
					/>
				))}
			</svg>

			{/* Dots */}
			{dots.map((dot, index) => (
				<motion.div
					key={index}
					className="absolute rounded-full"
					style={{
						left: dot.x - dot.size / 2,
						top: dot.y - dot.size / 2,
						width: dot.size,
						height: dot.size,
						background: secondaryColor
							? `linear-gradient(135deg, ${color}, ${secondaryColor})`
							: color,
						boxShadow: `0 0 ${dot.size * 2}px ${color}40`,
					}}
					initial={animate ? { opacity: 0, scale: 0 } : undefined}
					animate={{ opacity: dot.opacity, scale: 1 }}
					transition={{
						delay: delay + dot.delay,
						duration: 0.4,
						ease: 'easeOut',
					}}
				/>
			))}

			{/* Center glow */}
			<motion.div
				className="absolute rounded-full"
				style={{
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					width: 40,
					height: 40,
					background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
				}}
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.5, 0.8, 0.5],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>
		</div>
	)
}

// Pulsing ring burst effect
interface PulseRingsProps {
	color?: string
	size?: number
	rings?: number
}

export function PulseRings({ color = '#bdb7fc', size = 200, rings = 3 }: PulseRingsProps) {
	return (
		<div className="relative" style={{ width: size, height: size }}>
			{Array.from({ length: rings }).map((_, i) => (
				<motion.div
					key={i}
					className="absolute inset-0 rounded-full border-2"
					style={{
						borderColor: color,
					}}
					animate={{
						scale: [0.8, 1.4],
						opacity: [0.6, 0],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						delay: i * 0.5,
						ease: 'easeOut',
					}}
				/>
			))}
		</div>
	)
}
