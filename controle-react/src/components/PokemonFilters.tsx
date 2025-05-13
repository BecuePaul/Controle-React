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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        Filters
      </h2>
      
      <div className="space-y-6">
        {/* Name filter */}
        <div className="relative">
          <label htmlFor="name-filter" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Pokemon Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="name-filter"
              type="text"
              value={searchTerm}
              onChange={handleNameChange}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  onFilterChange({
                    ...filters,
                    name: undefined,
                    page: 0,
                  });
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Limit filter */}
        <div>
          <label htmlFor="limit-filter" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Pokemon per page
          </label>
          <div className="relative">
            <select
              id="limit-filter"
              value={limitValue}
              onChange={handleLimitChange}
              className="block w-full pl-4 pr-10 py-2.5 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
            >
              <option value="10">10 Pokemon</option>
              <option value="20">20 Pokemon</option>
              <option value="50">50 Pokemon</option>
              <option value="100">100 Pokemon</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Type filters */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
            Pokemon Types
          </label>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-500">Loading types...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTypes.includes(type.id)
                      ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
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
          className="w-full py-2.5 mt-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center font-medium text-gray-700 dark:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
