import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Downloads a meme as an image
 */
export async function downloadMeme(memeCanvasId: string, filename: string = 'my-meme.png') {
  // This function needs to be client-side only
  if (typeof window === 'undefined') return;
  
  // Dynamically import html2canvas to avoid server-side issues
  const html2canvas = (await import('html2canvas')).default;
  const memeCanvas = document.getElementById(memeCanvasId);
  
  if (!memeCanvas) return;
  
  try {
    const canvas = await html2canvas(memeCanvas, {
      allowTaint: true,
      useCORS: true,
      logging: false,
      scale: 2, // Higher quality
    });
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error downloading meme:', error);
  }
}

/**
 * Shares a meme to social media
 */
export async function shareMeme(memeCanvasId: string, platform: 'twitter' | 'facebook' | 'reddit') {
  // This function needs to be client-side only
  if (typeof window === 'undefined') return;
  
  // Dynamically import html2canvas to avoid server-side issues
  const html2canvas = (await import('html2canvas')).default;
  const memeCanvas = document.getElementById(memeCanvasId);
  
  if (!memeCanvas) return;
  
  try {
    // In a real app, you would upload the image to a server and get a shareable URL
    // For this demo, we'll just share the current page URL
    const shareUrl = window.location.href;
    
    let platformUrl = '';
    
    switch (platform) {
      case 'twitter':
        platformUrl = `https://twitter.com/intent/tweet?text=Check out my meme!&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'reddit':
        platformUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=Check out my meme!`;
        break;
    }
    
    if (platformUrl) {
      window.open(platformUrl, '_blank');
    }
  } catch (error) {
    console.error('Error sharing meme:', error);
  }
}

/**
 * Adjusts text stroke width based on font size
 */
export function calculateStrokeWidth(fontSize: number): number {
  // Scale stroke width based on font size
  return Math.max(1, Math.floor(fontSize / 12));
}

/**
 * Generates text shadow CSS for meme text
 */
export function generateTextShadow(strokeWidth: number, color: string = '#000000'): string {
  const shadows = [];
  
  for (let i = 1; i <= strokeWidth; i++) {
    shadows.push(`${i}px ${i}px 0 ${color}`);
    shadows.push(`${-i}px ${-i}px 0 ${color}`);
    shadows.push(`${i}px ${-i}px 0 ${color}`);
    shadows.push(`${-i}px ${i}px 0 ${color}`);
  }
  
  return shadows.join(', ');
}
