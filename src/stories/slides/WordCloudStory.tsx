import { motion } from 'framer-motion'
import { StorySlideProps } from '../../data/types'
import { SpiralCloud } from '../../components/viz/SpiralCloud'
import { getWordRoast } from '../../personas/definitions'
import { SlideLayout } from '../../components/SlideLayout'

export function WordCloudStory({ data, isActive }: StorySlideProps) {
	const { insights } = data
	const topWords = insights?.topWords || []
	const topPhrases = insights?.topPhrases || []
	const communicationStyle = insights?.communicationStyle

	const topWord = topWords[0]
	const topPhrase = topPhrases[0]
	const catchphrases = communicationStyle?.catchphrases || []
	const signatureOpeners = communicationStyle?.signatureOpeners || []
	const verbalTics = communicationStyle?.verbalTics || []

	const getPatternRoast = () => {
		if (!insights) return 'Your vocabulary is... interesting.'

		const politeness = insights.communicationStyle?.politenessLevel

		// Check for patterns based on new insights structure
		if (politeness === 'diplomatic' || politeness === 'apologetic') {
			return 'Suspiciously polite. What are you hiding?'
		}
		if (politeness === 'demanding') {
			return 'You know what you want. Claude respects that.'
		}

		// Check top words for patterns
		const topWordStr = topWord?.word?.toLowerCase()
		if (topWordStr === 'fix' && topWord.count > 200) {
			return 'Maybe write tests first next time?'
		}
		if (topWordStr === 'help' && topWord.count > 300) {
			return 'Independence is overrated anyway.'
		}

		return 'Your vocabulary has been noted.'
	}

	return (
		<SlideLayout>
			{/* Header */}
			<motion.div
				className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={isActive ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				YOUR VOCABULARY, EXPOSED
			</motion.div>

			{/* Spiral word cloud - warm colors */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 0.3 }}
			>
				<SpiralCloud
					words={topWords.slice(0, 20)}
					size={280}
					rotate={false}
					delay={0.6}
					colors={['#bdb7fc', '#dd5013', '#da1c1c', '#a05f1a', '#8b372b']}
				/>
			</motion.div>

			{/* Main stat callout */}
			{topWord && (
				<motion.div
					className="mt-6 text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={isActive ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 2 }}
				>
					<div className="text-sm text-dark/80 mb-1">
						You said <span className="text-lavender font-semibold">"{topWord.word}"</span>
					</div>
					<div className="text-4xl font-black text-dark">
						{topWord.count.toLocaleString()}
						<span className="text-lg font-normal text-dark/80 ml-2">times</span>
					</div>
				</motion.div>
			)}

			{/* Favorite opener / Signature openers */}
			{(signatureOpeners.length > 0 || topPhrase) && (
				<motion.div
					className="mt-6 text-center"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.4 }}
				>
					<div className="text-xs text-dark/70 mb-2">
						{signatureOpeners.length > 0 ? 'Your signature openers:' : 'Favorite opener:'}
					</div>
					<div className="flex flex-wrap justify-center gap-2">
						{signatureOpeners.length > 0
							? signatureOpeners.slice(0, 3).map((opener, i) => (
									<span
										key={i}
										className="text-dark font-mono text-xs bg-cream/60 px-3 py-1.5 rounded-full"
									>
										"{opener}..."
									</span>
								))
							: topPhrase && (
									<span className="text-dark font-mono text-sm bg-cream/60 px-4 py-2 rounded-full">
										"{topPhrase.phrase}..."
										<span className="text-dark/80 ml-2">({topPhrase.count}x)</span>
									</span>
								)}
					</div>
				</motion.div>
			)}

			{/* Catchphrases */}
			{catchphrases.length > 0 && (
				<motion.div
					className="mt-5 text-center"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.6 }}
				>
					<div className="text-xs text-dark/70 mb-2">Your catchphrases:</div>
					<div className="flex flex-wrap justify-center gap-2">
						{catchphrases.slice(0, 3).map((phrase, i) => (
							<span
								key={i}
								className="text-dark text-xs bg-lavender/20 px-3 py-1.5 rounded-full border border-lavender/30"
							>
								"{phrase}"
							</span>
						))}
					</div>
				</motion.div>
			)}

			{/* Verbal tics */}
			{verbalTics.length > 0 && (
				<motion.div
					className="mt-4 text-center"
					initial={{ opacity: 0 }}
					animate={isActive ? { opacity: 1 } : {}}
					transition={{ delay: 2.8 }}
				>
					<div className="text-xs text-dark/70 mb-2">Your verbal tics:</div>
					<div className="flex flex-wrap justify-center gap-2">
						{verbalTics.slice(0, 4).map((tic, i) => (
							<span
								key={i}
								className="text-dark/70 text-xs bg-sunset/10 px-2 py-1 rounded-full italic"
							>
								{tic}
							</span>
						))}
					</div>
				</motion.div>
			)}

			{/* Roast */}
			<motion.div
				className="leading-[1.65] mt-6 text-sunset-accent text-sm italic text-center max-w-sm"
				initial={{ opacity: 0 }}
				animate={isActive ? { opacity: 1 } : {}}
				transition={{ delay: 3.2 }}
			>
				{topWord ? getWordRoast(topWord.word, topWord.count) : getPatternRoast()}
			</motion.div>
		</SlideLayout>
	)
}
