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

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        setIsLoading(true);
        
        // Fetch pre-evolution if exists
        const preEvolutions: Pokemon[] = [];
        const preEvolution = pokemon.preEvolution || pokemon.apiPreEvolution;
        
        if (preEvolution) {
          try {
            const preEvoId = preEvolution.pokedexId || preEvolution.pokedexIdd;
            if (preEvoId) {
              const preEvolutionData = await getPokemonById(preEvoId);
              preEvolutions.push(preEvolutionData);
              
              // Check if there's an earlier pre-evolution
              const earlierPreEvo = preEvolutionData.preEvolution || preEvolutionData.apiPreEvolution;
              if (earlierPreEvo) {
                const earlierPreEvoId = earlierPreEvo.pokedexId || earlierPreEvo.pokedexIdd;
                if (earlierPreEvoId) {
                  const earlierPreEvolution = await getPokemonById(earlierPreEvoId);
                  preEvolutions.unshift(earlierPreEvolution);
                }
              }
            }
          } catch (err) {
            console.error("Error fetching pre-evolution:", err);
          }
        }
        
        // Fetch evolutions
        const evolutions: Pokemon[] = [];
        const evolutionsArray = pokemon.evolutions || pokemon.apiEvolutions;
        
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
  return (
    <Link 
      href={`/pokemon/${pokemon.pokedexId}`}
      className={`block p-4 rounded-lg transition-transform hover:scale-105 ${
        isCurrent 
          ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500" 
          : "bg-gray-100 dark:bg-gray-700"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="96px"
            className="object-contain"
          />
        </div>
        
        <div className="mt-2 text-center">
          <p className="font-semibold capitalize">{pokemon.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">#{pokemon.pokedexId}</p>
        </div>
        
        <div className="mt-2 flex gap-1">
          {pokemon.types && pokemon.types.map((type) => (
            <div 
              key={type.id}
              className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600"
            >
              {type.name}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
