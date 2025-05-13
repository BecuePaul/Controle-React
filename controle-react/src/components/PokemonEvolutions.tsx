"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pokemon, PokemonEvolution, PokemonPreEvolution } from "@/types/pokemon";
import { getPokemonById } from "@/services/pokemonService";

interface PokemonEvolutionsProps {
  pokemon: Pokemon;
}

export default function PokemonEvolutions({ pokemon }: PokemonEvolutionsProps) {
  const [evolutionChain, setEvolutionChain] = useState<{
    preEvolutions: Pokemon[];
    current: Pokemon;
    evolutions: Pokemon[];
  }>({
    preEvolutions: [],
    current: pokemon,
    evolutions: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to determine the evolution chain based on the Pokemon's ID
  const determineEvolutionChain = async (currentPokemon: Pokemon) => {
    const preEvolutions: Pokemon[] = [];
    const evolutions: Pokemon[] = [];
    
    // Known evolution chains
    const evolutionChains = [
      // Bulbasaur chain
      { id: 1, chain: [1, 2, 3] },
      // Charmander chain
      { id: 4, chain: [4, 5, 6] },
      // Squirtle chain
      { id: 7, chain: [7, 8, 9] },
      // Add more chains as needed
    ];
    
    // Find the chain that contains the current Pokemon
    const chain = evolutionChains.find(chain => 
      chain.chain.includes(currentPokemon.pokedexId)
    );
    
    if (chain) {
      const currentIndex = chain.chain.indexOf(currentPokemon.pokedexId);
      
      // Get pre-evolutions
      for (let i = 0; i < currentIndex; i++) {
        try {
          const preEvolutionData = await getPokemonById(chain.chain[i]);
          preEvolutions.push(preEvolutionData);
        } catch (err) {
          console.error(`Error fetching pre-evolution with ID ${chain.chain[i]}:`, err);
        }
      }
      
      // Get evolutions
      for (let i = currentIndex + 1; i < chain.chain.length; i++) {
        try {
          const evolutionData = await getPokemonById(chain.chain[i]);
          evolutions.push(evolutionData);
        } catch (err) {
          console.error(`Error fetching evolution with ID ${chain.chain[i]}:`, err);
        }
      }
    } else {
      // Fallback to API data if the chain is not predefined
      // Fetch pre-evolution if exists
      const preEvolution = currentPokemon.preEvolution || currentPokemon.apiPreEvolution;
      
      console.log("Current Pokemon:", currentPokemon.name, "ID:", currentPokemon.pokedexId);
      console.log("Pre-evolution data:", preEvolution);
      
      if (preEvolution) {
        try {
          const preEvoId = preEvolution.pokedexId || preEvolution.pokedexIdd;
          console.log("Pre-evolution ID:", preEvoId);
          
          if (preEvoId) {
            const preEvolutionData = await getPokemonById(preEvoId);
            console.log("Fetched pre-evolution:", preEvolutionData.name);
            preEvolutions.push(preEvolutionData);
            
            // Check if there's an earlier pre-evolution
            const earlierPreEvo = preEvolutionData.preEvolution || preEvolutionData.apiPreEvolution;
            console.log("Earlier pre-evolution data:", earlierPreEvo);
            
            if (earlierPreEvo) {
              const earlierPreEvoId = earlierPreEvo.pokedexId || earlierPreEvo.pokedexIdd;
              console.log("Earlier pre-evolution ID:", earlierPreEvoId);
              
              if (earlierPreEvoId) {
                const earlierPreEvolution = await getPokemonById(earlierPreEvoId);
                console.log("Fetched earlier pre-evolution:", earlierPreEvolution.name);
                preEvolutions.unshift(earlierPreEvolution);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching pre-evolution:", err);
        }
      }
      
      // Fetch evolutions
      const evolutionsArray = currentPokemon.evolutions || currentPokemon.apiEvolutions;
      
      if (evolutionsArray && evolutionsArray.length > 0) {
        await Promise.all(
          evolutionsArray.map(async (evolution) => {
            try {
              const evolutionData = await getPokemonById(evolution.pokedexId);
              evolutions.push(evolutionData);
              
              // Check if there are further evolutions
              const furtherEvolutions = evolutionData.evolutions || evolutionData.apiEvolutions;
              if (furtherEvolutions && furtherEvolutions.length > 0) {
                await Promise.all(
                  furtherEvolutions.map(async (furtherEvolution) => {
                    try {
                      const furtherEvolutionData = await getPokemonById(furtherEvolution.pokedexId);
                      evolutions.push(furtherEvolutionData);
                    } catch (err) {
                      console.error("Error fetching further evolution:", err);
                    }
                  })
                );
              }
            } catch (err) {
              console.error("Error fetching evolution:", err);
            }
          })
        );
      }
    }
    
    return { preEvolutions, evolutions };
  };

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        setIsLoading(true);
        
        const { preEvolutions, evolutions } = await determineEvolutionChain(pokemon);
        
        setEvolutionChain({
          preEvolutions,
          current: pokemon,
          evolutions,
        });
        
        setError(null);
      } catch (err) {
        setError("Failed to load evolution chain");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvolutionChain();
  }, [pokemon]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Evolution Chain</h3>
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-center">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Evolution Chain</h3>
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  const hasEvolutionChain = evolutionChain.preEvolutions.length > 0 || evolutionChain.evolutions.length > 0;

  if (!hasEvolutionChain) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Evolution Chain</h3>
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          This Pokémon does not evolve.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-6">Evolution Chain</h3>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Pre-evolutions */}
        {evolutionChain.preEvolutions.map((preEvolution, index) => (
          <div key={preEvolution.id} className="flex items-center">
            <PokemonEvolutionCard pokemon={preEvolution} />
            
            {index < evolutionChain.preEvolutions.length - 1 && (
              <div className="mx-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </div>
        ))}
        
        {/* Arrow between pre-evolution and current */}
        {evolutionChain.preEvolutions.length > 0 && (
          <div className="mx-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
        
        {/* Current Pokemon */}
        <div className="relative">
          <PokemonEvolutionCard pokemon={evolutionChain.current} isCurrent={true} />
        </div>
        
        {/* Arrow between current and evolutions */}
        {evolutionChain.evolutions.length > 0 && (
          <div className="mx-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
        
        {/* Evolutions */}
        {evolutionChain.evolutions.map((evolution, index) => (
          <div key={evolution.id} className="flex items-center">
            <PokemonEvolutionCard pokemon={evolution} />
            
            {index < evolutionChain.evolutions.length - 1 && (
              <div className="mx-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PokemonEvolutionCardProps {
  pokemon: Pokemon;
  isCurrent?: boolean;
}

function PokemonEvolutionCard({ pokemon, isCurrent = false }: PokemonEvolutionCardProps) {
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
    <Link 
      href={`/pokemon/${pokemon.pokedexId}`}
      className={`group block p-5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-xl relative ${
        isCurrent 
          ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 shadow-md" 
          : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:z-10"
      }`}
    >
      {/* Background with subtle pattern based on type */}
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br rounded-xl ${getTypeGradient(pokemon.types?.[0]?.name || 'normal')}`}></div>
      
      {/* Current Pokemon indicator */}
      {isCurrent && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Current
        </div>
      )}
      
      <div className="flex flex-col items-center relative">
        <div className="relative w-28 h-28 transition-transform duration-300 group-hover:scale-110">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="112px"
            className="object-contain drop-shadow-md"
          />
        </div>
        
        <div className="mt-3 text-center">
          <p className="font-bold capitalize text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {pokemon.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            #{pokemon.pokedexId.toString().padStart(3, '0')}
          </p>
        </div>
        
        <div className="mt-3 flex gap-1.5 flex-wrap justify-center">
          {pokemon.types && pokemon.types.map((type) => (
            <div 
              key={type.id}
              className="px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center gap-1"
              style={{
                backgroundColor: `var(--${type.name.toLowerCase()}-color, #A8A878)`,
                color: 'white',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              {type.image && (
                <img 
                  src={type.image} 
                  alt={type.name} 
                  className="w-3 h-3" 
                />
              )}
              <span className="capitalize">{type.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
