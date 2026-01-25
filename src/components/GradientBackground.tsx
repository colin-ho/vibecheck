import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: 'minimal' | 'radial';
  className?: string;
  spotlightColor?: string;
  backgroundColor?: string;
}

export function GradientBackground({
  children,
  variant = 'minimal',
  className = '',
  spotlightColor,
  backgroundColor = '#FFF8F0',
}: GradientBackgroundProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={{ backgroundColor }}>
      {/* Spotlight effect */}
      {spotlightColor && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${spotlightColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Radial center glow */}
      {variant === 'radial' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,176,136,0.15) 0%, transparent 50%)',
          }}
        />
      )}

      {/* Animated gradient orbs - warm sunset colors */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, rgba(255,155,106,0.5) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-3xl opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, rgba(255,138,91,0.5) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, -120, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

export function Vignette({ intensity = 0.4 }: { intensity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-20"
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(59, 17, 12, ${intensity * 0.3}) 100%)`,
      }}
    />
  );
}
