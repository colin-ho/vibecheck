import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorySlideProps } from '../../data/types';

export function PersonaStory({ data, isActive }: StorySlideProps) {
  const { persona, roastEvidence, wordAnalysis, quirks } = data;
  const [revealed, setRevealed] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Start reveal sequence
      const revealTimer = setTimeout(() => setRevealed(true), 1500);
      const cardTimer = setTimeout(() => setShowCard(true), 2000);
      const evidenceTimer = setTimeout(() => setShowEvidence(true), 3500);
      return () => {
        clearTimeout(revealTimer);
        clearTimeout(cardTimer);
        clearTimeout(evidenceTimer);
      };
    } else {
      setRevealed(false);
      setShowCard(false);
      setShowEvidence(false);
    }
  }, [isActive]);

  // Build dynamic evidence based on actual data
  const buildEvidence = (): string[] => {
    const evidence: string[] = [];

    // Use persona's built-in evidence if available
    if (persona.evidence && persona.evidence.length > 0) {
      return persona.evidence;
    }

    // Build evidence from data
    if (roastEvidence?.topWord && roastEvidence.topWordCount > 50) {
      evidence.push(`You said "${roastEvidence.topWord}" ${roastEvidence.topWordCount} times`);
    }

    if (quirks?.lateNightSessions && quirks.lateNightSessions > 20) {
      evidence.push(`${quirks.lateNightSessions} sessions after midnight`);
    }

    if (quirks?.interruptCount && quirks.interruptCount > 5) {
      evidence.push(`Interrupted Claude ${quirks.interruptCount} times`);
    }

    if (wordAnalysis?.politenessScore && wordAnalysis.politenessScore > 60) {
      evidence.push(`Politeness score: ${wordAnalysis.politenessScore}/100`);
    }

    if (wordAnalysis?.swearCount && wordAnalysis.swearCount > 5) {
      evidence.push(`Swore ${wordAnalysis.swearCount} times (we don't judge)`);
    }

    if (data.stats.longestSessionMinutes > 180) {
      const hours = Math.floor(data.stats.longestSessionMinutes / 60);
      evidence.push(`Epic ${hours}+ hour coding session`);
    }

    // Fallback evidence
    if (evidence.length === 0) {
      evidence.push('Your coding patterns don\'t lie');
      evidence.push('The data speaks for itself');
    }

    return evidence.slice(0, 3);
  };

  const evidenceLines = buildEvidence();

  // Sample prompt for the evidence section
  const samplePrompt = roastEvidence?.samplePrompt
    ? `"${roastEvidence.samplePrompt.slice(0, 100)}${roastEvidence.samplePrompt.length > 100 ? '...' : ''}"`
    : null;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: revealed ? persona.gradient : '#0a0a0a' }}
    >
      {/* Background transition */}
      <motion.div
        className="absolute inset-0"
        style={{ background: persona.gradient }}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1 }}
      />

      {/* Pre-reveal state */}
      <AnimatePresence>
        {!revealed && (
          <motion.div
            className="flex flex-col items-center justify-center z-10"
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="text-gray-400 text-lg tracking-widest uppercase mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
            >
              And your persona is...
            </motion.div>

            {/* Loading animation */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full bg-terminal-green"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed persona card */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            className="z-10 flex flex-col items-center px-4"
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              duration: 0.8,
            }}
          >
            {/* Icon */}
            <motion.div
              className="text-8xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {persona.icon}
            </motion.div>

            {/* Persona card */}
            <motion.div
              className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-md text-center border border-white/10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Category badge */}
              <motion.div
                className="inline-block px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {persona.category}
              </motion.div>

              {/* Persona name */}
              <motion.h1
                className="text-4xl md:text-5xl font-black text-white tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {persona.name}
              </motion.h1>

              {/* Tagline */}
              <motion.p
                className="text-lg md:text-xl text-white/80 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {persona.tagline}
              </motion.p>

              {/* Description */}
              <motion.p
                className="text-white/60 mt-4 text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {persona.description}
              </motion.p>
            </motion.div>

            {/* Evidence section - only show for roast personas */}
            {showEvidence && persona.category === 'roast' && (
              <motion.div
                className="mt-6 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                  <div className="text-white/60 text-sm mb-3 uppercase tracking-wider">
                    Why you got this:
                  </div>
                  <ul className="space-y-2">
                    {evidenceLines.map((line, index) => (
                      <motion.li
                        key={index}
                        className="text-white/80 text-sm flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.15 }}
                      >
                        <span className="text-terminal-orange">•</span>
                        {line}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Sample prompt */}
                  {samplePrompt && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="text-white/40 text-xs mb-2">Sample prompt:</div>
                      <div className="text-white/60 text-sm italic font-mono">
                        {samplePrompt}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Traits */}
            <motion.div
              className="flex gap-2 mt-6 flex-wrap justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {data.traits.map((trait, index) => (
                <motion.span
                  key={trait}
                  className="px-3 py-1.5 rounded-full text-sm bg-white/10 text-white/80"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  {trait}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle effects */}
      {revealed && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: persona.color,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
                y: [0, -100],
              }}
              transition={{
                duration: 2,
                delay: 0.5 + Math.random() * 1,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
