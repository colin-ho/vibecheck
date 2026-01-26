import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { UsageData, StorySlideProps } from '../data/types'

import { IntroStory } from './slides/IntroStory'
import { OpeningMemoryStory } from './slides/OpeningMemoryStory'
import { SessionsStory } from './slides/SessionsStory'
import { TimeStory } from './slides/TimeStory'
import { TokensStory } from './slides/TokensStory'
import { CacheStory } from './slides/CacheStory'
import { ToolsStory } from './slides/ToolsStory'
import { TimingStory } from './slides/TimingStory'
import { ModelsStory } from './slides/ModelsStory'
import { ProjectsStory } from './slides/ProjectsStory'
import { WordCloudStory } from './slides/WordCloudStory'
import { ObsessionsStory } from './slides/ObsessionsStory'
import { QuirksStory } from './slides/QuirksStory'
import { PersonaStory } from './slides/PersonaStory'
import { ShareStory } from './slides/ShareStory'

interface StoryContainerProps {
	data: UsageData
}

const slides: React.ComponentType<StorySlideProps>[] = [
	IntroStory,
	SessionsStory,
	TimeStory,
	OpeningMemoryStory,
	TokensStory,
	CacheStory,
	ToolsStory,
	TimingStory,
	ModelsStory,
	ProjectsStory,
	WordCloudStory,
	ObsessionsStory,
	QuirksStory,
	PersonaStory,
	ShareStory,
]

export function StoryContainer({ data }: StoryContainerProps) {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [direction, setDirection] = useState(1)

	const goToNext = useCallback(() => {
		if (currentSlide < slides.length - 1) {
			setDirection(1)
			setCurrentSlide((prev) => prev + 1)
		}
	}, [currentSlide])

	const goToPrevious = useCallback(() => {
		if (currentSlide > 0) {
			setDirection(-1)
			setCurrentSlide((prev) => prev - 1)
		}
	}, [currentSlide])

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
				e.preventDefault()
				goToNext()
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault()
				goToPrevious()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [goToNext, goToPrevious])

	// Touch/swipe navigation
	useEffect(() => {
		let touchStartX = 0
		let touchEndX = 0

		const handleTouchStart = (e: TouchEvent) => {
			touchStartX = e.touches[0].clientX
		}

		const handleTouchEnd = (e: TouchEvent) => {
			touchEndX = e.changedTouches[0].clientX
			const diff = touchStartX - touchEndX

			if (Math.abs(diff) > 50) {
				if (diff > 0) {
					goToNext()
				} else {
					goToPrevious()
				}
			}
		}

		window.addEventListener('touchstart', handleTouchStart)
		window.addEventListener('touchend', handleTouchEnd)

		return () => {
			window.removeEventListener('touchstart', handleTouchStart)
			window.removeEventListener('touchend', handleTouchEnd)
		}
	}, [goToNext, goToPrevious])

	const CurrentSlideComponent = slides[currentSlide]
	const progress = ((currentSlide + 1) / slides.length) * 100

	// Enhanced slide variants with blur transition
	const slideVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? '100%' : '-100%',
			opacity: 0,
			filter: 'blur(8px)',
			scale: 0.95,
		}),
		center: {
			x: 0,
			opacity: 1,
			filter: 'blur(0px)',
			scale: 1,
		},
		exit: (direction: number) => ({
			x: direction > 0 ? '-50%' : '50%',
			opacity: 0,
			filter: 'blur(8px)',
			scale: 0.9,
		}),
	}

	return (
		<div
			className="relative w-full h-full overflow-hidden"
			style={{
				background: 'linear-gradient(135deg, #FFF8F0 0%, #FFCBA4 50%, #FFB08A 100%)',
			}}
		>
			{/* Progress bar - refined */}
			<div className="absolute top-0 left-0 right-0 z-50 h-1 bg-dark/5">
				<motion.div
					className="h-full bg-gradient-to-r from-lavender via-sunset-accent to-brand-red"
					initial={{ width: 0 }}
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.3, ease: 'easeOut' }}
					style={{
						boxShadow: '0 0 10px rgba(221, 80, 19, 0.5)',
					}}
				/>
			</div>

			{/* Slide counter */}
			<div
				className="absolute z-50 text-dark/60 text-xs font-mono bg-white/40 backdrop-blur-sm px-2 py-1 rounded-full"
				style={{ top: 24, right: 24 }}
			>
				{currentSlide + 1} / {slides.length}
			</div>

			{/* Navigation hints - hidden on last slide to avoid overlapping footer */}
			{currentSlide < slides.length - 1 && (
				<div
					className="absolute left-1/2 -translate-x-1/2 z-50 text-dark/70 text-xs bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
					style={{ bottom: 24 }}
				>
					<span>
						Tap or press <span className="text-dark">→</span> to continue
					</span>
				</div>
			)}

			{/* Navigation arrows */}
			{currentSlide > 0 && (
				<button
					onClick={goToPrevious}
					className="absolute top-1/2 -translate-y-1/2 z-50 p-2 text-dark/50 hover:text-dark/80 transition-colors bg-white/40 backdrop-blur-sm rounded-full"
					style={{ left: 16 }}
					aria-label="Previous slide"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			)}

			{currentSlide < slides.length - 1 && (
				<button
					onClick={goToNext}
					className="absolute top-1/2 -translate-y-1/2 z-50 p-2 text-dark/50 hover:text-dark/80 transition-colors bg-white/40 backdrop-blur-sm rounded-full"
					style={{ right: 16 }}
					aria-label="Next slide"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</button>
			)}

			{/* Slide content with enhanced transitions */}
			<AnimatePresence mode="wait" custom={direction}>
				<motion.div
					key={currentSlide}
					custom={direction}
					variants={slideVariants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{
						x: { type: 'spring', stiffness: 300, damping: 30 },
						opacity: { duration: 0.25 },
						filter: { duration: 0.25 },
						scale: { duration: 0.25 },
					}}
					className="w-full h-full"
					onClick={goToNext}
				>
					<CurrentSlideComponent data={data} onNext={goToNext} isActive={true} />
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
