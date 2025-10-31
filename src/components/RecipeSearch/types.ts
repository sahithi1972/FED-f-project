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
  trending?: boolean;
  seasonal?: boolean;
  usesLeftovers?: boolean;
  onePot?: boolean;
  noOven?: boolean;
  microwave?: boolean;
  matchPercentage?: number;
  missingIngredients?: string[];
  cost: number;
  rating: number;
  tags?: string[];
  instructions?: string[];
  servings?: number;
  prepTime?: number;
  totalTime?: number;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface SearchFilters {
  cuisine: string[];
  cookingTime: number | null;
  dietary: string[];
  difficulty: string[];
  sort: string;
  usesLeftovers: boolean;
  onePot: boolean;
  seasonal: boolean;
  microwave: boolean;
}

export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  timeFilter?: number;
  costFilter?: number;
  dietary?: boolean;
  special?: boolean;
  sort?: string;
  difficulty?: string;
  default?: boolean;
}

export interface SortOption {
  id: string;
  label: string;
  icon: string;
  timeFilter?: number;
  costFilter?: number;
  dietary?: boolean;
  special?: boolean;
  sort?: string;
  difficulty?: string;
  default?: boolean;
}

export interface SortOption {
  label: string;
  value: 'relevance' | 'time' | 'difficulty' | 'newest';
}

export type SearchState = 'idle' | 'loading' | 'success' | 'error';