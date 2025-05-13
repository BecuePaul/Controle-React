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

  // Get gradient based on Pokemon type
  const getTypeGradient = (typeName: string): string => {
    const typeGradients: Record<string, string> = {
      normal: 'from-gray-200 to-gray-400',
      fire: 'from-red-300 to-orange-500',
      water: 'from-blue-300 to-blue-500',
      electric: 'from-yellow-200 to-yellow-400',
      grass: 'from-green-300 to-green-500',
      ice: 'from-blue-100 to-blue-300',
      fighting: 'from-red-400 to-red-700',
      poison: 'from-purple-300 to-purple-500',
      ground: 'from-yellow-300 to-yellow-600',
      flying: 'from-indigo-200 to-indigo-400',
      psychic: 'from-pink-300 to-pink-500',
      bug: 'from-lime-300 to-lime-500',
      rock: 'from-yellow-400 to-yellow-700',
      ghost: 'from-purple-400 to-purple-700',
      dragon: 'from-indigo-400 to-indigo-600',
      dark: 'from-gray-500 to-gray-700',
      steel: 'from-gray-300 to-gray-500',
      fairy: 'from-pink-200 to-pink-400',
    };
  
    return typeGradients[typeName?.toLowerCase()] || 'from-gray-200 to-gray-400';
  };

  return (
    <div>
      {/* Back button */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Pokédex
        </Link>
      </div>
      
      {/* Pokemon header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100 dark:border-gray-700 relative">
        {/* Background gradient based on Pokemon type */}
        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${getTypeGradient(pokemon.types?.[0]?.name || 'normal')}`}></div>
        
        {/* Pokemon ID badge */}
        <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-mono font-bold shadow-sm">
          #{pokemon.pokedexId.toString().padStart(3, '0')}
        </div>
        
        <div className="p-8 sm:p-10 md:flex relative">
          <div className="md:w-1/3 flex justify-center mb-8 md:mb-0">
            <div className="relative w-64 h-64 transform transition-all duration-500 hover:scale-110">
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 rounded-full blur-xl transition-opacity duration-700"></div>
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-10">
            <h1 className="text-4xl font-bold capitalize mb-4">{pokemon.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {pokemon.types && pokemon.types.map((type) => (
                <div 
                  key={type.id}
                  className="px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm"
                  style={{
                    backgroundColor: `var(--${type.name.toLowerCase()}-color, #A8A878)`,
                    color: 'white'
                  }}
                >
                  {type.image && (
                    <Image 
                      src={type.image} 
                      alt={type.name} 
                      width={20} 
                      height={20} 
                    />
                  )}
                  <span className="capitalize font-medium">{type.name}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Height</p>
                <p className="font-bold text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  0.7 m
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Weight</p>
                <p className="font-bold text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  6.9 kg
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Generation</p>
                <p className="font-bold text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {pokemon.generation || "I"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pokemon stats */}
      <div className="mb-8">
        <PokemonStats pokemon={pokemon} />
      </div>
      
      {/* Pokemon evolutions */}
      <div className="mb-8">
        <PokemonEvolutions pokemon={pokemon} />
      </div>
    </div>
  );
}
