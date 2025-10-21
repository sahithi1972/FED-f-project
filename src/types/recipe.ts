export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
  difficulty: string;
  rating: number;
  cuisineType: string;
  dietaryPreferences: string[];
  isFavorite?: boolean;
}