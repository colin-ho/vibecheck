import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';
import { getSupabase } from './_supabase.js';

const supabase = getSupabase();

// In-memory fallback for local development
const inMemoryBundles: Map<string, string> = new Map();

// Generate a short ID (8 characters, URL-safe)
function generateId(): string {
  const bytes = randomBytes(6);
  return bytes.toString('base64url').slice(0, 8);
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
    const bundle = req.body;

    if (!bundle || !bundle.stats) {
      return res.status(400).json({ error: 'Invalid bundle: missing stats' });
    }

    const id = generateId();

    if (supabase) {
      const { error } = await supabase
        .from('stored_bundles')
        .insert({ id, bundle });

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      // Fallback to in-memory storage for local development
      inMemoryBundles.set(id, JSON.stringify(bundle));

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
