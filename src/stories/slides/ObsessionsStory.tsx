import { motion } from 'framer-motion';
import { StorySlideProps, Topics } from '../../data/types';
import { getTopicRoast } from '../../personas/definitions';
import { SlideLayout } from '../../components/SlideLayout';

interface TopicData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

// Warm color palette for topics
const topicConfig: Record<keyof Topics, { color: string; label: string }> = {
  debugging: { color: '#da1c1c', label: 'Debugging' },
  frontend: { color: '#bdb7fc', label: 'Frontend' },
  backend: { color: '#dd5013', label: 'Backend' },
  devops: { color: '#a05f1a', label: 'DevOps' },
  ai: { color: '#8b372b', label: 'AI/ML' },
  testing: { color: '#5d3d3a', label: 'Testing' },
  refactoring: { color: '#3b110c', label: 'Refactoring' },
};

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

  const total = Object.values(topics).reduce((a, b) => a + b, 0) || 1;

  const topicData: TopicData[] = Object.entries(topics)
    .map(([key, count]) => ({
      name: key,
      count,
      percentage: Math.round((count / total) * 100),
      color: topicConfig[key as keyof Topics]?.color || '#8b372b',
    }))
    .sort((a, b) => b.count - a.count)
    .filter(t => t.count > 0);

  const topTopic = topicData[0];
  const topTopicLabel = topicConfig[topTopic?.name as keyof Topics]?.label || topTopic?.name;

  // Bubble/radar-style visualization
  const maxPercentage = Math.max(...topicData.map(t => t.percentage), 1);

  return (
    <SlideLayout>
        {/* Header */}
        <motion.div
          className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          WHAT KEPT YOU UP AT NIGHT
        </motion.div>

        {/* Bubble cluster visualization */}
        <motion.div
          className="relative w-72 h-72 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {topicData.slice(0, 6).map((topic, index) => {
            // Position bubbles in a cluster
            const angle = (index / Math.min(topicData.length, 6)) * Math.PI * 2 - Math.PI / 2;
            const distanceFromCenter = index === 0 ? 0 : 80 + (index % 2) * 20;
            const size = 40 + (topic.percentage / maxPercentage) * 60;

            const x = 144 + (index === 0 ? 0 : Math.cos(angle) * distanceFromCenter);
            const y = 144 + (index === 0 ? 0 : Math.sin(angle) * distanceFromCenter);

            return (
              <motion.div
                key={topic.name}
                className="absolute flex flex-col items-center justify-center rounded-full"
                style={{
                  left: x - size / 2,
                  top: y - size / 2,
                  width: size,
                  height: size,
                  background: `radial-gradient(circle, ${topic.color}50, ${topic.color}30)`,
                  border: `2px solid ${topic.color}70`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 0.6 + index * 0.15,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                {index === 0 && (
                  <>
                    <span className="text-dark text-xs font-bold">{topTopicLabel}</span>
                    <span className="text-dark/60 text-xs">{topic.percentage}%</span>
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Topic legend with bars */}
        <motion.div
          className="w-full max-w-sm space-y-2"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1.7 }}
        >
          {topicData.slice(0, 5).map((topic, index) => (
            <motion.div
              key={topic.name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.7 + index * 0.1 }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: topic.color }}
              />
              <span className="text-dark/60 text-xs w-20">
                {topicConfig[topic.name as keyof Topics]?.label || topic.name}
              </span>
              <div className="flex-1 h-1.5 bg-cream/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: topic.color }}
                  initial={{ width: 0 }}
                  animate={isActive ? { width: `${topic.percentage}%` } : {}}
                  transition={{ delay: 1.9 + index * 0.1, duration: 0.8 }}
                />
              </div>
              <span className="text-dark/80 text-xs w-8 text-right">{topic.percentage}%</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Roast for top topic */}
        {topTopic && (
          <motion.div
            className="leading-[1.65] mt-8 text-sunset-accent text-sm italic text-center max-w-sm"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 2.4 }}
          >
            {getTopicRoast(topTopic.name, topTopic.percentage)}
          </motion.div>
        )}
    </SlideLayout>
  );
}
