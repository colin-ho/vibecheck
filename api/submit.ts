import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from './_supabase.js';

const supabase = getSupabase();

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

    if (supabase) {
      // Generate a unique ID for the bundle_metrics row
      const id = `${Date.now()}:${Math.random().toString(36).slice(2)}`;

      // Insert metrics row
      const { error: insertError } = await supabase
        .from('bundle_metrics')
        .insert({
          id,
          total_sessions: bundle.stats.totalSessions,
          total_tokens: totalTokens,
          tool_count: toolCount,
          longest_session: bundle.stats.longestSessionMinutes,
          night_coding: nightPercentage,
          cache_rate: cacheRate,
          persona_id: bundle.personaId || null,
        });

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Increment total wraps and compute percentiles in parallel
      const [wrapsResult, percentilesResult] = await Promise.all([
        supabase.rpc('increment_total_wraps'),
        supabase.rpc('compute_percentiles', {
          p_total_tokens: totalTokens,
          p_tool_count: toolCount,
          p_night_coding: nightPercentage,
          p_longest_session: bundle.stats.longestSessionMinutes,
          p_cache_rate: cacheRate,
          p_total_sessions: bundle.stats.totalSessions,
        }),
      ]);

      const totalWraps = wrapsResult.data ?? 0;
      const p = percentilesResult.data?.[0];

      const percentiles = {
        tokenUsage: p?.token_usage ?? 50,
        toolDiversity: p?.tool_diversity ?? 50,
        nightCoding: p?.night_coding ?? 50,
        sessionLength: p?.session_length ?? 50,
        cacheEfficiency: p?.cache_efficiency ?? 50,
        totalSessions: p?.total_sessions ?? 50,
      };

      return res.status(200).json({
        success: true,
        percentiles,
        totalWraps,
      });
    }

    // Fallback to in-memory storage
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
