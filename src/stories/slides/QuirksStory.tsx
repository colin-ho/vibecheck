import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { getQuirkRoast } from '../../personas/definitions';

interface CrimeCard {
  icon: string;
  title: string;
  value: string | number;
  roast: string;
  severity: 'minor' | 'moderate' | 'major';
}

export function QuirksStory({ data, isActive }: StorySlideProps) {
  const { quirks, stats, promptStats, wordAnalysis } = data;

  // Build crime cards based on available data
  const crimes: CrimeCard[] = [];

  // Interrupt count
  if (quirks?.interruptCount && quirks.interruptCount > 0) {
    crimes.push({
      icon: '⏸️',
      title: 'Claude Interruptions',
      value: quirks.interruptCount,
      roast: getQuirkRoast('interruptCount', quirks.interruptCount),
      severity: quirks.interruptCount > 20 ? 'major' : quirks.interruptCount > 10 ? 'moderate' : 'minor',
    });
  }

  // Late night sessions
  if (quirks?.lateNightSessions && quirks.lateNightSessions > 0) {
    crimes.push({
      icon: '🌙',
      title: 'After Midnight Sessions',
      value: quirks.lateNightSessions,
      roast: getQuirkRoast('lateNightSessions', quirks.lateNightSessions),
      severity: quirks.lateNightSessions > 50 ? 'major' : quirks.lateNightSessions > 20 ? 'moderate' : 'minor',
    });
  }

  // Weekend percentage
  if (quirks?.weekendPercentage && quirks.weekendPercentage > 20) {
    crimes.push({
      icon: '📅',
      title: 'Weekend Coding',
      value: `${quirks.weekendPercentage}%`,
      roast: getQuirkRoast('weekendPercentage', quirks.weekendPercentage),
      severity: quirks.weekendPercentage > 40 ? 'major' : quirks.weekendPercentage > 30 ? 'moderate' : 'minor',
    });
  }

  // Shortest session
  if (quirks?.shortestSessionSeconds && quirks.shortestSessionSeconds < 60) {
    crimes.push({
      icon: '⚡',
      title: 'Shortest Session',
      value: `${quirks.shortestSessionSeconds}s`,
      roast: getQuirkRoast('shortestSessionSeconds', quirks.shortestSessionSeconds),
      severity: quirks.shortestSessionSeconds < 15 ? 'major' : 'moderate',
    });
  }

  // Longest streak
  if (quirks?.longestStreakDays && quirks.longestStreakDays > 3) {
    crimes.push({
      icon: '🔥',
      title: 'Longest Coding Streak',
      value: `${quirks.longestStreakDays} days`,
      roast: getQuirkRoast('longestStreakDays', quirks.longestStreakDays),
      severity: quirks.longestStreakDays > 14 ? 'major' : quirks.longestStreakDays > 7 ? 'moderate' : 'minor',
    });
  }

  // Abandoned sessions
  if (quirks?.abandonedSessions && quirks.abandonedSessions > 5) {
    crimes.push({
      icon: '👻',
      title: 'Abandoned Sessions',
      value: quirks.abandonedSessions,
      roast: getQuirkRoast('abandonedSessions', quirks.abandonedSessions),
      severity: quirks.abandonedSessions > 30 ? 'major' : quirks.abandonedSessions > 15 ? 'moderate' : 'minor',
    });
  }

  // ALL CAPS prompts
  if (promptStats?.allCapsPrompts && promptStats.allCapsPrompts > 0) {
    crimes.push({
      icon: '📢',
      title: 'ALL CAPS Prompts',
      value: promptStats.allCapsPrompts,
      roast: 'We can hear you. Calm down.',
      severity: promptStats.allCapsPrompts > 10 ? 'major' : 'moderate',
    });
  }

  // Swear words
  if (wordAnalysis?.swearCount && wordAnalysis.swearCount > 0) {
    crimes.push({
      icon: '🤬',
      title: 'Times You Swore',
      value: wordAnalysis.swearCount,
      roast: 'Your code makes you angry. Understandable.',
      severity: wordAnalysis.swearCount > 20 ? 'major' : 'moderate',
    });
  }

  // Longest session (epic)
  if (stats.longestSessionMinutes > 120) {
    const hours = Math.floor(stats.longestSessionMinutes / 60);
    const mins = stats.longestSessionMinutes % 60;
    crimes.push({
      icon: '⏰',
      title: 'Longest Session',
      value: `${hours}h ${mins}m`,
      roast: hours > 4 ? 'Touching grass is free, you know.' : 'Deep work or procrastination?',
      severity: hours > 4 ? 'major' : 'moderate',
    });
  }

  // Sort by severity
  const severityOrder = { major: 0, moderate: 1, minor: 2 };
  crimes.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Take top 4
  const displayCrimes = crimes.slice(0, 4);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'major': return 'border-red-500/50 bg-red-500/10';
      case 'moderate': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <GradientBackground variant="orange">
      <div className="flex flex-col items-center justify-center h-full px-8">
        {/* Header */}
        <motion.div
          className="text-gray-400 text-lg mb-8 tracking-widest uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Your coding crimes
        </motion.div>

        {/* Crime cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {displayCrimes.map((crime, index) => (
            <motion.div
              key={crime.title}
              className={`glass p-5 rounded-xl border-2 ${getSeverityColor(crime.severity)}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.5 + index * 0.2,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{crime.icon}</span>
                <div className="flex-1">
                  <div className="text-gray-400 text-sm">{crime.title}</div>
                  <div className="text-white font-black text-3xl mt-1">{crime.value}</div>
                  <div className="text-terminal-orange text-sm mt-2 italic">{crime.roast}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary roast */}
        <motion.div
          className="mt-8 text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
        >
          <div className="text-gray-400 text-sm mb-2">Your most egregious offense:</div>
          {displayCrimes[0] && (
            <div className="text-white text-xl font-bold">
              {displayCrimes[0].title} ({displayCrimes[0].value})
            </div>
          )}
        </motion.div>

        {/* Floating crime emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {displayCrimes.map((crime, i) => (
            <motion.div
              key={`float-${crime.title}`}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {crime.icon}
            </motion.div>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
}
