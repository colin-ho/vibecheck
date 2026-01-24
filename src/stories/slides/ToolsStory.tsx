import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { CountUp } from '../../components/AnimatedNumber';

const toolColors: Record<string, string> = {
  Read: '#00ff41',
  Bash: '#f97316',
  Edit: '#00d4ff',
  Write: '#a855f7',
  Grep: '#ec4899',
  Glob: '#facc15',
  Task: '#22c55e',
  WebFetch: '#3b82f6',
  WebSearch: '#8b5cf6',
};

const toolEmojis: Record<string, string> = {
  Read: '📖',
  Bash: '💻',
  Edit: '✏️',
  Write: '📝',
  Grep: '🔍',
  Glob: '🗂️',
  Task: '🤖',
  WebFetch: '🌐',
  WebSearch: '🔎',
};

export function ToolsStory({ data, isActive }: StorySlideProps) {
  const { stats, percentiles } = data;

  const sortedTools = Object.entries(stats.toolUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxUsage = sortedTools[0]?.[1] || 1;
  const totalTools = Object.values(stats.toolUsage).reduce((a, b) => a + b, 0);
  const toolCount = Object.keys(stats.toolUsage).length;

  const topTool = sortedTools[0];

  const getToolComment = (tool: string): string => {
    switch (tool) {
      case 'Read': return "You like to understand before you act";
      case 'Bash': return "Command line warrior detected";
      case 'Edit': return "Precision editing is your style";
      case 'Write': return "Creating new things from scratch";
      case 'Grep': return "Searching for that needle in the haystack";
      case 'Glob': return "Pattern matching pro";
      case 'Task': return "Delegation master";
      default: return "A diverse toolkit";
    }
  };

  return (
    <GradientBackground variant="orange">
      <div className="flex flex-col items-center justify-center h-full px-8">
        <motion.div
          className="text-gray-400 text-lg mb-4 tracking-widest uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Your tool arsenal
        </motion.div>

        {/* Total tool calls */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl font-black text-white">
            {isActive && <CountUp end={totalTools} duration={1.5} />}
          </div>
          <div className="text-gray-300 text-lg">total tool calls</div>
        </motion.div>

        {/* Tool bars */}
        <motion.div
          className="w-full max-w-lg space-y-3"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {sortedTools.map(([tool, count], index) => (
            <motion.div
              key={tool}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -50 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <span className="text-2xl w-8">{toolEmojis[tool] || '🔧'}</span>
              <span className="text-white font-medium w-20 text-sm">{tool}</span>
              <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                <motion.div
                  className="h-full rounded-lg"
                  style={{ backgroundColor: toolColors[tool] || '#888' }}
                  initial={{ width: 0 }}
                  animate={isActive ? { width: `${(count / maxUsage) * 100}%` } : {}}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-bold text-sm">
                  {count.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Top tool highlight */}
        {topTool && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2 }}
          >
            <div className="text-lg text-gray-400">
              Your favorite tool is <span className="text-white font-bold">{topTool[0]}</span>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {getToolComment(topTool[0])}
            </div>
          </motion.div>
        )}

        {/* Tool diversity badge */}
        {percentiles.toolDiversity <= 20 && (
          <motion.div
            className="mt-6 glass px-6 py-3 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.3 }}
          >
            <span className="text-terminal-orange font-semibold">
              Top {Math.round(percentiles.toolDiversity)}%
            </span>
            <span className="text-gray-400 ml-2">in tool diversity ({toolCount} tools used)</span>
          </motion.div>
        )}
      </div>
    </GradientBackground>
  );
}
