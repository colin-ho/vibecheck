import { forwardRef } from 'react';
import { UsageData } from '../data/types';

interface ShareCardProps {
  data: UsageData;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ data }, ref) => {
  const { stats, persona, percentiles } = data;

  const totalTokens = stats.totalTokens.input + stats.totalTokens.output;
  const totalHours = Math.round((stats.totalSessions * 45) / 60); // Estimate 45 min avg session

  // Format large numbers
  const formatNumber = (n: number): string => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const topTool = Object.entries(stats.toolUsage).sort((a, b) => b[1] - a[1])[0];
  const topModel = Object.entries(stats.modelUsage).sort((a, b) => b[1] - a[1])[0];

  return (
    <div
      ref={ref}
      className="w-[1200px] h-[675px] p-12 flex flex-col justify-between font-sans"
      style={{
        background: persona.gradient,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-white/60 text-sm font-medium tracking-widest uppercase">
            VibeChecked 2024
          </div>
        </div>
        <div className="text-4xl">{persona.icon}</div>
      </div>

      {/* Persona */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-6xl font-black text-white tracking-tight">
          {persona.name}
        </div>
        <div className="text-2xl text-white/80 mt-2 font-medium">
          {persona.tagline}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-8">
        <div>
          <div className="text-4xl font-bold text-white">
            {formatNumber(totalTokens)}
          </div>
          <div className="text-white/60 text-sm">tokens processed</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-white">
            {stats.totalSessions}
          </div>
          <div className="text-white/60 text-sm">sessions</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-white">
            {totalHours}h
          </div>
          <div className="text-white/60 text-sm">pair programming</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="flex gap-6 mt-6 text-sm">
        <div className="bg-black/20 px-4 py-2 rounded-full">
          <span className="text-white/60">Top tool:</span>{' '}
          <span className="text-white font-medium">{topTool?.[0] || 'N/A'}</span>
        </div>
        <div className="bg-black/20 px-4 py-2 rounded-full">
          <span className="text-white/60">Peak hour:</span>{' '}
          <span className="text-white font-medium">{stats.peakHour}:00</span>
        </div>
        <div className="bg-black/20 px-4 py-2 rounded-full">
          <span className="text-white/60">Main model:</span>{' '}
          <span className="text-white font-medium capitalize">{topModel?.[0] || 'N/A'}</span>
        </div>
        {percentiles.tokenUsage <= 10 && (
          <div className="bg-white/20 px-4 py-2 rounded-full">
            <span className="text-white font-medium">Top {percentiles.tokenUsage}% token user</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
        <div className="text-white/70 text-xs">
          howsyourvibecoding.vercel.app
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <span>Made with</span>
          <span className="text-brand-red">♥</span>
          <span>and Claude</span>
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
