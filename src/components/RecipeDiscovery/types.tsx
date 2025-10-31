export type ViewMode = "grid" | "list" | "compact";
export type SortOption = "relevant" | "rating" | "time" | "trending";
export type WeatherType = "Sunny" | "Rainy" | "Cloudy" | "Cold" | "Hot";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  cuisine: string;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
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
  servings: number;
  instructions: string[];
  tips: string[];
}

export interface SearchFilters {
  timeRange?: [number, number];
  difficulty?: string[];
  dietary?: string[];
  cuisine?: string[];
  ingredients?: string[];
  mealType?: string[];
  sortBy?: string;
  viewMode?: 'grid' | 'list' | 'compact';
}

export interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  timeFilter?: number;
  costFilter?: number;
  dietary?: boolean;
  special?: boolean;
  default?: boolean;
  sort?: string;
  difficulty?: string;
  tooltip: string;
  dynamic?: boolean;
}