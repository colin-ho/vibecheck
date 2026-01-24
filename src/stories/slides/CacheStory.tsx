import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { CountUp } from '../../components/AnimatedNumber';

export function CacheStory({ data, isActive }: StorySlideProps) {
  const { stats, percentiles } = data;

  const cacheRate = (stats.totalTokens.cached / Math.max(stats.totalTokens.input, 1)) * 100;
  const cachedTokens = stats.totalTokens.cached;

  // Estimate savings (rough: cached tokens at ~$0.003 per 1K vs $0.015 per 1K = $0.012 saved per 1K)
  const estimatedSavings = (cachedTokens / 1000) * 0.012;

  const getCacheComment = (rate: number): string => {
    if (rate > 50) return "Context efficiency master!";
    if (rate > 30) return "Smart use of context caching";
    if (rate > 15) return "Building up that cache game";
    if (rate > 5) return "There's room for more caching";
    return "Fresh context every time";
  };

  const formatMoney = (n: number): string => {
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    if (n >= 1) return `$${n.toFixed(0)}`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <GradientBackground variant="blue">
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <motion.div
          className="text-gray-400 text-lg mb-4 tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Your cache hit rate
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          <div className="text-8xl md:text-9xl font-black text-white">
            {isActive && <CountUp end={cacheRate} decimals={1} suffix="%" duration={1.5} />}
          </div>
        </motion.div>

        {/* Cache visualization - circular progress */}
        <motion.div
          className="mt-8 relative"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <svg className="w-40 h-40" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#cacheGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="251"
              strokeDashoffset="251"
              transform="rotate(-90 50 50)"
              animate={isActive ? { strokeDashoffset: 251 - (251 * cacheRate) / 100 } : {}}
              transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="cacheGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#00ff41" />
              </linearGradient>
            </defs>
            {/* Center text */}
            <text x="50" y="50" textAnchor="middle" dy="0.35em" className="text-2xl font-bold fill-white">
              {Math.round(cacheRate)}%
            </text>
          </svg>
        </motion.div>

        {/* Savings estimate */}
        {estimatedSavings > 1 && (
          <motion.div
            className="mt-8 glass px-8 py-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2 }}
          >
            <div className="text-3xl font-bold text-terminal-green">
              ~{formatMoney(estimatedSavings)}
            </div>
            <div className="text-gray-400 text-sm">estimated savings from caching</div>
          </motion.div>
        )}

        <motion.div
          className="mt-8 text-lg text-gray-400 max-w-md"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.3 }}
        >
          {getCacheComment(cacheRate)}
        </motion.div>

        {/* Percentile badge */}
        {percentiles.cacheEfficiency <= 25 && (
          <motion.div
            className="mt-6 glass px-6 py-3 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.6 }}
          >
            <span className="text-terminal-blue font-semibold">
              Top {Math.round(percentiles.cacheEfficiency)}%
            </span>
            <span className="text-gray-400 ml-2">in cache efficiency</span>
          </motion.div>
        )}
      </div>
    </GradientBackground>
  );
}
