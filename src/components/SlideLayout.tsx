import { ReactNode } from 'react';

interface SlideLayoutProps {
  children: ReactNode;
  className?: string;
}

export function SlideLayout({ children, className = '' }: SlideLayoutProps) {
  return (
    <div className={`min-h-dvh h-dvh w-full p-[clamp(2rem,5vw,4rem)] pb-[clamp(3rem,7vw,5.5rem)] pt-[clamp(3rem,7vw,5.5rem)] flex flex-col items-center justify-center text-center gap-[clamp(0.75rem,2.5vw,1.75rem)] max-w-6xl mx-auto overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}
