import { NextRequest, NextResponse } from 'next/server';
import { PexelsResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const perPage = searchParams.get('perPage') || '20';
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }
  
  const apiKey = process.env.PEXELS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Pexels API key is not configured' },
      { status: 500 }
    );
  }
  
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          Authorization: apiKey,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );
    
    if (!response.ok) {
      throw new Error(`Pexels API responded with status: ${response.status}`);
    }
    
    const data: PexelsResponse = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching images from Pexels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
