import { useState, useEffect } from 'react'
import { StoryContainer } from '../stories/StoryContainer'
import { decodeUrlData } from '../data/decoder'
import { UsageData } from '../data/types'
import {
	mockData,
	generateNightOwlMockData,
	generatePoliteMockData,
	generateEssayWriterMockData,
} from '../data/mockData'

function LoadingScreen() {
	return (
		<div
			className="w-full h-full flex flex-col items-center justify-center"
			style={{
				background: 'linear-gradient(135deg, #FFF8F0 0%, #FFCBA4 50%, #FFB08A 100%)',
			}}
		>
			<div className="relative">
				{/* Terminal window - warm styling */}
				<div className="bg-[#FFE8D6] rounded-lg border border-[#3b110c]/10 p-6 max-w-md">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-3 h-3 rounded-full bg-[#da1c1c]" />
						<div className="w-3 h-3 rounded-full bg-[#dd5013]" />
						<div className="w-3 h-3 rounded-full bg-[#bdb7fc]" />
					</div>
					<div className="font-mono text-sm">
						<p className="text-[#3b110c]/50">$ claude --vibes</p>
						<p className="text-[#dd5013] mt-2">
							Loading your coding journey
							<span className="cursor-blink">|</span>
						</p>
					</div>
				</div>
			</div>

			{/* Loading dots */}
			<div className="flex gap-2 mt-8">
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						className="w-2 h-2 rounded-full bg-[#dd5013] animate-pulse"
						style={{ animationDelay: `${i * 0.2}s` }}
					/>
				))}
			</div>
		</div>
	)
}

function ErrorScreen({ error }: { error: string }) {
	return (
		<div
			className="w-full h-full flex flex-col items-center justify-center p-8"
			style={{
				background: 'linear-gradient(135deg, #FFF8F0 0%, #FFCBA4 50%, #FFB08A 100%)',
			}}
		>
			<div className="bg-[#FFE8D6] rounded-lg border border-[#da1c1c]/30 p-6 max-w-md">
				<div className="flex items-center gap-2 mb-4">
					<div className="w-3 h-3 rounded-full bg-[#da1c1c]" />
					<div className="w-3 h-3 rounded-full bg-[#dd5013]" />
					<div className="w-3 h-3 rounded-full bg-[#bdb7fc]" />
				</div>
				<div className="font-mono text-sm">
					<p className="text-[#da1c1c]">Error loading usage data</p>
					<p className="text-[#3b110c]/50 mt-2 text-xs">{error}</p>
				</div>
			</div>

			<a href="/" className="mt-6 text-[#dd5013] hover:underline font-mono text-sm">
				Back to home
			</a>
		</div>
	)
}

export type SampleId = 'default' | 'night_owl' | 'polite' | 'essay_writer'

interface StatsPageProps {
	sampleId?: SampleId
}

function getSampleData(sampleId: SampleId): UsageData {
	let data: UsageData

	switch (sampleId) {
		case 'night_owl':
			data = generateNightOwlMockData()
			break
		case 'polite':
			data = generatePoliteMockData()
			break
		case 'essay_writer':
			data = generateEssayWriterMockData()
			break
		case 'default':
		default:
			data = mockData
			break
	}

	// Validate data has required fields, fall back to mockData if invalid
	if (!data.stats || !data.persona || !data.percentiles) {
		return mockData
	}

	return data
}

export function StatsPage({ sampleId }: StatsPageProps) {
	const [data, setData] = useState<UsageData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function loadData() {
			try {
				let usageData: UsageData

				if (sampleId) {
					// Use sample data
					usageData = getSampleData(sampleId)
				} else {
					// Decode from URL param
					usageData = await decodeUrlData()
				}

				setData(usageData)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load data')
			} finally {
				setLoading(false)
			}
		}

		// Small delay for loading animation
		setTimeout(loadData, 1000)
	}, [sampleId])

	if (loading) {
		return <LoadingScreen />
	}

	if (error || !data) {
		return <ErrorScreen error={error || 'Unknown error'} />
	}

	return <StoryContainer data={data} />
}
