import { useState, useEffect } from 'react';
import { StoryContainer } from './stories/StoryContainer';
import { decodeUrlData } from './data/decoder';
import { WrappedData } from './data/types';

function LoadingScreen() {
  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Terminal window */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="font-mono text-sm">
            <p className="text-gray-500">$ claude --wrapped</p>
            <p className="text-terminal-green mt-2">
              Loading your coding journey
              <span className="cursor-blink">▌</span>
            </p>
          </div>
        </div>
      </div>

      {/* Loading dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8">
      <div className="bg-gray-900 rounded-lg border border-red-500/30 p-6 max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="font-mono text-sm">
          <p className="text-red-400">Error loading wrapped data</p>
          <p className="text-gray-500 mt-2 text-xs">{error}</p>
        </div>
      </div>

      <a
        href="/"
        className="mt-6 text-terminal-green hover:underline font-mono text-sm"
      >
        Try with demo data →
      </a>
    </div>
  );
}

function App() {
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const wrappedData = await decodeUrlData();
        setData(wrappedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    // Small delay for loading animation
    setTimeout(loadData, 1000);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !data) {
    return <ErrorScreen error={error || 'Unknown error'} />;
  }

  return <StoryContainer data={data} />;
}

export default App;
