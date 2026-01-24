import { motion } from 'framer-motion';
import { StorySlideProps, Topics } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { getTopicRoast } from '../../personas/definitions';

interface TopicData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

export function ObsessionsStory({ data, isActive }: StorySlideProps) {
  const topics = data.topics || {
    debugging: 0,
    frontend: 0,
    backend: 0,
    devops: 0,
    ai: 0,
    testing: 0,
    refactoring: 0,
  };

  // Calculate total and percentages
  const total = Object.values(topics).reduce((a, b) => a + b, 0) || 1;

  const topicConfig: Record<keyof Topics, { color: string; icon: string; label: string }> = {
    debugging: { color: '#ef4444', icon: '🐛', label: 'Debugging' },
    frontend: { color: '#3b82f6', icon: '🎨', label: 'Frontend' },
    backend: { color: '#22c55e', icon: '🔧', label: 'Backend' },
    devops: { color: '#f97316', icon: '🚀', label: 'DevOps' },
    ai: { color: '#a855f7', icon: '🤖', label: 'AI/ML' },
    testing: { color: '#06b6d4', icon: '🧪', label: 'Testing' },
    refactoring: { color: '#ec4899', icon: '✨', label: 'Refactoring' },
  };

  // Convert to array and sort by count
  const topicData: TopicData[] = Object.entries(topics)
    .map(([key, count]) => ({
      name: key,
      count,
      percentage: Math.round((count / total) * 100),
      color: topicConfig[key as keyof Topics]?.color || '#888',
      icon: topicConfig[key as keyof Topics]?.icon || '📁',
    }))
    .sort((a, b) => b.count - a.count)
    .filter(t => t.count > 0);

  const topTopic = topicData[0];
  const topTopicLabel = topicConfig[topTopic?.name as keyof Topics]?.label || topTopic?.name;

  // Generate roast based on top topic
  const getObsessionRoast = () => {
    if (!topTopic) return "Your focus is... everywhere.";

    const roasts: Record<string, string> = {
      debugging: "Your code: broken. Your spirit: also broken. At least you're consistent.",
      frontend: "CSS is hard. Everyone knows. But 47 prompts to center a div?",
      backend: "REST in peace to your sanity. And your API endpoints.",
      devops: "Infrastructure as code. Bugs as features. Pipeline as chaos.",
      ai: "Prompt engineering your way through life. Token by token.",
      testing: "The tests pass. The code works. These are two different statements.",
      refactoring: "Perfection is a journey, not a destination. You're still journeying.",
    };

    return roasts[topTopic.name] || `Your top obsession: ${topTopicLabel}. Might want to diversify.`;
  };

  return (
    <GradientBackground variant="green">
      <div className="flex flex-col items-center justify-center h-full px-8">
        {/* Header */}
        <motion.div
          className="text-gray-400 text-lg mb-8 tracking-widest uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          What kept you up at night
        </motion.div>

        {/* Topic bars */}
        <motion.div
          className="w-full max-w-md space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {topicData.slice(0, 5).map((topic, index) => (
            <motion.div
              key={topic.name}
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + index * 0.15 }}
            >
              {/* Topic label */}
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{topic.icon}</span>
                  <span className="text-white font-medium">
                    {topicConfig[topic.name as keyof Topics]?.label || topic.name}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">{topic.percentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: topic.color }}
                  initial={{ width: 0 }}
                  animate={isActive ? { width: `${topic.percentage}%` } : {}}
                  transition={{ delay: 0.7 + index * 0.15, duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              {/* Roast line for top topic */}
              {index === 0 && (
                <motion.div
                  className="text-terminal-orange text-sm mt-1 italic"
                  initial={{ opacity: 0 }}
                  animate={isActive ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5 }}
                >
                  {getTopicRoast(topic.name, topic.percentage)}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Main callout */}
        <motion.div
          className="glass p-6 rounded-2xl text-center max-w-md mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8 }}
        >
          <div className="text-gray-400 text-sm mb-2">Your top obsession</div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{topTopic?.icon}</span>
            <span className="text-4xl font-black text-white">{topTopicLabel}</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: topTopic?.color }}>
            {topTopic?.percentage}% of your prompts
          </div>
        </motion.div>

        {/* Final roast */}
        <motion.div
          className="text-terminal-orange text-lg text-center italic max-w-md"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.2 }}
        >
          {getObsessionRoast()}
        </motion.div>

        {/* Floating topic icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {topicData.map((topic, i) => (
            <motion.div
              key={`float-${topic.name}`}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {topic.icon}
            </motion.div>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
}
