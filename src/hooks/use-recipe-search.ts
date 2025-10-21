import { useState, useCallback, useMemo } from "react";
import type { Recipe } from "@/types/recipe";
import type { RecipeFilters } from "@/components/RecipeFilters";

interface UseRecipeSearchProps {
  recipes: Recipe[];
  defaultSort?: string;
}

export function useRecipeSearch({ recipes, defaultSort = "relevance" }: UseRecipeSearchProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<RecipeFilters | null>(null);
  const [sortBy, setSortBy] = useState(defaultSort);
  const [isLoading, setIsLoading] = useState(false);

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    // Apply search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.cuisineType.toLowerCase().includes(searchLower) ||
        recipe.dietaryPreferences.some(pref => 
          pref.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply filters
    if (filters) {
      // Time range
      if (filters.cookingTime.length === 2) {
        result = result.filter(
          (recipe) =>
            recipe.cookingTime >= filters.cookingTime[0] &&
            recipe.cookingTime <= filters.cookingTime[1]
        );
      }

      // Difficulty
      if (filters.difficulty) {
        result = result.filter(
          (recipe) =>
            recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
      }

      // Cuisine types
      if (filters.cuisineTypes.length > 0) {
        result = result.filter((recipe) =>
          filters.cuisineTypes.includes(recipe.cuisineType)
        );
      }

      // Dietary preferences
      if (filters.dietaryPreferences.length > 0) {
        result = result.filter((recipe) =>
          filters.dietaryPreferences.some((pref) =>
            recipe.dietaryPreferences.includes(pref)
          )
        );
      }

      // Other filters can be added here...
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "time-asc":
        result.sort((a, b) => a.cookingTime - b.cookingTime);
        break;
      case "time-desc":
        result.sort((a, b) => b.cookingTime - a.cookingTime);
        break;
      // Add more sorting options as needed
    }

    return result;
  }, [recipes, search, filters, sortBy]);

  const handleSearch = useCallback(async (value: string) => {
    setIsLoading(true);
    try {
      setSearch(value);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFilters = useCallback((newFilters: RecipeFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSort = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  return {
    search,
    filters,
    sortBy,
    isLoading,
    filteredRecipes,
    handleSearch,
    handleFilters,
    handleSort,
  };
}