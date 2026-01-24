import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: 'default' | 'purple' | 'green' | 'blue' | 'orange' | 'custom';
  customGradient?: string;
  className?: string;
  animate?: boolean;
}

const gradients = {
  default: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
  purple: 'bg-gradient-to-br from-purple-900/50 via-gray-900 to-indigo-900/50',
  green: 'bg-gradient-to-br from-emerald-900/50 via-gray-900 to-teal-900/50',
  blue: 'bg-gradient-to-br from-blue-900/50 via-gray-900 to-cyan-900/50',
  orange: 'bg-gradient-to-br from-orange-900/50 via-gray-900 to-amber-900/50',
  custom: '',
};

export function GradientBackground({
  children,
  variant = 'default',
  customGradient,
  className = '',
  animate = true,
}: GradientBackgroundProps) {
  const bgClass = variant === 'custom' && customGradient ? '' : gradients[variant];

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${bgClass} ${className}`}
      style={variant === 'custom' && customGradient ? { background: customGradient } : undefined}
    >
      {/* Animated gradient orbs */}
      {animate && (
        <>
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 65, 0.4) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 100, 50, 0],
              y: [0, 50, 100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, -80, -40, 0],
              y: [0, -60, -120, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 w-72 h-72 rounded-full blur-3xl opacity-15"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

// Noise overlay for texture
export function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none z-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Scanlines effect
export function Scanlines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 opacity-[0.02]"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
      }}
    />
  );
}
