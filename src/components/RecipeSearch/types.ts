export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  cuisine: string;
  ingredients: string[];
  dietary: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
}

export interface SearchFilters {
  cuisine: string[];
  cookingTime: number | null;
  dietary: string[];
  difficulty: string[];
}

export interface SortOption {
  label: string;
  value: 'relevance' | 'time' | 'difficulty' | 'newest';
}

export type SearchState = 'idle' | 'loading' | 'success' | 'error';