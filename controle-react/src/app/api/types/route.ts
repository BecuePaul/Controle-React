import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('API Route - Fetching Pokemon types');
  
  try {
    const url = 'https://nestjs-pokedex-api.vercel.app/types';
    console.log('API Route - Fetching from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log('API Route - Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon types: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Route - Received data length:', Array.isArray(data) ? data.length : 'Not an array');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Pokemon types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon types', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
