import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from './_supabase.js';

const supabase = getSupabase();

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
    if (supabase) {
      const [wrapsResult, personaResult, sessionsResult] = await Promise.all([
        supabase.from('global_stats').select('total_wraps').eq('id', 1).single(),
        supabase.rpc('get_top_persona'),
        supabase
          .from('bundle_metrics')
          .select('total_sessions')
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      const totalWraps = wrapsResult.data?.total_wraps || 0;
      const topPersona = personaResult.data || 'midnight-architect';

      let avgSessions = 0;
      if (sessionsResult.data && sessionsResult.data.length > 0) {
        const sum = sessionsResult.data.reduce(
          (acc: number, row: { total_sessions: number }) => acc + row.total_sessions,
          0
        );
        avgSessions = Math.round(sum / sessionsResult.data.length);
      }

      return res.status(200).json({
        totalWraps,
        totalTokensProcessed: totalWraps * 500000,
        topPersona,
        avgSessions,
      });
    }

    // Return placeholder stats for demo when no Supabase
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
