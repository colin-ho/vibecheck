import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface WordItem {
	word: string
	count: number
}

interface SpiralCloudProps {
	words: WordItem[]
	size?: number
	rotate?: boolean
	animate?: boolean
	delay?: number
	maxWords?: number
	colors?: string[]
}

export function SpiralCloud({
	words,
	size = 300,
	rotate = false,
	animate = true,
	delay = 0,
	maxWords = 15,
	colors = ['#bdb7fc', '#dd5013', '#da1c1c', '#a05f1a', '#8b372b'],
}: SpiralCloudProps) {
	const sortedWords = [...words].sort((a, b) => b.count - a.count).slice(0, maxWords)
	const maxCount = sortedWords[0]?.count || 1

	const positions = useMemo(() => {
		const result: Array<{
			x: number
			y: number
			fontSize: number
			color: string
		}> = []

		const center = size / 2
		const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // ~137.5 degrees

		sortedWords.forEach((word, index) => {
			// Spiral positioning using golden angle
			const angle = index * goldenAngle
			const radius = Math.sqrt(index) * (size / 8)

			// Size based on count (larger = more frequent)
			const normalizedCount = word.count / maxCount
			const fontSize = 12 + normalizedCount * 28

			result.push({
				x: center + Math.cos(angle) * Math.min(radius, size / 2 - 40),
				y: center + Math.sin(angle) * Math.min(radius, size / 2 - 40),
				fontSize,
				color: colors[index % colors.length],
			})
		})

		return result
	}, [sortedWords, size, maxCount, colors])

	return (
		<motion.div
			className="relative"
			style={{ width: size, height: size }}
			animate={rotate ? { rotate: 360 } : undefined}
			transition={rotate ? { duration: 60, repeat: Infinity, ease: 'linear' } : undefined}
		>
			{/* Skip index 0 since top word is rendered separately in center */}
			{sortedWords.slice(1).map((word, index) => {
				const pos = positions[index + 1]
				return (
					<motion.div
						key={word.word}
						className="absolute font-bold whitespace-nowrap"
						style={{
							left: pos.x,
							top: pos.y,
							fontSize: pos.fontSize,
							color: pos.color,
							transform: 'translate(-50%, -50%)',
							textShadow: `0 0 ${pos.fontSize / 2}px ${pos.color}40`,
						}}
						initial={animate ? { opacity: 0, scale: 0 } : undefined}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							delay: delay + index * 0.08,
							duration: 0.4,
							type: 'spring',
							stiffness: 200,
						}}
					>
						{word.word}
					</motion.div>
				)
			})}

			{/* Top word in center with emphasis */}
			{sortedWords[0] && (
				<motion.div
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
					initial={animate ? { opacity: 0, scale: 0.5 } : undefined}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: delay + 0.5, duration: 0.6, type: 'spring' }}
				>
					<div
						className="font-black [text-shadow:0_0_10px_rgba(189,183,252,0.6),0_0_20px_rgba(189,183,252,0.4),0_0_40px_rgba(189,183,252,0.2)]"
						style={{
							fontSize: 48,
							color: colors[0],
						}}
					>
						{sortedWords[0].word}
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}

// Simpler horizontal word cloud
interface WordCloudRowProps {
	words: WordItem[]
	animate?: boolean
	delay?: number
	colors?: string[]
}

export function WordCloudRow({
	words,
	animate = true,
	delay = 0,
	colors = ['#bdb7fc', '#dd5013', '#da1c1c', '#a05f1a', '#8b372b'],
}: WordCloudRowProps) {
	const sortedWords = [...words].sort((a, b) => b.count - a.count).slice(0, 10)
	const maxCount = sortedWords[0]?.count || 1

	return (
		<div className="flex flex-wrap justify-center items-center gap-3 max-w-2xl">
			{sortedWords.map((word, index) => {
				const normalizedCount = word.count / maxCount
				const fontSize = 14 + normalizedCount * 24
				const color = colors[index % colors.length]

				return (
					<motion.span
						key={word.word}
						className="font-bold"
						style={{
							fontSize,
							color,
							textShadow: index < 3 ? `0 0 10px ${color}40` : undefined,
						}}
						initial={animate ? { opacity: 0, scale: 0.5, y: 10 } : undefined}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{
							delay: delay + index * 0.1,
							type: 'spring',
							stiffness: 200,
						}}
					>
						{word.word}
					</motion.span>
				)
			})}
		</div>
	)
}
