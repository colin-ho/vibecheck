import pako from 'pako'
import { AnonymousBundle, UsageData, Percentiles } from './types'
import { getPersona, determinePersona } from '../personas/definitions'
import { mockData } from './mockData'

// Decode base64url to regular base64
function base64UrlToBase64(str: string): string {
	let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
	while (base64.length % 4) {
		base64 += '='
	}
	return base64
}

// Fetch bundle from server by ID
async function fetchBundleById(id: string): Promise<AnonymousBundle | null> {
	try {
		const response = await fetch(`/api/bundle/${id}`)
		if (!response.ok) {
			console.error(`Failed to fetch bundle: ${response.status}`)
			return null
		}
		return await response.json()
	} catch (error) {
		console.error('Error fetching bundle:', error)
		return null
	}
}

// Decode the URL parameter into UsageData
export async function decodeUrlData(): Promise<UsageData> {
	const params = new URLSearchParams(window.location.search)

	// Check for short ID first (new format)
	const bundleId = params.get('id')
	if (bundleId) {
		console.log('Loading bundle from server:', bundleId)
		const bundle = await fetchBundleById(bundleId)
		if (bundle) {
			const enriched = await enrichBundle(bundle)
			// Preserve the bundleId for sharing
			return { ...enriched, bundleId }
		}
		console.error('Bundle not found or expired, using mock data')
		return mockData
	}

	// Fall back to legacy encoded data parameter
	const encodedData = params.get('d')
	if (!encodedData) {
		console.log('No data parameter found, using mock data')
		return mockData
	}

	try {
		// Decode base64url
		const base64 = base64UrlToBase64(encodedData)
		const binaryString = atob(base64)
		const bytes = new Uint8Array(binaryString.length)
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i)
		}

		// Decompress
		const decompressed = pako.inflate(bytes, { to: 'string' })
		const bundle: AnonymousBundle = JSON.parse(decompressed)

		// Enrich with server data (or compute locally for now)
		return enrichBundle(bundle)
	} catch (error) {
		console.error('Failed to decode data:', error)
		return mockData
	}
}

// Encode data for URL
export function encodeDataForUrl(bundle: AnonymousBundle): string {
	const json = JSON.stringify(bundle)
	const compressed = pako.deflate(json)
	const binary = String.fromCharCode(...compressed)
	const base64 = btoa(binary)
	// Convert to base64url
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Enrich bundle with percentiles and persona details
async function enrichBundle(bundle: AnonymousBundle): Promise<UsageData> {
	// Try to get percentiles from server
	let percentiles: Percentiles
	try {
		percentiles = await fetchPercentiles(bundle)
	} catch {
		// Fall back to estimated percentiles
		percentiles = estimatePercentiles(bundle)
	}

	// Determine persona if not set - pass enhanced data for better roast detection
	const personaId =
		bundle.personaId ||
		determinePersona({
			stats: bundle.stats,
			traits: bundle.traits,
			insights: bundle.insights,
			quirks: bundle.quirks,
		})
	const persona = getPersona(personaId)

	return {
		...bundle,
		personaId,
		percentiles,
		persona,
	}
}

// Fetch percentiles from server
async function fetchPercentiles(bundle: AnonymousBundle): Promise<Percentiles> {
	const response = await fetch('/api/submit', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bundle),
	})

	if (!response.ok) {
		throw new Error('Failed to fetch percentiles')
	}

	const data = await response.json()
	return data.percentiles
}

// Estimate percentiles locally (fallback)
function estimatePercentiles(bundle: AnonymousBundle): Percentiles {
	const { stats } = bundle
	const totalTokens = stats.totalTokens.input + stats.totalTokens.output
	const cacheRate = stats.totalTokens.cached / Math.max(stats.totalTokens.input, 1)
	const toolCount = Object.keys(stats.toolUsage).length

	// Night hours calculation
	const nightHours = [22, 23, 0, 1, 2, 3, 4]
	const nightSessions = nightHours.reduce((sum, h) => sum + (stats.hourCounts[h] || 0), 0)
	const totalHourSessions = stats.hourCounts.reduce((a, b) => a + b, 0)
	const nightPercentage = nightSessions / Math.max(totalHourSessions, 1)

	// Rough percentile estimates based on typical usage
	return {
		tokenUsage: Math.max(1, Math.min(99, 100 - Math.log10(totalTokens / 1000) * 15)),
		toolDiversity: Math.max(1, Math.min(99, 100 - toolCount * 12)),
		nightCoding: Math.max(1, Math.min(99, 100 - nightPercentage * 200)),
		sessionLength: Math.max(
			1,
			Math.min(99, 100 - Math.log10(stats.longestSessionMinutes / 10) * 20)
		),
		cacheEfficiency: Math.max(1, Math.min(99, 100 - cacheRate * 100)),
		totalSessions: Math.max(1, Math.min(99, 100 - Math.log10(stats.totalSessions / 10) * 20)),
	}
}
