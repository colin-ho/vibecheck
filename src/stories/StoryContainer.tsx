import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WrappedData, StorySlideProps } from '../data/types';

import { IntroStory } from './slides/IntroStory';
import { OpeningMemoryStory } from './slides/OpeningMemoryStory';
import { SessionsStory } from './slides/SessionsStory';
import { TimeStory } from './slides/TimeStory';
import { TokensStory } from './slides/TokensStory';
import { CacheStory } from './slides/CacheStory';
import { ToolsStory } from './slides/ToolsStory';
import { TimingStory } from './slides/TimingStory';
import { ModelsStory } from './slides/ModelsStory';
import { ProjectsStory } from './slides/ProjectsStory';
import { WordCloudStory } from './slides/WordCloudStory';
import { ObsessionsStory } from './slides/ObsessionsStory';
import { QuirksStory } from './slides/QuirksStory';
import { PersonaStory } from './slides/PersonaStory';
import { ShareStory } from './slides/ShareStory';

interface StoryContainerProps {
  data: WrappedData;
}

const slides: React.ComponentType<StorySlideProps>[] = [
  IntroStory,
  OpeningMemoryStory,    // NEW: Remember your first prompt
  SessionsStory,
  TimeStory,
  TokensStory,
  CacheStory,
  ToolsStory,
  TimingStory,
  ModelsStory,
  ProjectsStory,
  WordCloudStory,        // NEW: Vocabulary roast
  ObsessionsStory,       // NEW: Topic breakdown
  QuirksStory,           // UPDATED: Behavioral crimes
  PersonaStory,          // UPDATED: With evidence
  ShareStory,
];

export function StoryContainer({ data }: StoryContainerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide]);

  const goToPrevious = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Touch/swipe navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNext, goToPrevious]);

  const CurrentSlideComponent = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-50 progress-bar">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 z-50 text-white/40 text-sm font-mono">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Navigation hints */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 text-white/30 text-xs">
        {currentSlide < slides.length - 1 ? (
          <span>Tap or press → to continue</span>
        ) : (
          <span>Share your wrapped!</span>
        )}
      </div>

      {/* Navigation arrows */}
      {currentSlide > 0 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Previous slide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentSlide < slides.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Next slide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full h-full"
          onClick={goToNext}
        >
          <CurrentSlideComponent
            data={data}
            onNext={goToNext}
            isActive={true}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
