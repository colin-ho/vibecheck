import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { CountUp } from '../../components/AnimatedNumber';

export function TokensStory({ data, isActive }: StorySlideProps) {
  const { stats, percentiles } = data;
  const { totalTokens } = stats;

  const total = totalTokens.input + totalTokens.output;

  const formatTokens = (n: number): string => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  // Calculate percentages for visualization
  const inputPercent = (totalTokens.input / total) * 100;
  const outputPercent = (totalTokens.output / total) * 100;

  const getTokenComment = (tokens: number): string => {
    if (tokens > 10000000) return "You've fed Claude a small library";
    if (tokens > 5000000) return "That's a lot of context";
    if (tokens > 1000000) return "Over a million tokens of collaboration";
    if (tokens > 500000) return "Half a million tokens and counting";
    return "Every token counts";
  };

  return (
    <GradientBackground variant="green">
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <motion.div
          className="text-gray-400 text-lg mb-4 tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          You exchanged
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          <div className="text-7xl md:text-8xl font-black text-white">
            {isActive && <CountUp end={total / 1000000} decimals={1} suffix="M" duration={1.5} />}
          </div>
          <div className="text-2xl text-gray-300 mt-2">tokens with Claude</div>
        </motion.div>

        {/* Token flow visualization */}
        <motion.div
          className="mt-12 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Input</span>
            <span>Output</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden bg-gray-800 flex">
            <motion.div
              className="h-full bg-gradient-to-r from-terminal-green to-terminal-blue"
              initial={{ width: 0 }}
              animate={isActive ? { width: `${inputPercent}%` } : {}}
              transition={{ delay: 1.2, duration: 0.8 }}
            />
            <motion.div
              className="h-full bg-gradient-to-r from-terminal-purple to-terminal-pink"
              initial={{ width: 0 }}
              animate={isActive ? { width: `${outputPercent}%` } : {}}
              transition={{ delay: 1.5, duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between text-lg font-semibold mt-2">
            <span className="text-terminal-green">{formatTokens(totalTokens.input)}</span>
            <span className="text-terminal-purple">{formatTokens(totalTokens.output)}</span>
          </div>
        </motion.div>

        {/* Token breakdown */}
        <motion.div
          className="mt-8 flex gap-6 flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8 }}
        >
          <div className="glass px-5 py-3 rounded-xl text-center">
            <div className="text-2xl font-bold text-terminal-green">
              {formatTokens(totalTokens.input)}
            </div>
            <div className="text-gray-400 text-xs">sent to Claude</div>
          </div>
          <div className="glass px-5 py-3 rounded-xl text-center">
            <div className="text-2xl font-bold text-terminal-purple">
              {formatTokens(totalTokens.output)}
            </div>
            <div className="text-gray-400 text-xs">received back</div>
          </div>
          <div className="glass px-5 py-3 rounded-xl text-center">
            <div className="text-2xl font-bold text-terminal-blue">
              {formatTokens(totalTokens.cached)}
            </div>
            <div className="text-gray-400 text-xs">from cache</div>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 text-lg text-gray-400"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.2 }}
        >
          {getTokenComment(total)}
        </motion.div>

        {/* Percentile badge */}
        {percentiles.tokenUsage <= 20 && (
          <motion.div
            className="mt-6 glass px-6 py-3 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.5 }}
          >
            <span className="text-terminal-green font-semibold">
              Top {Math.round(percentiles.tokenUsage)}%
            </span>
            <span className="text-gray-400 ml-2">token user</span>
          </motion.div>
        )}
      </div>
    </GradientBackground>
  );
}
