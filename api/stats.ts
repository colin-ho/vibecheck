import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Initialize Redis if environment variables are set
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (redis) {
      // Get real stats from Redis
      const totalWraps = await redis.get<number>('stats:totalWraps') || 0;

      // Get top persona from leaderboard
      const topPersonas = await redis.zrange<string[]>('stats:personas', 0, 0, { rev: true });
      const topPersona = topPersonas?.[0] || 'midnight-architect';

      // Get average sessions from recent bundles
      const recentKeys = await redis.lrange<string>('bundles:recent', 0, 99);
      let totalSessions = 0;
      let count = 0;

      for (const key of recentKeys || []) {
        const bundle = await redis.get<string>(key);
        if (bundle) {
          const data = typeof bundle === 'string' ? JSON.parse(bundle) : bundle;
          totalSessions += data.stats?.totalSessions || 0;
          count++;
        }
      }

      const avgSessions = count > 0 ? Math.round(totalSessions / count) : 0;

      return res.status(200).json({
        totalWraps,
        totalTokensProcessed: totalWraps * 500000, // Estimated average
        topPersona,
        avgSessions,
      });
    }

    // Return placeholder stats for demo when no Redis
    return res.status(200).json({
      totalWraps: 1234,
      totalTokensProcessed: 5678901234,
      topPersona: 'midnight-architect',
      avgSessions: 150,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
