import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/types/recipe';
import { RecipeFilters } from '@/components/RecipeFilters';

export function useRecipeSearch(initialRecipes: Recipe[]) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<RecipeFilters>({
    cookingTime: [5, 60],
    difficulty: "",
    budget: "",
    cuisineTypes: [],
    dietaryPreferences: [],
    mealTypes: [],
    cookingMethods: [],
    seasonal: "all",
  });
  const [sortBy, setSortBy] = useState<'rating' | 'cookingTime'>('rating');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(initialRecipes);

  const filterRecipes = useCallback(() => {
    setIsLoading(true);
    let results = [...initialRecipes];

    // Apply search filter
    if (search) {
      results = results.filter(recipe =>
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (filters.cuisineTypes.length > 0) {
      results = results.filter(recipe =>
        filters.cuisineTypes.includes(recipe.cuisine)
      );
    }

    // Apply dietary filter
    if (filters.dietaryPreferences.length > 0) {
      results = results.filter(recipe =>
        filters.dietaryPreferences.some(pref => recipe.dietary.includes(pref))
      );
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      results = results.filter(recipe =>
        recipe.difficulty === filters.difficulty
      );
    }

    // Apply cooking time filter
    if (filters.cookingTime) {
      const [min, max] = filters.cookingTime;
      results = results.filter(recipe =>
        recipe.cookingTime >= min && recipe.cookingTime <= max
      );
    }

    // Apply sorting
    results.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else {
        return a.cookingTime - b.cookingTime;
      }
    });

    setFilteredRecipes(results);
    setIsLoading(false);
  }, [search, filters, sortBy, initialRecipes]);

  useEffect(() => {
    filterRecipes();
  }, [filterRecipes]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleFilterChange = useCallback((newFilters: RecipeFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback((value: 'rating' | 'cookingTime') => {
    setSortBy(value);
  }, []);

  return {
    search,
    filters,
    sortBy,
    isLoading,
    filteredRecipes,
    handleSearch,
    handleFilterChange,
    handleSortChange,
  };
}