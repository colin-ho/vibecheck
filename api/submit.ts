import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Initialize Redis if environment variables are set
// Supports both Vercel KV (KV_REST_API_*) and Upstash (UPSTASH_REDIS_REST_*) naming
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

// In-memory fallback for local development
const inMemoryBundles: Array<{
  timestamp: number;
  stats: {
    totalSessions: number;
    totalTokens: number;
    toolCount: number;
    longestSession: number;
    nightCoding: number;
    cacheRate: number;
  };
}> = [];

interface AnonymousBundle {
  stats: {
    totalSessions: number;
    totalMessages: number;
    totalTokens: {
      input: number;
      output: number;
      cached: number;
    };
    totalToolCalls: number;
    toolUsage: Record<string, number>;
    modelUsage: Record<string, number>;
    hourCounts: number[];
    peakHour: number;
    longestSessionMinutes: number;
    projectCount: number;
    daysActive: number;
  };
  personaId: string;
  traits: string[];
  promptingStyle: string;
  communicationTone: string;
  funFacts: string[];
  generatedAt: string;
}

function computePercentile(value: number, allValues: number[]): number {
  if (allValues.length === 0) return 50;
  const sorted = [...allValues].sort((a, b) => a - b);
  const below = sorted.filter(v => v < value).length;
  return Math.round(100 - (below / sorted.length) * 100);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const bundle: AnonymousBundle = req.body;

    if (!bundle.stats) {
      return res.status(400).json({ error: 'Invalid bundle: missing stats' });
    }

    // Extract metrics for percentile computation
    const totalTokens = bundle.stats.totalTokens.input + bundle.stats.totalTokens.output;
    const toolCount = Object.keys(bundle.stats.toolUsage).length;
    const cacheRate = bundle.stats.totalTokens.cached / Math.max(bundle.stats.totalTokens.input, 1);

    // Night hours calculation
    const nightHours = [22, 23, 0, 1, 2, 3, 4];
    const nightSessions = nightHours.reduce((sum, h) => sum + (bundle.stats.hourCounts[h] || 0), 0);
    const totalHourSessions = bundle.stats.hourCounts.reduce((a, b) => a + b, 0);
    const nightPercentage = nightSessions / Math.max(totalHourSessions, 1);

    // Store anonymous stats
    const bundleData = {
      timestamp: Date.now(),
      stats: {
        totalSessions: bundle.stats.totalSessions,
        totalTokens,
        toolCount,
        longestSession: bundle.stats.longestSessionMinutes,
        nightCoding: nightPercentage,
        cacheRate,
      },
    };

    let totalWraps: number;

    if (redis) {
      // Use Redis for persistent storage
      const bundleKey = `bundle:${Date.now()}:${Math.random().toString(36).slice(2)}`;
      await redis.set(bundleKey, JSON.stringify(bundleData), { ex: 60 * 60 * 24 * 365 }); // 1 year TTL
      await redis.lpush('bundles:recent', bundleKey);
      await redis.ltrim('bundles:recent', 0, 9999); // Keep last 10000

      // Increment global counter
      totalWraps = await redis.incr('stats:totalWraps');

      // Track persona popularity
      if (bundle.personaId) {
        await redis.zincrby('stats:personas', 1, bundle.personaId);
      }

      // Store individual metrics in sorted sets for percentile computation
      await redis.zadd('metrics:tokens', { score: totalTokens, member: bundleKey });
      await redis.zadd('metrics:tools', { score: toolCount, member: bundleKey });
      await redis.zadd('metrics:night', { score: nightPercentage, member: bundleKey });
      await redis.zadd('metrics:sessions', { score: bundle.stats.longestSessionMinutes, member: bundleKey });
      await redis.zadd('metrics:cache', { score: cacheRate, member: bundleKey });
      await redis.zadd('metrics:totalSessions', { score: bundle.stats.totalSessions, member: bundleKey });

      // Get percentiles using sorted set rank
      const tokenRank = await redis.zrank('metrics:tokens', bundleKey) || 0;
      const tokenTotal = await redis.zcard('metrics:tokens');
      const toolRank = await redis.zrank('metrics:tools', bundleKey) || 0;
      const toolTotal = await redis.zcard('metrics:tools');
      const nightRank = await redis.zrank('metrics:night', bundleKey) || 0;
      const nightTotal = await redis.zcard('metrics:night');
      const sessionRank = await redis.zrank('metrics:sessions', bundleKey) || 0;
      const sessionTotal = await redis.zcard('metrics:sessions');
      const cacheRank = await redis.zrank('metrics:cache', bundleKey) || 0;
      const cacheTotal = await redis.zcard('metrics:cache');
      const totalSessionsRank = await redis.zrank('metrics:totalSessions', bundleKey) || 0;
      const totalSessionsTotal = await redis.zcard('metrics:totalSessions');

      const percentiles = {
        tokenUsage: Math.round(100 - (tokenRank / Math.max(tokenTotal, 1)) * 100),
        toolDiversity: Math.round(100 - (toolRank / Math.max(toolTotal, 1)) * 100),
        nightCoding: Math.round(100 - (nightRank / Math.max(nightTotal, 1)) * 100),
        sessionLength: Math.round(100 - (sessionRank / Math.max(sessionTotal, 1)) * 100),
        cacheEfficiency: Math.round(100 - (cacheRank / Math.max(cacheTotal, 1)) * 100),
        totalSessions: Math.round(100 - (totalSessionsRank / Math.max(totalSessionsTotal, 1)) * 100),
      };

      return res.status(200).json({
        success: true,
        percentiles,
        totalWraps,
      });
    }

    // Fallback to in-memory storage
    inMemoryBundles.push(bundleData);

    // Keep only last 10000 entries
    if (inMemoryBundles.length > 10000) {
      inMemoryBundles.shift();
    }

    // Compute percentiles against all stored data
    const allTokens = inMemoryBundles.map(b => b.stats.totalTokens);
    const allTools = inMemoryBundles.map(b => b.stats.toolCount);
    const allNight = inMemoryBundles.map(b => b.stats.nightCoding);
    const allSessions = inMemoryBundles.map(b => b.stats.longestSession);
    const allCache = inMemoryBundles.map(b => b.stats.cacheRate);
    const allTotalSessions = inMemoryBundles.map(b => b.stats.totalSessions);

    const percentiles = {
      tokenUsage: computePercentile(totalTokens, allTokens),
      toolDiversity: computePercentile(toolCount, allTools),
      nightCoding: computePercentile(nightPercentage, allNight),
      sessionLength: computePercentile(bundle.stats.longestSessionMinutes, allSessions),
      cacheEfficiency: computePercentile(cacheRate, allCache),
      totalSessions: computePercentile(bundle.stats.totalSessions, allTotalSessions),
    };

    return res.status(200).json({
      success: true,
      percentiles,
      totalWraps: inMemoryBundles.length,
    });
  } catch (error) {
    console.error('Error processing bundle:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
