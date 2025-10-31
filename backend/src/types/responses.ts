import { Recipe, RecipeIngredient, RecipeStep, Tag } from '@prisma/client';

export interface RecipeResponse extends Recipe {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tags: {
    tag: Tag;
  }[];
  _count: {
    likesRelation: number;
    savesRelation: number;
  };
  stats: {
    views: number;
    likes: number;
    saves: number;
    completions: number;
  };
  isLiked: boolean;
  isSaved: boolean;
}

export interface PaginatedRecipeResponse {
  recipes: RecipeResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}