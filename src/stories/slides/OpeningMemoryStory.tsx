import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';

export function OpeningMemoryStory({ data, isActive }: StorySlideProps) {
  const { promptSamples } = data;
  const firstPrompt = promptSamples?.first || 'help me with something';

  // Extract a timestamp-like display (mock for now)
  const mockTimestamp = 'January 22, 2:47 AM';

  // Truncate if too long
  const displayPrompt = firstPrompt.length > 200
    ? firstPrompt.slice(0, 200) + '...'
    : firstPrompt;

  // Generate roast based on prompt characteristics
  const getRoast = () => {
    const lowerPrompt = firstPrompt.toLowerCase();
    if (lowerPrompt.includes('fix') || lowerPrompt.includes('bug') || lowerPrompt.includes('error')) {
      return 'Starting strong with the debugging. Classic.';
    }
    if (lowerPrompt.includes('help')) {
      return 'Ah yes, the humble beginning. We all start somewhere.';
    }
    if (firstPrompt === firstPrompt.toUpperCase() && firstPrompt.length > 10) {
      return 'Starting with ALL CAPS. Bold move.';
    }
    if (lowerPrompt.includes('please')) {
      return 'At least you said please. Manners matter.';
    }
    if (firstPrompt.includes('2') || firstPrompt.includes('3') || firstPrompt.includes('hour')) {
      return 'Multi-hour debugging session? We\'ve all been there.';
    }
    return 'And so the journey began...';
  };

  return (
    <GradientBackground variant="purple">
      <div className="flex flex-col items-center justify-center h-full px-8">
        {/* Header */}
        <motion.div
          className="text-gray-400 text-lg mb-12 tracking-widest uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Remember this?
        </motion.div>

        {/* Memory card */}
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Terminal-style card */}
          <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-white/40 text-xs ml-2 font-mono">your-first-session</span>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Timestamp */}
              <motion.div
                className="text-gray-500 text-sm mb-4 font-mono"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
              >
                {mockTimestamp}
              </motion.div>

              {/* "You wrote:" label */}
              <motion.div
                className="text-gray-400 text-sm mb-2"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                You wrote:
              </motion.div>

              {/* The actual prompt */}
              <motion.div
                className="bg-white/5 rounded-xl p-4 mb-4 border-l-4 border-terminal-green"
                initial={{ opacity: 0, x: -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <p className="text-white/90 text-lg font-mono leading-relaxed">
                  "{displayPrompt}"
                </p>
              </motion.div>

              {/* Roast/comment */}
              <motion.p
                className="text-terminal-orange text-sm italic mt-4"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 1.4 }}
              >
                {getRoast()}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Floating memory particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </GradientBackground>
  );
}
