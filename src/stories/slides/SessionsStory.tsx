import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { CountUp } from '../../components/AnimatedNumber';

export function SessionsStory({ data, isActive }: StorySlideProps) {
  const { stats, percentiles } = data;

  const getSessionsComment = (sessions: number): string => {
    if (sessions > 1000) return "You basically live in the terminal";
    if (sessions > 500) return "Claude is your most frequent collaborator";
    if (sessions > 200) return "A true pair programming enthusiast";
    if (sessions > 100) return "You've found your coding companion";
    if (sessions > 50) return "The partnership is growing strong";
    return "Just getting started!";
  };

  return (
    <GradientBackground variant="purple">
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <motion.div
          className="text-gray-400 text-lg mb-4 tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          This year, you started
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          <div className="text-8xl md:text-9xl font-black text-white">
            {isActive && <CountUp end={stats.totalSessions} duration={1.5} />}
          </div>
          <div className="text-2xl text-gray-300 mt-2">coding sessions</div>
        </motion.div>

        <motion.div
          className="mt-12 text-xl text-gray-400 max-w-md"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          {getSessionsComment(stats.totalSessions)}
        </motion.div>

        {/* Percentile badge */}
        {percentiles.totalSessions <= 20 && (
          <motion.div
            className="mt-8 glass px-6 py-3 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2 }}
          >
            <span className="text-terminal-green font-semibold">
              Top {Math.round(percentiles.totalSessions)}%
            </span>
            <span className="text-gray-400 ml-2">of all Claude Code users</span>
          </motion.div>
        )}

        {/* Session visualization */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-1 max-w-lg"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          {Array.from({ length: Math.min(stats.totalSessions, 100) }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-sm bg-terminal-green/60"
              initial={{ opacity: 0, scale: 0 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 + i * 0.01 }}
            />
          ))}
          {stats.totalSessions > 100 && (
            <span className="text-gray-500 text-sm ml-2">+{stats.totalSessions - 100} more</span>
          )}
        </motion.div>
      </div>
    </GradientBackground>
  );
}
