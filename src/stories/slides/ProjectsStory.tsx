import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { StorySlideProps } from '../../data/types';
import { HeroStat } from '../../components/HeroStat';
import { SlideLayout } from '../../components/SlideLayout';

export function ProjectsStory({ data, isActive }: StorySlideProps) {
  const { stats } = data;

  const getProjectComment = (count: number): string => {
    if (count > 30) return "A true polyglot developer";
    if (count > 20) return "Project nomad energy";
    if (count > 10) return "Diversified portfolio";
    if (count > 5) return "A few favorite codebases";
    return "Deep focus on what matters";
  };

  // Generate orbital constellation positions
  const orbits = useMemo(() => {
    const projectCount = Math.min(stats.projectCount, 30);
    const points: Array<{ x: number; y: number; size: number; delay: number; orbitIndex: number }> = [];

    // Create 3 orbital rings
    const orbitRadii = [60, 100, 140];

    let pointIndex = 0;
    orbitRadii.forEach((radius, orbitIndex) => {
      const dotsInOrbit = Math.min(Math.ceil(projectCount / 3), 4 + orbitIndex * 2);
      for (let i = 0; i < dotsInOrbit && pointIndex < projectCount; i++) {
        const angle = (i / dotsInOrbit) * Math.PI * 2 + orbitIndex * 0.5;
        points.push({
          x: 150 + Math.cos(angle) * radius,
          y: 150 + Math.sin(angle) * radius,
          size: 8 - orbitIndex * 2,
          delay: pointIndex * 0.08,
          orbitIndex,
        });
        pointIndex++;
      }
    });

    return points;
  }, [stats.projectCount]);

  return (
    <SlideLayout>
        <motion.div
          className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          YOU WORKED ACROSS
        </motion.div>

        {/* Hero stat */}
        {isActive && (
          <HeroStat
            value={stats.projectCount}
            label={stats.projectCount === 1 ? 'PROJECT' : 'PROJECTS'}
            color="cream"
            size="lg"
            delay={0.3}
          />
        )}

        {/* Orbital constellation visualization */}
        <motion.div
          className="relative mt-8"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <svg width={300} height={300} className="overflow-visible">
            {/* Orbital rings (faint) */}
            {[60, 100, 140].map((radius, i) => (
              <motion.circle
                key={radius}
                cx={150}
                cy={150}
                r={radius}
                fill="none"
                stroke="rgba(59, 17, 12, 0.08)"
                strokeWidth={1}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.1 }}
              />
            ))}

            {/* Connection lines (subtle) */}
            {orbits.slice(0, 10).map((point, i) => {
              const nextPoint = orbits[(i + 1) % Math.min(orbits.length, 10)];
              if (!nextPoint) return null;
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={point.x}
                  y1={point.y}
                  x2={nextPoint.x}
                  y2={nextPoint.y}
                  stroke="rgba(189, 183, 252, 0.2)"
                  strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.7 + i * 0.05, duration: 0.3 }}
                />
              );
            })}

            {/* Project dots - warm colors */}
            {orbits.map((point, i) => (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={point.size}
                fill={point.orbitIndex === 0 ? '#bdb7fc' : point.orbitIndex === 1 ? '#dd5013' : '#da1c1c'}
                initial={{ opacity: 0, scale: 0 }}
                animate={isActive ? { opacity: 0.8, scale: 1 } : {}}
                transition={{
                  delay: 1.2 + point.delay,
                  duration: 0.5,
                  type: 'spring',
                }}
                style={{
                  filter: point.orbitIndex === 0 ? 'drop-shadow(0 0 6px rgba(189, 183, 252, 0.5))' : undefined,
                }}
              />
            ))}

            {/* Center glow */}
            <motion.circle
              cx={150}
              cy={150}
              r={20}
              fill="url(#centerGlowWarm)"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <defs>
              <radialGradient id="centerGlowWarm">
                <stop offset="0%" stopColor="rgba(189, 183, 252, 0.4)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>

          {/* Overflow indicator */}
          {stats.projectCount > 30 && (
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-dark/80"
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 2.2 }}
            >
              +{stats.projectCount - 30} more
            </motion.div>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-6 flex gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.4 }}
        >
          <div className="text-center">
            <div className="text-xl font-bold text-lavender">{stats.daysActive}</div>
            <div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-dark/70 mt-1">active days</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-sunset-accent">
              {(stats.totalSessions / Math.max(stats.daysActive, 1)).toFixed(1)}
            </div>
            <div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-dark/70 mt-1">sessions/day</div>
          </div>
        </motion.div>

        {/* Comment */}
        <motion.div
          className="leading-[1.65] mt-6 text-dark/80 text-sm"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.7 }}
        >
          {getProjectComment(stats.projectCount)}
        </motion.div>
    </SlideLayout>
  );
}
