import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

export function LandingPage() {
	const [copied, setCopied] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const mouseX = useMotionValue(50)
	const mouseY = useMotionValue(50)

	const springConfig = { damping: 30, stiffness: 150 }
	const x = useSpring(mouseX, springConfig)
	const y = useSpring(mouseY, springConfig)

	// Sunset theme color
	const sunsetColor = '#dd5013'

	// Create motion template for reactive gradient
	const outerGlowGradient = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, rgba(221, 80, 19, 0.7) 0%, rgba(221, 80, 19, 0.3) 50%, transparent 100%)`

	const installCommand = 'curl -fsSL https://howsyourvibecoding.vercel.app/install.sh | bash'

	const handleCopy = async () => {
		await navigator.clipboard.writeText(installCommand)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	// Track mouse movement for interactive effects
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect()
				const x = ((e.clientX - rect.left) / rect.width) * 100
				const y = ((e.clientY - rect.top) / rect.height) * 100
				mouseX.set(x)
				mouseY.set(y)
			}
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [mouseX, mouseY])

	return (
		<div
			className="min-h-screen text-[#3b110c] overflow-hidden"
			style={{
				background: 'linear-gradient(135deg, #FFF8F0 0%, #FFCBA4 50%, #FFB08A 100%)',
			}}
		>
			<div className="min-h-screen flex">
				{/* Left 2/3 - Dynamic Orb Animation */}
				<div
					ref={containerRef}
					className="w-2/3 flex items-center justify-center p-8 relative overflow-hidden"
				>
					{/* Claude Code Icon Animation */}
					<motion.div
						className="relative flex items-center justify-center"
						style={{
							width: 400,
							height: 400,
						}}
					>
						{/* Outer glow layer */}
						<motion.div
							className="absolute blur-[100px]"
							style={{
								width: 350,
								height: 250,
								background: outerGlowGradient,
								borderRadius: '30%',
							}}
							animate={{
								scale: [1, 1.3, 0.9, 1.2, 1],
								opacity: [0.6, 0.85, 0.5, 0.75, 0.6],
							}}
							transition={{
								duration: 7,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						/>

						{/* 3D Chill Vibes Container */}
						<motion.div
							className="relative z-10 select-none blur-[12px]"
							style={{
								perspective: 800,
								transformStyle: 'preserve-3d',
								x: useTransform(x, [0, 100], [-20, 20]),
								y: useTransform(y, [0, 100], [-20, 20]),
							}}
							animate={{
								rotateY: [0, 8, -8, 5, -5, 0],
								rotateX: [0, -4, 3, -3, 4, 0],
								y: [0, -8, 0, -6, 0, -10, 0],
								scale: [1, 1.03, 0.98, 1.02, 0.99, 1.04, 1],
								filter: ['blur(12px)', 'blur(10px)', 'blur(14px)', 'blur(11px)', 'blur(12px)'],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
						>
							{/* Main body - top portion (head) */}
							<motion.div
								className="relative"
								style={{
									width: 320,
									height: 110,
									background: sunsetColor,
									borderRadius: '55px 60px 16px 20px',
									marginLeft: 45,
									transformOrigin: 'center bottom',
								}}
								animate={{
									opacity: [0.85, 1, 0.9, 0.95, 0.85],
									rotate: [-1, 2, -1, 2, -1],
									scaleY: [1, 0.98, 1.02, 0.99, 1],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							>
								{/* Eye - left */}
								<motion.div
									className="absolute rounded-full"
									style={{
										width: 36,
										height: 40,
										background: '#FFF8F0',
										top: 30,
										left: 70,
									}}
									animate={{
										opacity: [0.7, 0.9, 0.75, 0.85, 0.7],
										scale: [1, 1.08, 0.95, 1.05, 1],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: 'easeInOut',
									}}
								/>
								{/* Eye - right */}
								<motion.div
									className="absolute rounded-full"
									style={{
										width: 34,
										height: 37,
										background: '#FFF8F0',
										top: 33,
										right: 75,
									}}
									animate={{
										opacity: [0.75, 0.85, 0.7, 0.9, 0.75],
										scale: [1, 0.95, 1.08, 0.97, 1],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: 'easeInOut',
										delay: 0.5,
									}}
								/>
							</motion.div>

							{/* Main body - bottom portion (torso, wider) */}
							<motion.div
								className="relative"
								style={{
									width: 380,
									height: 95,
									background: sunsetColor,
									borderRadius: '20px 14px 70px 60px',
									marginTop: -14,
									marginLeft: 10,
									transformOrigin: 'center center',
								}}
								animate={{
									opacity: [0.9, 0.95, 1, 0.95, 0.9],
									scaleX: [1, 1.02, 0.98, 1.01, 1],
									scaleY: [1, 0.98, 1.02, 0.99, 1],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							/>

							{/* Arm - left - gentle sway */}
							<motion.div
								className="absolute"
								style={{
									width: 55,
									height: 75,
									background: sunsetColor,
									borderRadius: '28px 18px 30px 38px',
									top: 72,
									left: -30,
									transformOrigin: 'right top',
								}}
								animate={{
									rotate: [-8, 15, -5, 20, -10, 12, -8],
									x: [0, 5, -3, 8, -2, 4, 0],
									y: [0, -8, 2, -12, 0, -6, 0],
									opacity: [0.8, 0.95, 0.85, 1, 0.9, 0.95, 0.8],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							/>

							{/* Arm - right - gentle sway */}
							<motion.div
								className="absolute"
								style={{
									width: 50,
									height: 68,
									background: sunsetColor,
									borderRadius: '16px 30px 32px 24px',
									top: 78,
									right: -22,
									transformOrigin: 'left top',
								}}
								animate={{
									rotate: [8, -18, 5, -22, 10, -15, 8],
									x: [0, -6, 3, -10, 2, -5, 0],
									y: [0, -10, 3, -15, 0, -8, 0],
									opacity: [0.85, 1, 0.9, 0.95, 0.85, 1, 0.85],
								}}
								transition={{
									duration: 3.5,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: 0.3,
								}}
							/>

							{/* Foot - left - gentle tap */}
							<motion.div
								className="absolute"
								style={{
									width: 65,
									height: 45,
									background: sunsetColor,
									borderRadius: '12px 16px 28px 32px',
									bottom: -40,
									left: 55,
									transformOrigin: 'center top',
								}}
								animate={{
									rotate: [-2, 4, -1, 5, -3, 3, -2],
									y: [0, 3, -1, 4, 0, 2, 0],
									opacity: [0.75, 0.9, 0.8, 0.95, 0.85, 0.9, 0.75],
								}}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							/>

							{/* Foot - right - gentle tap */}
							<motion.div
								className="absolute"
								style={{
									width: 70,
									height: 42,
									background: sunsetColor,
									borderRadius: '18px 12px 34px 26px',
									bottom: -38,
									right: 50,
									transformOrigin: 'center top',
								}}
								animate={{
									rotate: [2, -5, 1, -4, 3, -2, 2],
									y: [0, 4, -1, 5, 0, 3, 0],
									opacity: [0.8, 0.95, 0.85, 0.9, 0.8, 0.95, 0.8],
								}}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									ease: 'easeInOut',
									delay: 0.4,
								}}
							/>
						</motion.div>

						{/* Floating particles around the icon */}
						{[...Array(6)].map((_, i) => {
							const angle = (i * 360) / 6
							const radius = 140
							const particleX = Math.cos((angle * Math.PI) / 180) * radius
							const particleY = Math.sin((angle * Math.PI) / 180) * radius

							return (
								<motion.div
									key={i}
									className="absolute rounded-full blur-2xl"
									style={{
										width: 50 + (i % 3) * 15,
										height: 50 + (i % 3) * 15,
										background: `rgba(221, 80, 19, ${0.4 + (i % 3) * 0.1})`,
										left: '50%',
										top: '50%',
									}}
									animate={{
										x: [
											particleX - 25,
											particleX + 15,
											particleX - 20,
											particleX + 10,
											particleX - 25,
										],
										y: [
											particleY - 15,
											particleY + 20,
											particleY - 10,
											particleY + 15,
											particleY - 15,
										],
										scale: [0.7, 1.2, 0.8, 1.1, 0.7],
										opacity: [0.4, 0.7, 0.5, 0.65, 0.4],
									}}
									transition={{
										duration: 5 + i * 0.4,
										repeat: Infinity,
										ease: 'easeInOut',
										delay: i * 0.25,
									}}
								/>
							)
						})}
					</motion.div>
				</div>

				{/* Right 1/3 - Content */}
				<div className="w-1/3 flex flex-col justify-center items-end pl-8 pr-20 py-12 text-right">
					<p className="text-[clamp(1rem,2vw,1.25rem)] mb-10 text-[#3b110c] leading-relaxed">
						You've been vibe coding.
						<br />
						Claude Code's been watching.
					</p>

					<div className="mb-10">
						<p className="text-sm uppercase tracking-widest mb-4 text-[#3b110c]/70">
							Get Your Vibe Check
						</p>
						<div
							className="rounded-2xl p-6 bg-[#3b110c]/10 border border-[#3b110c]/10 cursor-pointer hover:bg-[#3b110c]/15 transition-colors"
							onClick={handleCopy}
						>
							<div className="flex items-start gap-3">
								<code className="font-mono flex-1 text-[clamp(10px,1.5vw,13px)] break-all text-right text-[#3b110c]/90 pr-2">
									{installCommand}
								</code>
								<button
									onClick={(e) => {
										e.stopPropagation()
										handleCopy()
									}}
									className="flex-shrink-0 p-2 rounded-lg bg-[#3b110c]/10 hover:bg-[#3b110c]/20 transition-colors cursor-pointer border border-[#3b110c]/20"
									aria-label="Copy to clipboard"
								>
									{copied ? (
										<svg
											className="w-5 h-5 text-[#3b110c]"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									) : (
										<svg
											className="w-5 h-5 text-[#3b110c]"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
