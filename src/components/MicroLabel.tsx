import { motion } from 'framer-motion';

interface MicroLabelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animate?: boolean;
}

export function MicroLabel({
  children,
  className = '',
  delay = 0,
  animate = true,
}: MicroLabelProps) {
  if (!animate) {
    return (
      <span className={`text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-cocoa/60 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={`text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-cocoa/60 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {children}
    </motion.span>
  );
}

// Section header with micro label style
interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SectionHeader({ children, className = '', delay = 0 }: SectionHeaderProps) {
  return (
    <motion.div
      className={`text-center mb-8 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-dark/50">
        {children}
      </span>
    </motion.div>
  );
}
