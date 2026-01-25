import { motion } from 'framer-motion';
import { CountUp } from './AnimatedNumber';

interface HeroStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  color?: 'cream' | 'lavender' | 'sunset' | 'red' | 'white' | 'green' | 'cyan' | 'purple' | 'dark';
  glow?: boolean;
  size?: 'md' | 'lg' | 'xl';
  animate?: boolean;
  decimals?: number;
  duration?: number;
  delay?: number;
}

const colorClasses: Record<string, string> = {
  cream: 'text-dark',
  dark: 'text-dark',
  lavender: 'text-lavender',
  sunset: 'text-sunset-accent',
  red: 'text-brand-red',
  white: 'text-dark',
  green: 'text-lavender',
  cyan: 'text-sunset-accent',
  purple: 'text-brand-red',
};

const glowClasses: Record<string, string> = {
  cream: '',
  dark: '',
  lavender: 'glow-lavender',
  sunset: 'glow-sunset',
  red: 'glow-red',
  white: '',
  // Legacy mappings
  green: 'glow-lavender',
  cyan: 'glow-sunset',
  purple: 'glow-red',
};

const sizeClasses = {
  md: 'text-[clamp(3rem,10vw,6rem)] font-black leading-none tracking-tight',
  lg: 'text-7xl md:text-8xl font-black tracking-tightest',
  xl: 'text-[clamp(4rem,15vw,10rem)] font-black leading-none tracking-[-0.03em]',
};

export function HeroStat({
  value,
  suffix = '',
  prefix = '',
  label,
  color = 'cream',
  glow = false,
  size = 'xl',
  animate = true,
  decimals = 0,
  duration = 1.8,
  delay = 0,
}: HeroStatProps) {
  // Ensure value is a valid number
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
    >
      <div className={`${sizeClasses[size]} ${colorClasses[color]} ${glow ? glowClasses[color] : ''}`}>
        {animate ? (
          <CountUp
            end={safeValue}
            suffix={suffix}
            prefix={prefix}
            decimals={decimals}
            duration={duration}
          />
        ) : (
          <>
            {prefix}
            {decimals > 0 ? safeValue.toFixed(decimals) : safeValue.toLocaleString()}
            {suffix}
          </>
        )}
      </div>
      {label && (
        <motion.div
          className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-dark/70 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
}

// Simpler version for inline stats
interface StatBadgeProps {
  value: string | number;
  label: string;
  color?: 'cream' | 'lavender' | 'sunset' | 'red' | 'white' | 'green' | 'cyan' | 'purple' | 'dark';
}

export function StatBadge({ value, label, color = 'cream' }: StatBadgeProps) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-dark/70 mt-1">{label}</div>
    </div>
  );
}
