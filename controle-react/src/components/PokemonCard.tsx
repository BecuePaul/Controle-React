import Image from "next/image";
import Link from "next/link";
import { Pokemon, PokemonType } from "@/types/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link 
      href={`/pokemon/${pokemon.pokedexId}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
    >
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4"
          priority={pokemon.pokedexId <= 10} // Prioritize loading for first few Pokemon
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold capitalize">{pokemon.name}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">#{pokemon.pokedexId}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {pokemon.types && pokemon.types.map((type) => (
            <TypeBadge key={type.id} type={type} />
          ))}
        </div>
      </div>
    </Link>
  );
}

interface TypeBadgeProps {
  type: PokemonType;
}

function TypeBadge({ type }: TypeBadgeProps) {
  // Map of type names to background colors
  const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-300",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-700",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-600",
    dark: "bg-gray-700",
    steel: "bg-gray-400",
    fairy: "bg-pink-300",
    // Add any missing types here
  };

  const bgColor = typeColors[type.name.toLowerCase()] || "bg-gray-500";

  return (
    <div className={`${bgColor} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1`}>
      {type.image && (
        <Image 
          src={type.image} 
          alt={type.name} 
          width={16} 
          height={16} 
          className="w-4 h-4"
        />
      )}
      <span className="capitalize">{type.name}</span>
    </div>
  );
}
