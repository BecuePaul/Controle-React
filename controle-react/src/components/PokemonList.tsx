"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Pokemon, PokemonFilters, PokemonType } from "@/types/pokemon";
import { getPokemonList, getPokemonTypes } from "@/services/pokemonService";
import PokemonCard from "@/components/PokemonCard";
import PokemonFiltersComponent from "@/components/PokemonFilters";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PokemonListProps {
  initialPokemons: Pokemon[];
}

export default function PokemonList({ initialPokemons }: PokemonListProps) {
  const [pokemons, setPokemons] = useState<Pokemon[]>(initialPokemons);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>(initialPokemons);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<PokemonFilters>({
    page: 0,
    limit: 50,
  });
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPokemonElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            page: (prevFilters.page || 0) + 1,
          }));
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    console.log("Applying filters:", filters);
    console.log("Current pokemons:", pokemons);
    
    let result = [...pokemons];
    
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      result = result.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm)
      );
      console.log("After name filter:", result.length);
    }
    
    if (filters.types && filters.types.length > 0) {
      console.log("Filtering by types:", filters.types);
      result = result.filter(pokemon => {
        const hasType = pokemon.types.some(type => 
          filters.types?.includes(type.id)
        );
        console.log(`Pokemon ${pokemon.name} has type: ${hasType}`);
        return hasType;
      });
      console.log("After type filter:", result.length);
    }
    
    console.log("Filtered pokemons:", result.length);
    setFilteredPokemons(result);
    setHasMore(result.length >= (filters.limit || 50));
  }, [pokemons, filters]);

  useEffect(() => {
    if (filters.page === 0) return;
    
    const fetchMorePokemons = async () => {
      try {
        setIsLoading(true);
        
        const paginationFilters = {
          ...filters,
          name: undefined,
          types: undefined,
          typeId: undefined,
        };
        
        console.log("Fetching more Pokémon with filters:", paginationFilters);
        const response = await getPokemonList(paginationFilters);
        
        setPokemons((prevPokemons) => {
          const existingIds = new Set(prevPokemons.map(p => p.id));
          
          const newPokemons = response.filter(p => !existingIds.has(p.id));
          
          console.log(`Adding ${newPokemons.length} new Pokémon to the list`);
          
          return [...prevPokemons, ...newPokemons];
        });
        
        setHasMore(response.length === (filters.limit || 50));
        setError(null);
      } catch (err) {
        setError("Failed to load more Pokémon data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMorePokemons();
  }, [filters.page]);

  const handleFilterChange = (newFilters: PokemonFilters) => {
    setFilters({
      ...newFilters,
      page: 0,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <PokemonFiltersComponent 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </div>
      
      <div className="lg:col-span-3">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : filteredPokemons.length === 0 && !isLoading ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
            <strong className="font-bold">No Pokémon found!</strong>
            <span className="block sm:inline"> Try adjusting your filters.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPokemons.map((pokemon, index) => {
              if (filteredPokemons.length === index + 1) {
                return (
                  <div ref={lastPokemonElementRef} key={pokemon.id}>
                    <PokemonCard pokemon={pokemon} />
                  </div>
                );
              } else {
                return <PokemonCard key={pokemon.id} pokemon={pokemon} />;
              }
            })}
          </div>
        )}
        
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && !hasMore && filteredPokemons.length > 0 && (
          <p className="text-center text-gray-500 mt-8">
            No more Pokémon to load
          </p>
        )}
      </div>
    </div>
  );
}
