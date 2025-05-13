export interface Pokemon {
  id: number;
  name: string;
  pokedexId: number;
  image: string;
  sprite: string;
  slug?: string;
  stats: {
    HP: number;
    attack: number;
    defense: number;
    specialAttack?: number;
    specialDefense?: number;
    special_attack?: number;
    special_defense?: number;
    speed: number;
  };
  types: PokemonType[];
  generation?: number;
  apiGeneration?: number;
  resistances?: PokemonResistance[];
  apiResistances?: PokemonResistance[];
  evolutions?: PokemonEvolution[];
  apiEvolutions?: PokemonEvolution[];
  preEvolution?: PokemonPreEvolution | null;
  apiPreEvolution?: PokemonPreEvolution | null;
  resistancesWithAbilities?: any[]; // Can be typed more specifically if needed
  apiResistancesWithAbilities?: any[]; // Can be typed more specifically if needed
}

export interface PokemonType {
  name: string;
  image: string;
  id: number;
}

export interface PokemonResistance {
  name: string;
  damage_multiplier: number;
  damage_relation: string;
}

export interface PokemonEvolution {
  name: string;
  pokedexId: number;
}

export interface PokemonPreEvolution {
  name: string;
  pokedexId?: number;
  pokedexIdd?: number;
}

export interface PokemonFilters {
  page?: number;
  limit?: number;
  typeId?: number;
  types?: number[];
  name?: string;
}
