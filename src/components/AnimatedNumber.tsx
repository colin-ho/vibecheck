import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedNumberProps {
	value: number
	duration?: number
	delay?: number
	className?: string
	format?: (n: number) => string
}

export function AnimatedNumber({
	value,
	duration = 1.5,
	delay = 0,
	className = '',
	format = (n) => n.toLocaleString(),
}: AnimatedNumberProps) {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), delay * 1000)
		return () => clearTimeout(timer)
	}, [delay])

	const spring = useSpring(0, {
		duration: duration * 1000,
		bounce: 0,
	})

	const display = useTransform(spring, (current) => format(Math.round(current)))

	useEffect(() => {
		if (isVisible) {
			spring.set(value)
		}
	}, [isVisible, value, spring])

	return <motion.span className={className}>{display}</motion.span>
}

interface AnimatedPercentageProps {
	value: number
	duration?: number
	delay?: number
	className?: string
}

export function AnimatedPercentage({
	value,
	duration = 1.5,
	delay = 0,
	className = '',
}: AnimatedPercentageProps) {
	return (
		<AnimatedNumber
			value={value}
			duration={duration}
			delay={delay}
			className={className}
			format={(n) => `${Math.round(n)}%`}
		/>
	)
}

interface CountUpProps {
	end: number
	suffix?: string
	prefix?: string
	decimals?: number
	className?: string
	duration?: number
}

export function CountUp({
	end,
	suffix = '',
	prefix = '',
	decimals = 0,
	className = '',
	duration = 2,
}: CountUpProps) {
	// Ensure end is a valid number
	const targetValue = typeof end === 'number' && !isNaN(end) ? end : 0
	const [count, setCount] = useState(0)

	useEffect(() => {
		// Skip animation if target is 0
		if (targetValue === 0) {
			setCount(0)
			return
		}

		let startTime: number
		let animationFrame: number

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp
			const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

			// Easing function (ease-out cubic)
			const eased = 1 - Math.pow(1 - progress, 3)
			setCount(eased * targetValue)

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate)
			}
		}

		animationFrame = requestAnimationFrame(animate)
		return () => cancelAnimationFrame(animationFrame)
	}, [targetValue, duration])

	const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString()

	return (
		<span className={className}>
			{prefix}
			{formatted}
			{suffix}
		</span>
	)
}
