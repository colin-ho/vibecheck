import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';

const modelInfo: Record<string, { name: string; color: string; description: string; emoji: string }> = {
  opus: {
    name: 'Claude Opus',
    color: '#c084fc',
    description: 'The powerhouse',
    emoji: '👑',
  },
  'claude-opus-4-20250514': {
    name: 'Claude Opus 4',
    color: '#c084fc',
    description: 'Latest powerhouse',
    emoji: '👑',
  },
  sonnet: {
    name: 'Claude Sonnet',
    color: '#60a5fa',
    description: 'The sweet spot',
    emoji: '⚡',
  },
  'claude-sonnet-4-20250514': {
    name: 'Claude Sonnet 4',
    color: '#60a5fa',
    description: 'Latest balance',
    emoji: '⚡',
  },
  haiku: {
    name: 'Claude Haiku',
    color: '#34d399',
    description: 'Speed demon',
    emoji: '🚀',
  },
  'claude-3-opus-20240229': {
    name: 'Claude 3 Opus',
    color: '#c084fc',
    description: 'The powerhouse',
    emoji: '👑',
  },
  'claude-3-5-sonnet-20241022': {
    name: 'Claude 3.5 Sonnet',
    color: '#60a5fa',
    description: 'The sweet spot',
    emoji: '⚡',
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    color: '#34d399',
    description: 'Speed demon',
    emoji: '🚀',
  },
};

export function ModelsStory({ data, isActive }: StorySlideProps) {
  const { stats } = data;

  const total = Object.values(stats.modelUsage).reduce((a, b) => a + b, 0);
  const sortedModels = Object.entries(stats.modelUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Calculate percentages for pie chart
  const modelData = sortedModels.map(([model, tokens]) => ({
    model,
    tokens,
    percentage: (tokens / total) * 100,
    ...modelInfo[model] || {
      name: model,
      color: '#888',
      description: 'Model',
      emoji: '🤖',
    },
  }));

  const topModel = modelData[0];

  const getModelComment = (model: string, percentage: number): string => {
    const modelKey = model.toLowerCase();
    if (modelKey.includes('opus')) {
      if (percentage > 80) return "Only the best for you 👑";
      if (percentage > 50) return "Quality over quantity";
      return "Opus for the important stuff";
    }
    if (modelKey.includes('sonnet')) {
      if (percentage > 80) return "Balanced and efficient";
      if (percentage > 50) return "The workhorse of your toolkit";
      return "Sonnet knows the way";
    }
    if (modelKey.includes('haiku')) {
      if (percentage > 50) return "Speed is your priority 🚀";
      return "Quick and nimble";
    }
    return "A diverse model diet";
  };

  // Calculate pie chart segments
  let cumulativePercentage = 0;
  const pieSegments = modelData.map((model) => {
    const startAngle = cumulativePercentage * 3.6; // 360 / 100
    cumulativePercentage += model.percentage;
    return {
      ...model,
      startAngle,
      endAngle: cumulativePercentage * 3.6,
    };
  });

  return (
    <GradientBackground variant="purple">
      <div className="flex flex-col items-center justify-center h-full px-8">
        <motion.div
          className="text-gray-400 text-lg mb-4 tracking-widest uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Your model mix
        </motion.div>

        {/* Pie chart visualization */}
        <motion.div
          className="relative w-56 h-56 my-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {pieSegments.map((segment, index) => {
              const largeArc = segment.percentage > 50 ? 1 : 0;
              const startX = 50 + 40 * Math.cos((segment.startAngle * Math.PI) / 180);
              const startY = 50 + 40 * Math.sin((segment.startAngle * Math.PI) / 180);
              const endX = 50 + 40 * Math.cos((segment.endAngle * Math.PI) / 180);
              const endY = 50 + 40 * Math.sin((segment.endAngle * Math.PI) / 180);

              return (
                <motion.path
                  key={segment.model}
                  d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                  fill={segment.color}
                  initial={{ opacity: 0 }}
                  animate={isActive ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.2 }}
                />
              );
            })}
            {/* Inner circle for donut effect */}
            <circle cx="50" cy="50" r="25" fill="#0a0a0a" />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl">{topModel?.emoji}</span>
          </div>
        </motion.div>

        {/* Model breakdown */}
        <motion.div
          className="flex flex-col gap-3 w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          {modelData.map((model, index) => (
            <motion.div
              key={model.model}
              className="flex items-center gap-3 glass px-4 py-3 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.2 + index * 0.15 }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: model.color }}
              />
              <span className="text-2xl">{model.emoji}</span>
              <div className="flex-1">
                <div className="text-white font-medium">{model.name}</div>
                <div className="text-gray-500 text-xs">{model.description}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{model.percentage.toFixed(1)}%</div>
                <div className="text-gray-500 text-xs">
                  {(model.tokens / 1000000).toFixed(1)}M tokens
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Comment */}
        {topModel && (
          <motion.div
            className="mt-8 text-lg text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 2 }}
          >
            {getModelComment(topModel.model, topModel.percentage)}
          </motion.div>
        )}
      </div>
    </GradientBackground>
  );
}
