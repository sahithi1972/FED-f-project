export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  servings?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number;
  cuisine: string;
  dietary: string[];
  cost?: number;
  trending?: boolean;
  seasonal?: boolean;
  tags?: string[];
  ingredients: string[];
  instructions?: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  usesLeftovers?: boolean;
  onePot?: boolean;
  noOven?: boolean;
  microwave?: boolean;
  matchPercentage?: number;
  missingIngredients?: string[];
  isFavorite?: boolean;
}