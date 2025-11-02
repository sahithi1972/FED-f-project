import { Ingredient, IngredientSubstitution } from '@prisma/client';

export interface SubstitutionResponse {
  original: string;
  substitute: string;
  confidence: number;
  notes: string | null;
}