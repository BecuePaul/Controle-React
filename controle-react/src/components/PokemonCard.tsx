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
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700 relative"
    >
      <div className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-mono font-semibold z-10 shadow-sm">
        #{pokemon.pokedexId.toString().padStart(3, '0')}
      </div>
      
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${getTypeGradient(pokemon.types?.[0]?.name || 'normal')}`}></div>
      
      <div className="relative h-48 bg-gray-50 dark:bg-gray-700 overflow-hidden group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-4 drop-shadow-md"
            priority={pokemon.pokedexId <= 10}
          />
        </div>
      </div>
      
      <div className="p-5">
        <h2 className="text-lg font-bold capitalize mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {pokemon.name}
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {pokemon.types && pokemon.types.map((type) => (
            <TypeBadge key={type.id} type={type} />
          ))}
        </div>
      </div>
    </Link>
  );
}

function getTypeGradient(typeName: string): string {
  const typeGradients: Record<string, string> = {
    normal: 'from-gray-200 to-gray-400',
    feu: 'from-red-300 to-orange-500',
    eau: 'from-blue-300 to-blue-500',
    électrik: 'from-yellow-200 to-yellow-400',
    plante: 'from-green-300 to-green-500',
    ice: 'from-blue-100 to-blue-300',
    combat: 'from-red-400 to-red-700',
    poison: 'from-purple-300 to-purple-500',
    sol: 'from-yellow-300 to-yellow-600',
    vol: 'from-indigo-200 to-indigo-400',
    psy: 'from-pink-300 to-pink-500',
    insecte: 'from-lime-300 to-lime-500',
    roche: 'from-yellow-400 to-yellow-700',
    spectre: 'from-purple-400 to-purple-700',
    dragon: 'from-indigo-400 to-indigo-600',
    dark: 'from-gray-500 to-gray-700',
    acier: 'from-gray-300 to-gray-500',
    fee: 'from-pink-200 to-pink-400',
  };

  return typeGradients[typeName.toLowerCase()] || 'from-gray-200 to-gray-400';
}

interface TypeBadgeProps {
  type: PokemonType;
}

function TypeBadge({ type }: TypeBadgeProps) {
  const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    feu: "bg-red-500",
    eau: "bg-blue-500",
    électrik: "bg-yellow-400",
    plante: "bg-green-500",
    ice: "bg-blue-300",
    combat: "bg-red-700",
    poison: "bg-purple-500",
    sol: "bg-yellow-600",
    vol: "bg-indigo-300",
    psy: "bg-pink-500",
    insecte: "bg-lime-500",
    roche: "bg-yellow-700",
    spectre: "bg-purple-700",
    dragon: "bg-indigo-600",
    dark: "bg-gray-700",
    acier: "bg-gray-400",
    fee: "bg-pink-300",
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
