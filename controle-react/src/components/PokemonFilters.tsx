import { useState, useEffect } from "react";
import { PokemonFilters as FilterType, PokemonType } from "@/types/pokemon";
import { getPokemonTypes } from "@/services/pokemonService";

interface PokemonFiltersProps {
  filters: FilterType;
  onFilterChange: (newFilters: FilterType) => void;
}

export default function PokemonFilters({ filters, onFilterChange }: PokemonFiltersProps) {
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<number[]>(filters.types || []);
  const [searchTerm, setSearchTerm] = useState(filters.name || "");
  const [limitValue, setLimitValue] = useState(filters.limit?.toString() || "50");

  // Fetch Pokemon types on component mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setIsLoading(true);
        const typesData = await getPokemonTypes();
        setTypes(typesData);
        setError(null);
      } catch (err) {
        setError("Failed to load Pokemon types");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTypes();
  }, []);

  // Handle name filter change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setSearchTerm(newName);
    
    // Apply filter after a short delay to avoid too many API calls while typing
    const timeoutId = setTimeout(() => {
      onFilterChange({
        ...filters,
        name: newName || undefined,
        page: 0, // Reset to first page when filter changes
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle type filter change
  const handleTypeChange = (typeId: number) => {
    let newSelectedTypes: number[];
    
    if (selectedTypes.includes(typeId)) {
      // Remove type if already selected
      newSelectedTypes = selectedTypes.filter(id => id !== typeId);
    } else {
      // Add type if not already selected
      newSelectedTypes = [...selectedTypes, typeId];
    }
    
    console.log("Selected types:", newSelectedTypes);
    setSelectedTypes(newSelectedTypes);
    
    const newFilters = {
      ...filters,
      types: newSelectedTypes.length > 0 ? newSelectedTypes : undefined,
      typeId: undefined, // Clear single type filter when using multiple types
      page: 0, // Reset to first page when filter changes
    };
    
    console.log("New filters:", newFilters);
    onFilterChange(newFilters);
  };

  // Handle limit change
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setLimitValue(e.target.value);
    
    onFilterChange({
      ...filters,
      limit: newLimit,
      page: 0, // Reset to first page when limit changes
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setLimitValue("50");
    
    onFilterChange({
      limit: 50,
      page: 0,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      <div className="space-y-4">
        {/* Name filter */}
        <div>
          <label htmlFor="name-filter" className="block text-sm font-medium mb-1">
            Pokemon Name
          </label>
          <input
            id="name-filter"
            type="text"
            value={searchTerm}
            onChange={handleNameChange}
            placeholder="Search by name..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
        
        {/* Limit filter */}
        <div>
          <label htmlFor="limit-filter" className="block text-sm font-medium mb-1">
            Pokemon per page
          </label>
          <select
            id="limit-filter"
            value={limitValue}
            onChange={handleLimitChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        
        {/* Type filters */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Pokemon Types
          </label>
          
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading types...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    selectedTypes.includes(type.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {type.image && (
                    <img 
                      src={type.image} 
                      alt={type.name} 
                      className="w-4 h-4" 
                    />
                  )}
                  <span className="capitalize">{type.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Clear filters button */}
        <button
          onClick={handleClearFilters}
          className="w-full py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
