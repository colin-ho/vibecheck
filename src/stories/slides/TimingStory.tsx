import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';

export function TimingStory({ data, isActive }: StorySlideProps) {
  const { stats, percentiles } = data;

  const maxHour = Math.max(...stats.hourCounts);
  const peakHour = stats.peakHour;

  // Calculate night owl vs early bird
  const nightHours = [22, 23, 0, 1, 2, 3, 4];
  const morningHours = [5, 6, 7, 8, 9];
  const nightSessions = nightHours.reduce((sum, h) => sum + (stats.hourCounts[h] || 0), 0);
  const morningSessions = morningHours.reduce((sum, h) => sum + (stats.hourCounts[h] || 0), 0);

  const totalHourSessions = stats.hourCounts.reduce((a, b) => a + b, 0);
  const nightPercentage = (nightSessions / totalHourSessions) * 100;

  const getTimePersonality = (): { emoji: string; title: string; description: string } => {
    if (nightPercentage > 40) {
      return {
        emoji: '🦉',
        title: 'Night Owl',
        description: 'The quiet hours are your domain',
      };
    }
    if (morningSessions > nightSessions * 2) {
      return {
        emoji: '🌅',
        title: 'Early Bird',
        description: 'Shipping code before the world wakes up',
      };
    }
    if (peakHour >= 9 && peakHour <= 17) {
      return {
        emoji: '☀️',
        title: 'Day Coder',
        description: 'Traditional hours, consistent output',
      };
    }
    return {
      emoji: '🌙',
      title: 'Evening Warrior',
      description: 'When the day job ends, the real work begins',
    };
  };

  const personality = getTimePersonality();

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
  };

  const getPeakHourRoast = (hour: number): string => {
    if (hour >= 0 && hour <= 4) return "Your peak hour is when most people are asleep 😴";
    if (hour >= 5 && hour <= 7) return "An early bird catching bugs 🐛";
    if (hour >= 8 && hour <= 9) return "Starting the day strong ☕";
    if (hour >= 10 && hour <= 11) return "Mid-morning momentum 🚀";
    if (hour >= 12 && hour <= 13) return "Lunch coding is a lifestyle 🍕";
    if (hour >= 14 && hour <= 16) return "Afternoon productivity peak 📈";
    if (hour >= 17 && hour <= 18) return "The 5 o'clock commit rush 🏃";
    if (hour >= 19 && hour <= 21) return "Evening hacking session 🌆";
    return "Late night debugging sessions 🌙";
  };

  return (
    <GradientBackground variant="purple">
      <div className="flex flex-col items-center justify-center h-full px-8">
        <motion.div
          className="text-gray-400 text-lg mb-4 tracking-widest uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          When you code
        </motion.div>

        {/* Time personality */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl mb-2">{personality.emoji}</div>
          <div className="text-4xl font-black text-white">{personality.title}</div>
          <div className="text-gray-400 mt-2">{personality.description}</div>
        </motion.div>

        {/* 24-hour heatmap */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-12 gap-1 mb-2">
            {stats.hourCounts.slice(0, 12).map((count, hour) => (
              <motion.div
                key={hour}
                className="aspect-square rounded-md relative group"
                style={{
                  backgroundColor: `rgba(0, 255, 65, ${Math.max(0.1, count / maxHour)})`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1 + hour * 0.05 }}
              >
                {hour === peakHour && (
                  <motion.div
                    className="absolute inset-0 rounded-md border-2 border-terminal-green"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                  {hour === 0 || hour === 6 ? formatHour(hour) : ''}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-1 mt-6">
            {stats.hourCounts.slice(12).map((count, i) => {
              const hour = i + 12;
              return (
                <motion.div
                  key={hour}
                  className="aspect-square rounded-md relative"
                  style={{
                    backgroundColor: `rgba(168, 85, 247, ${Math.max(0.1, count / maxHour)})`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isActive ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.6 + i * 0.05 }}
                >
                  {hour === peakHour && (
                    <motion.div
                      className="absolute inset-0 rounded-md border-2 border-terminal-purple"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                    {hour === 12 || hour === 18 ? formatHour(hour) : ''}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-between items-center mt-8 text-xs text-gray-500">
            <span>AM hours</span>
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-1">
                {[0.1, 0.3, 0.5, 0.7, 1].map((opacity, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: `rgba(0, 255, 65, ${opacity})` }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            <span>PM hours</span>
          </div>
        </motion.div>

        {/* Peak hour highlight */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.2 }}
        >
          <div className="glass px-6 py-4 rounded-xl">
            <div className="text-2xl font-bold text-white">
              Peak hour: <span className="text-terminal-green">{formatHour(peakHour)}</span>
            </div>
            <div className="text-gray-400 text-sm mt-1">
              {getPeakHourRoast(peakHour)}
            </div>
          </div>
        </motion.div>

        {/* Night coding percentile */}
        {percentiles.nightCoding <= 20 && (
          <motion.div
            className="mt-4 glass px-6 py-3 rounded-full"
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 2.5 }}
          >
            <span className="text-terminal-purple font-semibold">
              Top {Math.round(percentiles.nightCoding)}%
            </span>
            <span className="text-gray-400 ml-2">night coder</span>
          </motion.div>
        )}
      </div>
    </GradientBackground>
  );
}
