import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { StorySlideProps } from '../../data/types'
import { ShareCard } from '../../components/ShareCard'
import { encodeDataForUrl } from '../../data/decoder'

export function ShareStory({ data, isActive }: StorySlideProps) {
	const { persona, stats, funFacts } = data
	const [isGenerating, setIsGenerating] = useState(false)
	const [showPreview, setShowPreview] = useState(false)
	const [showConfetti, setShowConfetti] = useState(false)
	const [copySuccess, setCopySuccess] = useState(false)
	const shareCardRef = useRef<HTMLDivElement>(null)

	const totalTokens = stats.totalTokens.input + stats.totalTokens.output

	// Pick a random fun fact for the card
	const funFact = funFacts && funFacts.length > 0 ? funFacts[0] : null
	const formatNumber = (n: number): string => {
		if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
		if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
		return n.toString()
	}

	// Pre-generate stable random positions for confetti
	const confettiParticles = useMemo(
		() =>
			[...Array(30)].map((_, i) => ({
				color: ['#bdb7fc', '#dd5013', '#da1c1c', '#a05f1a', '#FFF8F0'][i % 5],
				left: Math.random() * 100,
				xStart: (Math.random() - 0.5) * 100,
				xEnd: (Math.random() - 0.5) * 200,
				rotateDir: Math.random() > 0.5 ? 1 : -1,
				duration: 3 + Math.random() * 2,
				delay: Math.random() * 1,
			})),
		[]
	)

	// Trigger confetti on load
	useEffect(() => {
		if (isActive) {
			const timer = setTimeout(() => setShowConfetti(true), 500)
			return () => clearTimeout(timer)
		} else {
			setShowConfetti(false)
		}
	}, [isActive])

	const handleDownloadImage = async () => {
		if (!shareCardRef.current) return

		setIsGenerating(true)
		try {
			// Temporarily make the hidden card visible for rendering
			const cardElement = shareCardRef.current
			const originalStyle = cardElement.style.cssText
			cardElement.style.cssText =
				'position: absolute; left: 0; top: 0; opacity: 1; pointer-events: none;'

			const dataUrl = await toPng(cardElement, {
				quality: 1,
				pixelRatio: 2,
				cacheBust: true,
				backgroundColor: '#FFF8F0',
			})

			// Restore original styling
			cardElement.style.cssText = originalStyle

			const link = document.createElement('a')
			link.download = `vibechecked-${persona.id}.png`
			link.href = dataUrl
			link.click()
		} catch (error) {
			console.error('Failed to generate image:', error)
		} finally {
			setIsGenerating(false)
		}
	}

	const handleShareTwitter = () => {
		const text = `I'm a ${persona.name}! ${persona.tagline}\n\n${formatNumber(totalTokens)} tokens \u2022 ${stats.totalSessions} sessions \u2022 ${stats.projectCount} projects\n\nGet your VibeChecked:`
		const url = `https://howsyourvibecoding.vercel.app/?d=${encodeDataForUrl(data)}`
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
		window.open(twitterUrl, '_blank')
	}

	const handleCopyLink = async () => {
		try {
			const url = `https://howsyourvibecoding.vercel.app/?d=${encodeDataForUrl(data)}`
			await navigator.clipboard.writeText(url)
			setCopySuccess(true)
			setTimeout(() => setCopySuccess(false), 2000)
		} catch (error) {
			console.error('Failed to copy link:', error)
		}
	}

	return (
		<div className="w-full h-full relative overflow-hidden">
			{/* Confetti/celebration particles - warm colors */}
			{showConfetti && (
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					{confettiParticles.map((p, i) => (
						<motion.div
							key={i}
							className="absolute w-2 h-2 rounded-full"
							style={{
								backgroundColor: p.color,
								left: `${p.left}%`,
								top: '-5%',
							}}
							animate={{
								y: ['0vh', '110vh'],
								x: [p.xStart, p.xEnd],
								rotate: [0, 360 * p.rotateDir],
								opacity: [1, 1, 0],
							}}
							transition={{
								duration: p.duration,
								delay: p.delay,
								ease: 'linear',
							}}
						/>
					))}
				</div>
			)}

			<div className="min-h-dvh h-dvh w-full p-[clamp(2rem,5vw,4rem)] pb-[clamp(5rem,10vw,7rem)] pt-[clamp(3rem,7vw,5.5rem)] flex flex-col items-center justify-center text-center gap-[clamp(0.75rem,2.5vw,1.75rem)] max-w-6xl mx-auto overflow-y-auto relative z-10">
				{/* Title */}
				<motion.div
					className="text-center mb-4"
					initial={{ opacity: 0, y: -20 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
				>
					<h2 className="text-2xl font-bold text-dark mb-1">Share Your Shame</h2>
					<p className="leading-[1.65] text-dark/80 text-sm">
						Let the world judge your coding habits
					</p>
				</motion.div>

				{/* Larger card preview - warm styling with border and shadow */}
				<motion.div
					className="bg-cream/80 backdrop-blur-xl rounded-2xl p-5 w-full max-w-sm mb-4 cursor-pointer border-2 border-dark/15 shadow-lg shadow-dark/10"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={isActive ? { opacity: 1, scale: 1 } : {}}
					transition={{ delay: 0.2 }}
					onClick={() => setShowPreview(true)}
					whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
					whileTap={{ scale: 0.98 }}
				>
					<div className="flex items-center gap-4 mb-4">
						<span className="text-5xl">{persona.icon}</span>
						<div>
							<div className="text-dark font-bold text-xl">{persona.name}</div>
							<div className="text-dark/60 text-sm">{persona.tagline}</div>
							{funFact && <div className="text-sunset-accent text-xs mt-1 italic">{funFact}</div>}
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4 text-center">
						<div>
							<div className="text-dark font-bold text-xl">{formatNumber(totalTokens)}</div>
							<div className="text-dark/70 text-xs">tokens</div>
						</div>
						<div>
							<div className="text-dark font-bold text-xl">{stats.totalSessions}</div>
							<div className="text-dark/70 text-xs">sessions</div>
						</div>
						<div>
							<div className="text-dark font-bold text-xl">{stats.projectCount}</div>
							<div className="text-dark/70 text-xs">projects</div>
						</div>
					</div>

					{/* Customize hint */}
					<div className="mt-4 text-center">
						<span className="text-dark/60 text-xs">Tap to preview full card</span>
					</div>
				</motion.div>

				{/* Share buttons - warm styling */}
				<motion.div
					className="flex flex-col gap-3 w-full max-w-sm"
					initial={{ opacity: 0, y: 20 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.4 }}
				>
					<button
						onClick={handleDownloadImage}
						disabled={isGenerating}
						className="flex items-center justify-center gap-3 bg-dark text-cream font-semibold py-3.5 px-6 rounded-full border border-dark/20 transition-all duration-150 cursor-pointer hover:scale-[1.03] hover:bg-dark/85 active:scale-[0.98] hover:shadow-lg disabled:opacity-50 shadow-lg shadow-dark/10"
					>
						{isGenerating ? (
							<>
								<svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									/>
								</svg>
								<span>Generating...</span>
							</>
						) : (
							<>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								<span>Download Image</span>
							</>
						)}
					</button>

					<button
						onClick={handleShareTwitter}
						className="flex items-center justify-center gap-3 bg-dark/10 text-dark font-semibold py-3.5 px-6 rounded-full border border-dark/20 transition-all duration-150 cursor-pointer hover:scale-[1.03] hover:bg-dark/25 active:scale-[0.98] hover:shadow-lg"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
						</svg>
						<span>Share on X</span>
					</button>

					<button
						onClick={handleCopyLink}
						className={`flex items-center justify-center gap-3 font-semibold py-3.5 px-6 rounded-full border transition-all duration-150 cursor-pointer hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg ${
							copySuccess
								? 'bg-green-500/20 text-green-700 border-green-500/30'
								: 'bg-dark/10 text-dark border-dark/20 hover:bg-dark/25'
						}`}
					>
						{copySuccess ? (
							<>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span>Copied!</span>
							</>
						) : (
							<>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
								<span>Copy Link</span>
							</>
						)}
					</button>
				</motion.div>
			</div>

			{/* Footer */}
			<motion.div
				className="absolute bottom-6 left-0 right-0 text-dark/60 text-xs text-center"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 0.8 }}
			>
				<p>Made with Claude</p>
				<p className="mt-0.5">howsyourvibecoding.vercel.app</p>
			</motion.div>

			{/* Hidden share card for export - using opacity instead of off-screen for better rendering */}
			<div className="fixed left-0 top-0 opacity-0 pointer-events-none" style={{ zIndex: -1 }}>
				<ShareCard ref={shareCardRef} data={data} />
			</div>

			{/* Preview modal */}
			{showPreview && (
				<motion.div
					className="fixed inset-0 bg-dark/90 z-50 flex items-center justify-center p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					onClick={() => setShowPreview(false)}
				>
					<motion.div
						className="max-w-md w-full flex flex-col items-center"
						initial={{ scale: 0.9, y: 20 }}
						animate={{ scale: 1, y: 0 }}
						onClick={(e) => e.stopPropagation()}
					>
						<ShareCard data={data} />
						<button
							onClick={() => setShowPreview(false)}
							className="mt-4 text-cream/80 hover:text-cream text-sm text-center w-full transition-colors"
						>
							Click anywhere to close
						</button>
					</motion.div>
				</motion.div>
			)}
		</div>
	)
}
