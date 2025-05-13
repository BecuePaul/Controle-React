import Image from "next/image";
import Link from "next/link";
import { Pokemon } from "@/types/pokemon";
import PokemonStats from "@/components/PokemonStats";
import PokemonEvolutions from "@/components/PokemonEvolutions";

interface PokemonDetailPageProps {
  params: {
    id: string;
  };
}

// Server component - fetches data on the server
async function getPokemon(id: string) {
  try {
    const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }
    
    return await response.json() as Pokemon;
  } catch (error) {
    console.error(`Error fetching Pokemon with ID ${id}:`, error);
    return null;
  }
}

export default async function PokemonDetailPage(props: PokemonDetailPageProps) {
  // Await the params object before using its properties
  const params = await Promise.resolve(props.params);
  const pokemon = await getPokemon(params.id);

  if (!pokemon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Pokémon not found</span>
        </div>
        <div className="mt-4">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Pokédex
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Pokédex
        </Link>
      </div>
      
      {/* Pokemon header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 sm:p-8 md:flex">
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div className="relative w-64 h-64">
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
              <span className="text-xl text-gray-500 dark:text-gray-400">#{pokemon.pokedexId}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {pokemon.types && pokemon.types.map((type) => (
                <div 
                  key={type.id}
                  className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center gap-2"
                >
                  {type.image && (
                    <Image 
                      src={type.image} 
                      alt={type.name} 
                      width={20} 
                      height={20} 
                    />
                  )}
                  <span className="capitalize">{type.name}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Height</p>
                <p className="font-semibold">0.7 m</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Weight</p>
                <p className="font-semibold">6.9 kg</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Generation</p>
                <p className="font-semibold">{pokemon.generation || "Unknown"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pokemon stats */}
      <div className="mb-6">
        <PokemonStats pokemon={pokemon} />
      </div>
      
      {/* Pokemon evolutions */}
      <div className="mb-6">
        <PokemonEvolutions pokemon={pokemon} />
      </div>
    </div>
  );
}
