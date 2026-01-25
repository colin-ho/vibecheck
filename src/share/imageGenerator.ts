import { toPng, toJpeg, toBlob } from 'html-to-image';
import { UsageData } from '../data/types';

export interface ImageOptions {
  quality?: number;
  pixelRatio?: number;
  backgroundColor?: string;
}

const defaultOptions: ImageOptions = {
  quality: 1,
  pixelRatio: 2,
  backgroundColor: '#0a0a0a',
};

/**
 * Generate a PNG image from a DOM element
 */
export async function generatePng(
  element: HTMLElement,
  options: ImageOptions = {}
): Promise<string> {
  const opts = { ...defaultOptions, ...options };

  return toPng(element, {
    quality: opts.quality,
    pixelRatio: opts.pixelRatio,
    backgroundColor: opts.backgroundColor,
    cacheBust: true,
  });
}

/**
 * Generate a JPEG image from a DOM element
 */
export async function generateJpeg(
  element: HTMLElement,
  options: ImageOptions = {}
): Promise<string> {
  const opts = { ...defaultOptions, ...options };

  return toJpeg(element, {
    quality: opts.quality,
    pixelRatio: opts.pixelRatio,
    backgroundColor: opts.backgroundColor,
    cacheBust: true,
  });
}

/**
 * Generate a Blob from a DOM element
 */
export async function generateBlob(
  element: HTMLElement,
  options: ImageOptions = {}
): Promise<Blob | null> {
  const opts = { ...defaultOptions, ...options };

  return toBlob(element, {
    quality: opts.quality,
    pixelRatio: opts.pixelRatio,
    backgroundColor: opts.backgroundColor,
    cacheBust: true,
  });
}

/**
 * Download an image from a data URL
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy an image to clipboard (if supported)
 */
export async function copyImageToClipboard(element: HTMLElement): Promise<boolean> {
  try {
    const blob = await generateBlob(element);
    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    return false;
  }
}

/**
 * Generate a share URL with encoded data
 */
export function generateShareUrl(data: UsageData, baseUrl = 'https://howsyourvibecoding.vercel.app'): string {
  // Import the encoder from decoder module
  // This is a simplified version - the actual encoding happens in decoder.ts
  const params = new URLSearchParams();
  params.set('persona', data.personaId);
  params.set('sessions', data.stats.totalSessions.toString());
  params.set('tokens', (data.stats.totalTokens.input + data.stats.totalTokens.output).toString());

  return `${baseUrl}/?${params.toString()}`;
}

/**
 * Generate Twitter share URL
 */
export function generateTwitterShareUrl(data: UsageData): string {
  const totalTokens = data.stats.totalTokens.input + data.stats.totalTokens.output;
  const formatNumber = (n: number): string => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  const text = `I'm a ${data.persona.name}! ${data.persona.tagline}

${formatNumber(totalTokens)} tokens • ${data.stats.totalSessions} sessions • ${data.stats.projectCount} projects

Get your VibeChecked:`;

  const url = 'https://howsyourvibecoding.vercel.app';

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}
