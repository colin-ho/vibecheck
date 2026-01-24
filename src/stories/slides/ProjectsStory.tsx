import { motion } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { GradientBackground } from '../../components/GradientBackground';
import { CountUp } from '../../components/AnimatedNumber';

export function ProjectsStory({ data, isActive }: StorySlideProps) {
  const { stats } = data;

  const getProjectComment = (count: number): { emoji: string; text: string } => {
    if (count > 30) return { emoji: '🌍', text: "A true polyglot developer" };
    if (count > 20) return { emoji: '🗺️', text: "Project nomad energy" };
    if (count > 10) return { emoji: '🎯', text: "Diversified portfolio" };
    if (count > 5) return { emoji: '🏠', text: "A few favorite codebases" };
    return { emoji: '💎', text: "Deep focus on what matters" };
  };

  const projectComment = getProjectComment(stats.projectCount);

  // Visual: project dots arranged in a pattern
  const projectDots = Array.from({ length: Math.min(stats.projectCount, 50) });

  return (
    <GradientBackground variant="green">
      <div className="flex flex-col items-center justify-center h-full px-8">
        <motion.div
          className="text-gray-400 text-lg mb-4 tracking-widest uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          You worked across
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <div className="text-8xl md:text-9xl font-black text-white">
            {isActive && <CountUp end={stats.projectCount} duration={1.5} />}
          </div>
          <div className="text-2xl text-gray-300 mt-2">
            {stats.projectCount === 1 ? 'project' : 'projects'}
          </div>
        </motion.div>

        {/* Project visualization - constellation pattern */}
        <motion.div
          className="mt-12 relative w-80 h-40"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          {projectDots.map((_, i) => {
            // Create a constellation-like pattern
            const angle = (i / projectDots.length) * Math.PI * 2;
            const radius = 40 + (i % 3) * 30;
            const x = 160 + Math.cos(angle + i * 0.1) * radius;
            const y = 80 + Math.sin(angle + i * 0.1) * (radius * 0.5);

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: x,
                  top: y,
                  width: 6 + (i % 4) * 2,
                  height: 6 + (i % 4) * 2,
                  background: `linear-gradient(135deg, #00ff41, #00d4ff)`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isActive ? { opacity: 0.6 + (i % 3) * 0.2, scale: 1 } : {}}
                transition={{
                  delay: 1.2 + i * 0.05,
                  duration: 0.3,
                }}
              />
            );
          })}

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
            {projectDots.slice(0, 10).map((_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              const nextAngle = ((i + 1) / 10) * Math.PI * 2;
              const radius = 40 + (i % 3) * 30;
              const nextRadius = 40 + ((i + 1) % 3) * 30;

              const x1 = 160 + Math.cos(angle + i * 0.1) * radius;
              const y1 = 80 + Math.sin(angle + i * 0.1) * (radius * 0.5);
              const x2 = 160 + Math.cos(nextAngle + (i + 1) * 0.1) * nextRadius;
              const y2 = 80 + Math.sin(nextAngle + (i + 1) * 0.1) * (nextRadius * 0.5);

              return (
                <motion.line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(0, 255, 65, 0.2)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.5 + i * 0.1, duration: 0.5 }}
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Days active */}
        <motion.div
          className="mt-8 flex gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2 }}
        >
          <div className="glass px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-terminal-green">
              {stats.daysActive}
            </div>
            <div className="text-gray-400 text-sm">active days</div>
          </div>
          <div className="glass px-6 py-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-terminal-blue">
              {(stats.totalSessions / Math.max(stats.daysActive, 1)).toFixed(1)}
            </div>
            <div className="text-gray-400 text-sm">sessions/day avg</div>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.3 }}
        >
          <span className="text-4xl">{projectComment.emoji}</span>
          <div className="text-lg text-gray-400 mt-2">{projectComment.text}</div>
        </motion.div>
      </div>
    </GradientBackground>
  );
}
