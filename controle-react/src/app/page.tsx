import { Pokemon } from "@/types/pokemon";
import PokemonList from "@/components/PokemonList";

// Server component - fetches data on the server
async function getPokemons() {
  try {
    const response = await fetch('https://nestjs-pokedex-api.vercel.app/pokemons?limit=50', {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.status}`);
    }
    
    return await response.json() as Pokemon[];
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    return [];
  }
}

export default async function Home() {
  const initialPokemons = await getPokemons();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Pokédex</h1>
      
      {/* Pass the server-fetched pokemons to the client component */}
      <PokemonList initialPokemons={initialPokemons} />
    </div>
  );
}
