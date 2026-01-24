import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { CountUp } from '../../components/AnimatedNumber';

export function TimeStory({ data, isActive }: StorySlideProps) {
  const { stats } = data;

  // Estimate hours based on sessions (avg 45 min per session)
  const totalMinutes = stats.totalSessions * 45;
  const totalHours = Math.round(totalMinutes / 60);
  const totalDays = Math.round(totalHours / 24);

  const getTimeEquivalent = (hours: number): { text: string; emoji: string } => {
    if (hours > 500) return { text: `That's ${Math.round(hours / 2)} movies worth of coding`, emoji: '🎬' };
    if (hours > 200) return { text: `Enough time to drive coast to coast ${Math.round(hours / 40)} times`, emoji: '🚗' };
    if (hours > 100) return { text: `You could have watched ${Math.round(hours / 8)} seasons of TV`, emoji: '📺' };
    if (hours > 50) return { text: `That's ${Math.round(hours * 60 / 90)} yoga sessions`, emoji: '🧘' };
    return { text: 'A solid investment in your craft', emoji: '💪' };
  };

  const equivalent = getTimeEquivalent(totalHours);

  return (
    <GradientBackground variant="blue">
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <motion.div
          className="text-gray-400 text-lg mb-4 tracking-widest uppercase"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          You spent approximately
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          <div className="text-8xl md:text-9xl font-black text-white">
            {isActive && <CountUp end={totalHours} duration={1.5} />}
          </div>
          <div className="text-2xl text-gray-300 mt-2">hours pair programming</div>
        </motion.div>

        <motion.div
          className="mt-8 flex gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5 }}
        >
          <div className="glass px-6 py-4 rounded-xl">
            <div className="text-3xl font-bold text-terminal-blue">
              {isActive && <CountUp end={totalDays} duration={1.5} />}
            </div>
            <div className="text-gray-400 text-sm">days straight</div>
          </div>
          <div className="glass px-6 py-4 rounded-xl">
            <div className="text-3xl font-bold text-terminal-blue">
              {isActive && <CountUp end={stats.daysActive} duration={1.5} />}
            </div>
            <div className="text-gray-400 text-sm">active days</div>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-xl text-gray-400 max-w-md flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
        >
          <span className="text-3xl">{equivalent.emoji}</span>
          <span>{equivalent.text}</span>
        </motion.div>

        {/* Clock visualization */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, rotate: -180 }}
          animate={isActive ? { opacity: 1, rotate: 0 } : {}}
          transition={{ delay: 1, duration: 1, type: 'spring' }}
        >
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#timeGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(totalHours / 1000) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </GradientBackground>
  );
}
