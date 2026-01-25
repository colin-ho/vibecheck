import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorySlideProps } from '../../data/types';
import { PulseRings } from '../../components/viz/RadialBurst';

export function PersonaStory({ data, isActive }: StorySlideProps) {
  const { persona, roastEvidence, wordAnalysis, quirks } = data;
  const [revealed, setRevealed] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  useEffect(() => {
    if (isActive) {
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

  // Build dynamic evidence
  const buildEvidence = (): string[] => {
    const evidence: string[] = [];

    if (persona.evidence && persona.evidence.length > 0) {
      return persona.evidence;
    }

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

    if (evidence.length === 0) {
      evidence.push('Your coding patterns don\'t lie');
      evidence.push('The data speaks for itself');
    }

    return evidence.slice(0, 3);
  };

  const evidenceLines = buildEvidence();

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Background transition with persona gradient */}
      <motion.div
        className="absolute inset-0"
        style={{ background: persona.gradient }}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.4 }}
      />

      {/* Screen flash on reveal - warm cream */}
      <AnimatePresence>
        {revealed && !showCard && (
          <motion.div
            className="absolute inset-0 bg-cream"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-dvh h-dvh w-full p-[clamp(2rem,5vw,4rem)] pb-[clamp(3rem,7vw,5.5rem)] pt-[clamp(3rem,7vw,5.5rem)] flex flex-col items-center justify-center text-center gap-[clamp(0.75rem,2.5vw,1.75rem)] max-w-6xl mx-auto overflow-y-auto relative z-10">
        {/* Pre-reveal state */}
        <AnimatePresence>
          {!revealed && (
            <motion.div
              className="flex flex-col items-center justify-center"
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/70 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
              >
                AND YOUR PERSONA IS...
              </motion.div>

              {/* Loading pulse rings - lavender */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
              >
                <PulseRings color="#bdb7fc" size={120} rings={3} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed persona card */}
        <AnimatePresence>
          {showCard && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                duration: 1,
              }}
            >
            {/* Icon */}
            <motion.div
              className="text-7xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {persona.icon}
            </motion.div>

            {/* Persona card - warm styling */}
            <motion.div
              className="relative bg-cream/80 backdrop-blur-xl rounded-2xl p-6 max-w-sm text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-2xl -z-10"
                style={{
                  background: `linear-gradient(135deg, ${persona.color}, transparent, ${persona.color})`,
                  padding: '1px',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Category badge */}
              <motion.div
                className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-widest mb-3 bg-dark/10 text-dark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {persona.category}
              </motion.div>

              {/* Persona name */}
              <motion.h1
                className="text-3xl md:text-4xl font-black text-dark tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {persona.name}
              </motion.h1>

              {/* Tagline */}
              <motion.p
                className="leading-[1.65] text-base text-dark/80 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {persona.tagline}
              </motion.p>

              {/* Description */}
              <motion.p
                className="leading-[1.65] text-dark/60 mt-3 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {persona.description}
              </motion.p>
            </motion.div>

            {/* Evidence section - timeline style */}
            {showEvidence && persona.category === 'roast' && (
              <motion.div
                className="mt-5 w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-dark/80 text-xs uppercase tracking-wider mb-3 text-center">
                  Why you got this:
                </div>
                <div className="space-y-2">
                  {evidenceLines.map((line, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.15 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-sunset-accent" />
                      <span className="text-dark/70">{line}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Traits - horizontal scrolling pills */}
            <motion.div
              className="flex gap-2 mt-5 flex-wrap justify-center max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {data.traits.map((trait, index) => (
                <motion.span
                  key={trait}
                  className="px-3 py-1 rounded-full text-xs bg-dark/10 text-dark/70"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.08 }}
                >
                  {trait}
                </motion.span>
              ))}
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warm particle burst on reveal */}
      {revealed && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: persona.color,
                left: '50%',
                top: '50%',
              }}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0.5],
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
              }}
              transition={{
                duration: 1.8,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
