import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') || '50';
    const page = searchParams.get('page') || '0';
    const name = searchParams.get('name');
    const typeId = searchParams.get('typeId');
    
    console.log('API Route - Received params:', { limit, page, name, typeId });
    
    // Build the query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit);
    queryParams.append('page', page);
    
    if (name) {
      queryParams.append('name', name);
    }
    
    if (typeId) {
      queryParams.append('typeId', typeId);
    }
    
    // Get types from the query string (they might be multiple)
    const types = searchParams.getAll('types');
    if (types.length > 0) {
      types.forEach(type => queryParams.append('types', type));
    }
    
    const url = `https://nestjs-pokedex-api.vercel.app/pokemons?${queryParams.toString()}`;
    console.log('API Route - Fetching from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log('API Route - Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Route - Received data length:', Array.isArray(data) ? data.length : 'Not an array');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon list', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
