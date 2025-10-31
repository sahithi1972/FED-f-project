export interface RecipeFilters {
  difficulty?: string;
  cookingTime?: number;
  tags?: string[];
  ingredients?: string[];
}

export interface RecipeIngredientInput {
  name: string;
  quantity: number;
  unit: string;
  wastageReduction?: number;
}

export interface RecipeStepInput {
  order?: number;
  description: string;
  image?: string;
}

export interface CreateRecipeInput {
  title: string;
  description: string;
  cookingTime: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  servings: number;
  ingredients: RecipeIngredientInput[];
  steps: RecipeStepInput[];
  tags?: string[];
}

export interface UpdateRecipeInput extends Partial<CreateRecipeInput> {}