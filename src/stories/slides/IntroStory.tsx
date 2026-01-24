import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';

export function IntroStory({ isActive }: StorySlideProps) {
  return (
    <GradientBackground variant="default">
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        {/* Terminal frame */}
        <motion.div
          className="relative max-w-2xl w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Terminal header */}
          <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-gray-400 text-sm font-mono">claude-wrapped</span>
          </div>

          {/* Terminal content */}
          <div className="bg-gray-900/80 backdrop-blur rounded-b-lg p-8 border border-gray-800">
            <motion.div
              className="font-mono text-left"
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              <div className="text-gray-500 mb-2">$ claude --wrapped</div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
                className="text-terminal-green"
              >
                <span className="text-gray-500">[</span>
                <span>████████████████████</span>
                <span className="text-gray-500">]</span>
                <span className="ml-2">100%</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 1.3 }}
                className="mt-4 text-gray-400"
              >
                Analyzing your coding journey...
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="gradient-text">YOUR YEAR</span>
          </h1>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mt-2">
            <span className="text-white">IN CODE</span>
          </h1>
        </motion.div>

        <motion.p
          className="text-gray-400 mt-6 text-lg"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.3 }}
        >
          A journey through your Claude Code sessions
        </motion.p>

        {/* Animated cursor */}
        <motion.div
          className="mt-8 text-terminal-green font-mono"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.8 }}
        >
          <span className="cursor-blink">▌</span>
        </motion.div>
      </div>
    </GradientBackground>
  );
}
