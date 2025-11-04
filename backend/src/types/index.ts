import { Request } from 'express';
import { User, Recipe, RecipeIngredient, RecipeStep, Tag, UserBadge } from '@prisma/client';
import type { Express } from 'express';

export interface AuthRequest extends Request {
  user?: User;
  file?: Express.Multer.File;
  body: any; // You might want to make this more specific based on your needs
  query: Record<string, string | string[]>;
  params: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface RecipeFilters {
  difficulty?: string;
  cookingTime?: number;
  tags?: string[];
  ingredients?: string[];
  userId?: string;
  status?: string;
}

// Extended types for frontend compatibility
export interface RecipeWithDetails extends Recipe {
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tags: Tag[];
  isLiked?: boolean;
  isSaved?: boolean;
  stats: {
    views: number;
    likes: number;
    saves: number;
    completions: number;
  };
}

export interface UserWithStats extends User {
  stats: {
    recipesCreated: number;
    totalLikes: number;
    impactScore: number;
  };
  badges: UserBadge[];
}