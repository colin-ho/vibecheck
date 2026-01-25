import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { SlideLayout } from '../../components/SlideLayout';

export function OpeningMemoryStory({ data, isActive }: StorySlideProps) {
  const { promptSamples } = data;
  const firstPrompt = promptSamples?.first || 'help me with something';

  // Mock timestamp display
  const mockTimestamp = 'January 22, 2:47 AM';

  // Truncate if too long
  const displayPrompt = firstPrompt.length > 180
    ? firstPrompt.slice(0, 180) + '...'
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
    <SlideLayout className="relative">
        {/* Header */}
        <motion.div
          className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          WHERE IT STARTED
        </motion.div>

        {/* Memory card - warm refined style */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="bg-cream/90 border border-dark/10 rounded-xl overflow-hidden">
            {/* Terminal header - warm minimal */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-sunset-afternoon border-b border-dark/10">
              <motion.div
                className="w-2 h-2 rounded-full bg-lavender"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <span className="text-dark/70 text-xs font-mono">your-journey</span>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Timestamp badge - photo metadata style */}
              <motion.div
                className="inline-flex items-center gap-2 text-dark/70 text-xs font-mono mb-4 bg-dark/5 px-3 py-1.5 rounded-full"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {mockTimestamp}
              </motion.div>

              {/* "You wrote:" label */}
              <motion.div
                className="text-dark/80 text-xs mb-2"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 }}
              >
                You wrote:
              </motion.div>

              {/* The actual prompt with typing cursor */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -10 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <div className="border-l-2 border-lavender/60 pl-4 py-2">
                  <p className="text-dark/90 text-base font-mono leading-relaxed">
                    "{displayPrompt}"
                    <motion.span
                      className="inline-block w-2 h-4 bg-lavender/50 ml-1 align-middle"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  </p>
                </div>
              </motion.div>

              {/* Roast/comment - italic sunset orange */}
              <motion.p
                className="leading-[1.65] text-sunset-accent text-sm italic mt-5"
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 1.8 }}
              >
                {getRoast()}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Subtle floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-lavender/30 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
    </SlideLayout>
  );
}
