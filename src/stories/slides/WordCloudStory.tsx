import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { getWordRoast } from '../../personas/definitions';

export function WordCloudStory({ data, isActive }: StorySlideProps) {
  const { wordAnalysis } = data;
  const topWords = wordAnalysis?.topWords || [];
  const topPhrases = wordAnalysis?.topPhrases || [];

  // Get top word for the main roast
  const topWord = topWords[0];
  const topPhrase = topPhrases[0];

  // Generate roast based on patterns
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

  // Size scaling for word cloud effect
  const getWordSize = (index: number): string => {
    if (index === 0) return 'text-5xl md:text-6xl';
    if (index === 1) return 'text-4xl md:text-5xl';
    if (index === 2) return 'text-3xl md:text-4xl';
    if (index < 5) return 'text-2xl md:text-3xl';
    if (index < 8) return 'text-xl md:text-2xl';
    return 'text-lg md:text-xl';
  };

  // Color gradient for words
  const getWordColor = (index: number): string => {
    const colors = [
      'text-terminal-green',
      'text-terminal-cyan',
      'text-terminal-purple',
      'text-terminal-orange',
      'text-pink-400',
      'text-blue-400',
      'text-yellow-400',
      'text-emerald-400',
      'text-violet-400',
      'text-rose-400',
    ];
    return colors[index % colors.length];
  };

  return (
    <GradientBackground variant="blue">
      <div className="flex flex-col items-center justify-center h-full px-8">
        {/* Header */}
        <motion.div
          className="text-gray-400 text-lg mb-8 tracking-widest uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Your vocabulary, exposed
        </motion.div>

        {/* Word cloud */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-4 max-w-3xl mb-8"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {topWords.slice(0, 10).map((word, index) => (
            <motion.span
              key={word.word}
              className={`font-bold ${getWordSize(index)} ${getWordColor(index)} hover:scale-110 transition-transform cursor-default`}
              initial={{ opacity: 0, scale: 0.5, rotate: Math.random() * 20 - 10 }}
              animate={isActive ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{
                delay: 0.5 + index * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
            >
              {word.word}
            </motion.span>
          ))}
        </motion.div>

        {/* Main stat callout */}
        {topWord && (
          <motion.div
            className="glass p-6 rounded-2xl text-center max-w-md mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5 }}
          >
            <div className="text-white text-xl mb-2">
              You said <span className="text-terminal-green font-bold">"{topWord.word}"</span>
            </div>
            <div className="text-5xl font-black text-white mb-2">
              {topWord.count.toLocaleString()}
            </div>
            <div className="text-gray-400">times</div>
          </motion.div>
        )}

        {/* Favorite opener */}
        {topPhrase && (
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 1.8 }}
          >
            <div className="text-gray-400 text-sm mb-1">Your favorite opener:</div>
            <div className="text-white text-xl font-mono">
              "{topPhrase.phrase}..."
              <span className="text-gray-500 text-sm ml-2">({topPhrase.count}x)</span>
            </div>
          </motion.div>
        )}

        {/* Roast */}
        <motion.div
          className="text-terminal-orange text-lg text-center italic max-w-md"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.2 }}
        >
          {topWord ? getWordRoast(topWord.word, topWord.count) : getPatternRoast()}
        </motion.div>

        {/* Background words floating */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          {topWords.slice(0, 20).map((word, i) => (
            <motion.div
              key={`bg-${word.word}`}
              className="absolute text-white font-bold"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {word.word}
            </motion.div>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
}
