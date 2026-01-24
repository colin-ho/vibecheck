import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { StorySlideProps } from '../../data/types';
import { ShareCard } from '../../components/ShareCard';
import { encodeDataForUrl } from '../../data/decoder';

export function ShareStory({ data, isActive }: StorySlideProps) {
  const { persona, stats } = data;
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const totalTokens = stats.totalTokens.input + stats.totalTokens.output;
  const formatNumber = (n: number): string => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  const handleDownloadImage = async () => {
    if (!shareCardRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `claude-wrapped-${persona.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareTwitter = () => {
    const text = `I'm a ${persona.name}! ${persona.tagline}\n\n${formatNumber(totalTokens)} tokens • ${stats.totalSessions} sessions • ${stats.projectCount} projects\n\nGet your Claude Code Wrapped:`;
    const url = `https://claude-wrapped.dev/?d=${encodeDataForUrl(data)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCopyLink = async () => {
    const url = `https://claude-wrapped.dev/?d=${encodeDataForUrl(data)}`;
    await navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-8 relative overflow-hidden"
      style={{ background: persona.gradient }}
    >
      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
      >
        <h2 className="text-3xl font-bold text-white mb-2">Share Your Wrapped</h2>
        <p className="text-white/60">Let the world know your coding personality</p>
      </motion.div>

      {/* Mini preview card */}
      <motion.div
        className="bg-black/30 backdrop-blur rounded-2xl p-6 max-w-sm w-full mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.2 }}
        onClick={() => setShowPreview(true)}
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{persona.icon}</span>
          <div>
            <div className="text-white font-bold text-xl">{persona.name}</div>
            <div className="text-white/60 text-sm">{persona.tagline}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-white font-bold text-lg">{formatNumber(totalTokens)}</div>
            <div className="text-white/40 text-xs">tokens</div>
          </div>
          <div>
            <div className="text-white font-bold text-lg">{stats.totalSessions}</div>
            <div className="text-white/40 text-xs">sessions</div>
          </div>
          <div>
            <div className="text-white font-bold text-lg">{stats.projectCount}</div>
            <div className="text-white/40 text-xs">projects</div>
          </div>
        </div>
      </motion.div>

      {/* Share buttons */}
      <motion.div
        className="flex flex-col gap-3 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={handleDownloadImage}
          disabled={isGenerating}
          className="flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 px-6 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Image</span>
            </>
          )}
        </button>

        <button
          onClick={handleShareTwitter}
          className="flex items-center justify-center gap-3 bg-[#1DA1F2] text-white font-semibold py-4 px-6 rounded-xl hover:bg-[#1a8cd8] transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share on X</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-3 bg-white/10 text-white font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy Link</span>
        </button>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-8 text-white/40 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <p>Made with ♥ and Claude</p>
        <p className="text-xs mt-1">claude-wrapped.dev</p>
      </motion.div>

      {/* Hidden share card for export */}
      <div className="fixed -left-[9999px] top-0">
        <ShareCard ref={shareCardRef} data={data} />
      </div>

      {/* Preview modal */}
      {showPreview && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            className="max-w-4xl w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ShareCard data={data} />
            <button
              onClick={() => setShowPreview(false)}
              className="mt-4 text-white/60 hover:text-white text-center w-full"
            >
              Click anywhere to close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
