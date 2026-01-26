import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';

// Initialize Redis if environment variables are set
// Supports both Vercel KV (KV_REST_API_*) and Upstash (UPSTASH_REDIS_REST_*) naming
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

// In-memory fallback for local development
const inMemoryBundles: Map<string, string> = new Map();

// Generate a short ID (8 characters, URL-safe)
function generateId(): string {
  const bytes = randomBytes(6);
  return bytes.toString('base64url').slice(0, 8);
}

// 1 year TTL in seconds
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

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
    const bundle = req.body;

    if (!bundle || !bundle.stats) {
      return res.status(400).json({ error: 'Invalid bundle: missing stats' });
    }

    const id = generateId();
    const bundleJson = JSON.stringify(bundle);

    if (redis) {
      // Store in Redis with 1-year TTL
      await redis.set(`vibes:${id}`, bundleJson, { ex: ONE_YEAR_SECONDS });
    } else {
      // Fallback to in-memory storage for local development
      inMemoryBundles.set(id, bundleJson);

      // Limit in-memory storage to 1000 entries
      if (inMemoryBundles.size > 1000) {
        const firstKey = inMemoryBundles.keys().next().value;
        if (firstKey) inMemoryBundles.delete(firstKey);
      }
    }

    return res.status(200).json({ id });
  } catch (error) {
    console.error('Error storing bundle:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
