import { Pokemon } from "@/types/pokemon";

interface PokemonStatsProps {
  pokemon: Pokemon;
}

export default function PokemonStats({ pokemon }: PokemonStatsProps) {
  // Maximum stat value for scaling the progress bars
  const MAX_STAT_VALUE = 255;
  
  // Stats to display with fallbacks for different API property names
  const stats = [
    { name: "HP", value: pokemon.stats.HP, color: "bg-green-500", icon: "❤️" },
    { name: "Attack", value: pokemon.stats.attack, color: "bg-red-500", icon: "⚔️" },
    { name: "Defense", value: pokemon.stats.defense, color: "bg-blue-500", icon: "🛡️" },
    { 
      name: "Special Attack", 
      value: pokemon.stats.specialAttack || pokemon.stats.special_attack || 0, 
      color: "bg-purple-500",
      icon: "✨" 
    },
    { 
      name: "Special Defense", 
      value: pokemon.stats.specialDefense || pokemon.stats.special_defense || 0, 
      color: "bg-indigo-500",
      icon: "🔮" 
    },
    { name: "Speed", value: pokemon.stats.speed, color: "bg-yellow-500", icon: "⚡" },
  ];

  // Calculate stat quality (low, medium, high)
  const getStatQuality = (value: number) => {
    if (value < 50) return "Low";
    if (value < 100) return "Medium";
    return "High";
  };

  // Calculate total stats
  const totalStats = Object.values(pokemon.stats).reduce((a, b) => a + b, 0);
  
  // Determine Pokemon's strength based on total stats
  const getPokemonStrength = (total: number) => {
    if (total < 300) return "Basic";
    if (total < 450) return "Intermediate";
    if (total < 550) return "Advanced";
    return "Elite";
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Base Stats
      </h3>
      
      <div className="space-y-5">
        {stats.map((stat) => {
          const percentage = Math.min(100, (stat.value / MAX_STAT_VALUE) * 100);
          const quality = getStatQuality(stat.value);
          
          return (
            <div key={stat.name} className="group">
              <div className="flex items-center mb-1">
                <div className="w-32 text-sm font-medium flex items-center">
                  <span className="mr-2">{stat.icon}</span>
                  {stat.name}
                </div>
                <div className="ml-auto text-right text-sm font-mono font-bold">
                  {stat.value}
                  <span className={`ml-2 text-xs font-normal ${
                    quality === "Low" ? "text-red-500" : 
                    quality === "Medium" ? "text-yellow-500" : 
                    "text-green-500"
                  }`}>
                    ({quality})
                  </span>
                </div>
              </div>
              
              <div className="h-5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out flex items-center`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 15 && (
                    <div className="ml-3 text-xs text-white font-semibold">{stat.value}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Total stats */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Total
          </div>
          <div className="text-right">
            <span className="text-xl font-bold">{totalStats}</span>
            <span className={`ml-2 text-sm ${
              totalStats < 300 ? "text-gray-500" : 
              totalStats < 450 ? "text-blue-500" : 
              totalStats < 550 ? "text-purple-500" : 
              "text-yellow-500"
            }`}>
              ({getPokemonStrength(totalStats)})
            </span>
          </div>
        </div>
        
        <div className="h-6 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-center"
            style={{ 
              width: `${Math.min(100, (totalStats / (MAX_STAT_VALUE * 6)) * 100)}%` 
            }}
          >
            <div className="text-xs text-white font-bold drop-shadow-md">{totalStats}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
