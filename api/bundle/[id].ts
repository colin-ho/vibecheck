import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Initialize Redis if environment variables are set
// Supports both Vercel KV (KV_REST_API_*) and Upstash (UPSTASH_REDIS_REST_*) naming
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

// In-memory fallback for local development (shared with store.ts via module cache)
// Note: In production, Redis is used. In dev, this won't persist across restarts.
const inMemoryBundles: Map<string, string> = new Map();

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
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid ID' });
    }

    let bundleJson: string | null = null;

    if (redis) {
      // Retrieve from Redis
      bundleJson = await redis.get<string>(`vibes:${id}`);
    } else {
      // Fallback to in-memory storage
      bundleJson = inMemoryBundles.get(id) || null;
    }

    if (!bundleJson) {
      return res.status(404).json({ error: 'Bundle not found or expired' });
    }

    // Parse and return the bundle
    const bundle = typeof bundleJson === 'string' ? JSON.parse(bundleJson) : bundleJson;
    return res.status(200).json(bundle);
  } catch (error) {
    console.error('Error retrieving bundle:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
