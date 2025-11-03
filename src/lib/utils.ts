import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRecipeImage(recipe: any): string {
  // Prefer explicit imageUrl (remote), then image, then mainImage; fall back to placeholder
  if (!recipe) return '/placeholder.svg';

  // If recipe has a numeric id and matches one of the local numbered images
  // prefer the local static asset (user added recipe-1..recipe-12.jpg under public/images/recipes)
  const id = recipe?.id;
  if (id && typeof id === 'string') {
    const n = parseInt(id, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= 12) {
      // use local static asset for deterministic display of mock data
      return `/images/recipes/recipe-${n}.jpg`;
    }
  }

  // Prefer explicit image fields (remote first), then fall back to placeholder
  const first = recipe?.image || recipe?.mainImage || recipe?.imageUrl;
  if (first) return first;

  return '/placeholder.svg';
}
