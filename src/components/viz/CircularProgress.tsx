import { motion } from 'framer-motion';

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  glowIntensity?: 'none' | 'low' | 'medium' | 'high';
  label?: React.ReactNode;
  animate?: boolean;
  delay?: number;
  showPercentage?: boolean;
  pulseGlow?: boolean;
}

const glowStyles = {
  none: '',
  low: '0 0 10px',
  medium: '0 0 20px',
  high: '0 0 30px',
};

export function CircularProgress({
  value,
  max = 100,
  size = 160,
  strokeWidth = 12,
  color = '#dd5013',
  backgroundColor = 'rgba(59, 17, 12, 0.1)',
  glowIntensity = 'medium',
  label,
  animate = true,
  delay = 0,
  showPercentage = true,
  pulseGlow = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full -rotate-90"
      >
        {/* Glow filter */}
        <defs>
          <filter id={`glow-${color.replace('#', '')}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`progress-gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : undefined}
          animate={{ strokeDashoffset }}
          transition={{
            delay,
            duration: 1.5,
            ease: 'easeOut',
          }}
          style={{
            filter: glowIntensity !== 'none' ? `drop-shadow(${glowStyles[glowIntensity]} ${color}80)` : undefined,
          }}
        />

        {/* Pulse glow effect */}
        {pulseGlow && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth / 2}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            animate={{
              opacity: [0.5, 0.2, 0.5],
              strokeWidth: [strokeWidth / 2, strokeWidth, strokeWidth / 2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              filter: `drop-shadow(0 0 15px ${color})`,
            }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <motion.div
            className="text-dark font-bold text-3xl"
            initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5, duration: 0.4 }}
          >
            {Math.round(percentage)}%
          </motion.div>
        )}
        {label && (
          <motion.div
            className="text-dark/50 text-xs mt-1"
            initial={animate ? { opacity: 0 } : undefined}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.7 }}
          >
            {label}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Vertical fill gauge variant
interface FillGaugeProps {
  value: number;
  max?: number;
  width?: number;
  height?: number;
  color?: string;
  label?: string;
  animate?: boolean;
  delay?: number;
}

export function FillGauge({
  value,
  max = 100,
  width = 60,
  height = 200,
  color = '#dd5013',
  label,
  animate = true,
  delay = 0,
}: FillGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full overflow-hidden border border-white/10"
        style={{
          width,
          height,
          background: 'rgba(59, 17, 12, 0.05)',
        }}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{
            background: `linear-gradient(to top, ${color}, ${color}80)`,
            boxShadow: `0 0 20px ${color}60, inset 0 0 20px ${color}30`,
          }}
          initial={animate ? { height: 0 } : undefined}
          animate={{ height: `${percentage}%` }}
          transition={{
            delay,
            duration: 1.5,
            ease: 'easeOut',
          }}
        />

        {/* Level markers */}
        {[25, 50, 75].map((level) => (
          <div
            key={level}
            className="absolute left-0 right-0 border-t border-white/10"
            style={{ bottom: `${level}%` }}
          />
        ))}
      </div>
      {label && (
        <div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-cocoa/60 mt-3">{label}</div>
      )}
    </div>
  );
}
