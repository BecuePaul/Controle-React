import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  console.log(`API Route - Fetching Pokemon with ID: ${id}`);
  
  try {
    const url = `https://nestjs-pokedex-api.vercel.app/pokemons/${id}`;
    console.log('API Route - Fetching from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log('API Route - Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Route - Received data:', data ? 'Data received' : 'No data');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching Pokemon with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
