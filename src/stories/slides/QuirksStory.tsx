import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { getQuirkRoast } from '../../personas/definitions';
import { SlideLayout } from '../../components/SlideLayout';

interface CrimeCard {
  icon: string;
  title: string;
  value: string | number;
  roast: string;
  severity: 'minor' | 'moderate' | 'major';
  color: string;
}

export function QuirksStory({ data, isActive }: StorySlideProps) {
  const { quirks, stats, promptStats, wordAnalysis } = data;

  // Build crime cards based on available data - using warm colors
  const crimes: CrimeCard[] = [];

  // Interrupt count
  if (quirks?.interruptCount && quirks.interruptCount > 0) {
    crimes.push({
      icon: 'stop',
      title: 'Claude Interruptions',
      value: quirks.interruptCount,
      roast: getQuirkRoast('interruptCount', quirks.interruptCount),
      severity: quirks.interruptCount > 20 ? 'major' : quirks.interruptCount > 10 ? 'moderate' : 'minor',
      color: '#da1c1c',
    });
  }

  // Late night sessions
  if (quirks?.lateNightSessions && quirks.lateNightSessions > 0) {
    crimes.push({
      icon: 'moon',
      title: 'After Midnight Sessions',
      value: quirks.lateNightSessions,
      roast: getQuirkRoast('lateNightSessions', quirks.lateNightSessions),
      severity: quirks.lateNightSessions > 50 ? 'major' : quirks.lateNightSessions > 20 ? 'moderate' : 'minor',
      color: '#bdb7fc',
    });
  }

  // Weekend percentage
  if (quirks?.weekendPercentage && quirks.weekendPercentage > 20) {
    crimes.push({
      icon: 'calendar',
      title: 'Weekend Coding',
      value: `${quirks.weekendPercentage}%`,
      roast: getQuirkRoast('weekendPercentage', quirks.weekendPercentage),
      severity: quirks.weekendPercentage > 40 ? 'major' : quirks.weekendPercentage > 30 ? 'moderate' : 'minor',
      color: '#dd5013',
    });
  }

  // Shortest session
  if (quirks?.shortestSessionSeconds && quirks.shortestSessionSeconds < 60) {
    crimes.push({
      icon: 'zap',
      title: 'Shortest Session',
      value: `${quirks.shortestSessionSeconds}s`,
      roast: getQuirkRoast('shortestSessionSeconds', quirks.shortestSessionSeconds),
      severity: quirks.shortestSessionSeconds < 15 ? 'major' : 'moderate',
      color: '#a05f1a',
    });
  }

  // Longest streak
  if (quirks?.longestStreakDays && quirks.longestStreakDays > 3) {
    crimes.push({
      icon: 'flame',
      title: 'Longest Coding Streak',
      value: `${quirks.longestStreakDays} days`,
      roast: getQuirkRoast('longestStreakDays', quirks.longestStreakDays),
      severity: quirks.longestStreakDays > 14 ? 'major' : quirks.longestStreakDays > 7 ? 'moderate' : 'minor',
      color: '#8b372b',
    });
  }

  // Abandoned sessions
  if (quirks?.abandonedSessions && quirks.abandonedSessions > 5) {
    crimes.push({
      icon: 'ghost',
      title: 'Abandoned Sessions',
      value: quirks.abandonedSessions,
      roast: getQuirkRoast('abandonedSessions', quirks.abandonedSessions),
      severity: quirks.abandonedSessions > 30 ? 'major' : quirks.abandonedSessions > 15 ? 'moderate' : 'minor',
      color: '#5d3d3a',
    });
  }

  // ALL CAPS prompts
  if (promptStats?.allCapsPrompts && promptStats.allCapsPrompts > 0) {
    crimes.push({
      icon: 'volume',
      title: 'ALL CAPS Prompts',
      value: promptStats.allCapsPrompts,
      roast: 'We can hear you. Calm down.',
      severity: promptStats.allCapsPrompts > 10 ? 'major' : 'moderate',
      color: '#da1c1c',
    });
  }

  // Swear words
  if (wordAnalysis?.swearCount && wordAnalysis.swearCount > 0) {
    crimes.push({
      icon: 'angry',
      title: 'Times You Swore',
      value: wordAnalysis.swearCount,
      roast: 'Your code makes you angry. Understandable.',
      severity: wordAnalysis.swearCount > 20 ? 'major' : 'moderate',
      color: '#dd5013',
    });
  }

  // Longest session (epic)
  if (stats.longestSessionMinutes > 120) {
    const hours = Math.floor(stats.longestSessionMinutes / 60);
    const mins = stats.longestSessionMinutes % 60;
    crimes.push({
      icon: 'clock',
      title: 'Longest Session',
      value: `${hours}h ${mins}m`,
      roast: hours > 4 ? 'Touching grass is free, you know.' : 'Deep work or procrastination?',
      severity: hours > 4 ? 'major' : 'moderate',
      color: '#bdb7fc',
    });
  }

  // Sort by severity
  const severityOrder = { major: 0, moderate: 1, minor: 2 };
  crimes.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Take top 4
  const displayCrimes = crimes.slice(0, 4);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'major': return '!!!';
      case 'moderate': return '!!';
      default: return '!';
    }
  };

  return (
    <SlideLayout className="relative">
        {/* Header */}
        <motion.div
          className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          YOUR CODING CRIMES
        </motion.div>

        {/* Crime cards grid - warm styling */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {displayCrimes.map((crime, index) => (
            <motion.div
              key={crime.title}
              className="relative bg-cream/80 border rounded-xl p-4 overflow-hidden"
              style={{
                borderColor: `${crime.color}40`,
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: 0.5 + index * 0.15,
                type: 'spring',
                stiffness: 200,
              }}
            >
              {/* Subtle glow accent */}
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: crime.color }}
              />

              <div className="flex items-start gap-3 pl-2">
                {/* Severity indicator */}
                <div
                  className="text-xs font-mono font-bold mt-1"
                  style={{ color: crime.color }}
                >
                  {getSeverityIcon(crime.severity)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-dark/80 text-xs">{crime.title}</div>
                  <div className="text-dark font-black text-2xl mt-0.5">{crime.value}</div>
                  <div className="text-sunset-accent text-xs mt-2 italic line-clamp-2">
                    {crime.roast}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary */}
        <motion.div
          className="leading-[1.65] mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
        >
          <div className="text-dark/70 text-xs mb-1">Most egregious offense:</div>
          {displayCrimes[0] && (
            <div className="text-dark text-sm font-semibold">
              {displayCrimes[0].title}
              <span className="text-dark/80 ml-2">({displayCrimes[0].value})</span>
            </div>
          )}
        </motion.div>

        {/* Floating indicators */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {displayCrimes.slice(0, 3).map((crime, i) => (
            <motion.div
              key={`float-${crime.title}`}
              className="absolute text-lg font-mono font-bold"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                color: `${crime.color}40`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {getSeverityIcon(crime.severity)}
            </motion.div>
          ))}
        </div>
    </SlideLayout>
  );
}
