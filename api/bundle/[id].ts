import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from '../_supabase.js';

const supabase = getSupabase();

// In-memory fallback for local development (shared with store.ts via module cache)
// Note: In production, Supabase is used. In dev, this won't persist across restarts.
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

    if (supabase) {
      const { data, error } = await supabase
        .from('stored_bundles')
        .select('bundle')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Bundle not found or expired' });
      }

      return res.status(200).json(data.bundle);
    }

    // Fallback to in-memory storage
    const bundleJson = inMemoryBundles.get(id) || null;

    if (!bundleJson) {
      return res.status(404).json({ error: 'Bundle not found or expired' });
    }

    const bundle = JSON.parse(bundleJson);
    return res.status(200).json(bundle);
  } catch (error) {
    console.error('Error retrieving bundle:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
