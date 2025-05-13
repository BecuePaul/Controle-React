import { Pokemon, PokemonFilters, PokemonType } from "@/types/pokemon";

/**
 * Builds a URL with query parameters for the Pokemon API
 */
const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  let url = endpoint;
  
  if (params) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

/**
 * Fetches a list of Pokemon based on filters
 */
export const getPokemonList = async (filters: PokemonFilters = {}): Promise<Pokemon[]> => {
  const { page, limit = 50, typeId, types, name } = filters;
  
  const params: Record<string, any> = {
    limit,
    ...(page !== undefined && { page }),
    ...(typeId !== undefined && { typeId }),
    ...(types !== undefined && { types }),
    ...(name !== undefined && { name }),
  };
  
  const url = buildUrl("/api/pokemons", params);
  console.log("Fetching Pokemon list from URL:", url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Received data length:", Array.isArray(data) ? data.length : 'Not an array');
    return data;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw error;
  }
};

/**
 * Fetches a single Pokemon by its Pokedex ID
 */
export const getPokemonById = async (pokedexId: number): Promise<Pokemon> => {
  const url = `/api/pokemons/${pokedexId}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokemon with ID ${pokedexId}:`, error);
    throw error;
  }
};

/**
 * Fetches all Pokemon types
 */
export const getPokemonTypes = async (): Promise<PokemonType[]> => {
  const url = "/api/types";
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon types: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon types:", error);
    throw error;
  }
};
