import { Pokemon } from "@/types/pokemon";

interface PokemonStatsProps {
  pokemon: Pokemon;
}

export default function PokemonStats({ pokemon }: PokemonStatsProps) {
  // Maximum stat value for scaling the progress bars
  const MAX_STAT_VALUE = 255;
  
  // Stats to display with fallbacks for different API property names
  const stats = [
    { name: "HP", value: pokemon.stats.HP, color: "bg-green-500" },
    { name: "Attack", value: pokemon.stats.attack, color: "bg-red-500" },
    { name: "Defense", value: pokemon.stats.defense, color: "bg-blue-500" },
    { 
      name: "Special Attack", 
      value: pokemon.stats.specialAttack || pokemon.stats.special_attack || 0, 
      color: "bg-purple-500" 
    },
    { 
      name: "Special Defense", 
      value: pokemon.stats.specialDefense || pokemon.stats.special_defense || 0, 
      color: "bg-indigo-500" 
    },
    { name: "Speed", value: pokemon.stats.speed, color: "bg-yellow-500" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Base Stats</h3>
      
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.name} className="flex items-center">
            <div className="w-32 text-sm font-medium">{stat.name}</div>
            <div className="flex-1">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat.color} rounded-full`} 
                  style={{ width: `${Math.min(100, (stat.value / MAX_STAT_VALUE) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-right text-sm font-mono ml-2">{stat.value}</div>
          </div>
        ))}
      </div>
      
      {/* Total stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-32 font-bold">Total</div>
          <div className="flex-1">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (Object.values(pokemon.stats).reduce((a, b) => a + b, 0) / (MAX_STAT_VALUE * 6)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="w-12 text-right font-bold ml-2">
            {Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
