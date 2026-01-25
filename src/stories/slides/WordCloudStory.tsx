import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { SpiralCloud } from '../../components/viz/SpiralCloud';
import { getWordRoast } from '../../personas/definitions';
import { SlideLayout } from '../../components/SlideLayout';

export function WordCloudStory({ data, isActive }: StorySlideProps) {
  const { wordAnalysis } = data;
  const topWords = wordAnalysis?.topWords || [];
  const topPhrases = wordAnalysis?.topPhrases || [];

  const topWord = topWords[0];
  const topPhrase = topPhrases[0];

  const getPatternRoast = () => {
    if (!wordAnalysis) return "Your vocabulary is... interesting.";

    if (wordAnalysis.fixCount > 200) {
      return "Maybe write tests first next time?";
    }
    if (wordAnalysis.pleaseCount > 100) {
      return "Suspiciously polite. What are you hiding?";
    }
    if (wordAnalysis.swearCount > 20) {
      return "Your code makes you swear. Understandable.";
    }
    if (wordAnalysis.politenessScore > 70) {
      return "Either Canadian or plotting something.";
    }
    if (wordAnalysis.helpCount > 300) {
      return "Independence is overrated anyway.";
    }

    return "Your vocabulary has been noted.";
  };

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
            words={topWords.slice(0, 12)}
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

        {/* Favorite opener */}
        {topPhrase && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 2.4 }}
          >
            <div className="text-xs text-dark/70 mb-1">Favorite opener:</div>
            <div className="text-dark font-mono text-sm bg-cream/60 px-4 py-2 rounded-full">
              "{topPhrase.phrase}..."
              <span className="text-dark/80 ml-2">({topPhrase.count}x)</span>
            </div>
          </motion.div>
        )}

        {/* Roast */}
        <motion.div
          className="leading-[1.65] mt-8 text-sunset-accent text-sm italic text-center max-w-sm"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.8 }}
        >
          {topWord ? getWordRoast(topWord.word, topWord.count) : getPatternRoast()}
        </motion.div>
    </SlideLayout>
  );
}
