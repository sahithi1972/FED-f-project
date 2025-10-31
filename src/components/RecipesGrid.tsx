// COPILOT:
// Convert recipe grid into a responsive layout:
// - grid-cols-1 on mobile
// - grid-cols-2 on tablets
// - grid-cols-3 on desktop
// Add gap-6 and proper padding.
// Do not change how recipes are mapped or passed.


import { type Recipe } from "@/types/recipe";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RecipeFilters, type RecipeFilters as RecipeFiltersType, defaultFilters } from "./RecipeFilters";
import { RecipeCard } from "./RecipeCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRecipeSearch } from "../hooks/use-recipe-search";
import { RecipeGridSkeleton } from "./RecipeGridSkeleton";
import { FadeIn, FadeInStagger, FadeInStaggerItem, GridTransition } from "./ui/animations";

// Mock data - replace with actual data from your API
const mockRecipes: Recipe[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  title: ["Spicy Paneer Tikka", "Butter Chicken", "Vegetable Biryani", "Masala Dosa", 
         "Palak Paneer", "Dal Makhani", "Chole Bhature", "Tandoori Roti", 
         "Malai Kofta", "Samosa", "Pav Bhaji", "Gulab Jamun"][i],
  description: "A delicious Indian recipe with authentic flavors.",
  imageUrl: `/images/recipes/recipe-${i + 1}.jpg`,
  cookingTime: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
  difficulty: ["easy", "medium", "hard"][Math.floor(Math.random() * 3)] as "easy" | "medium" | "hard",
  rating: 3 + Math.random() * 2,
  cuisine: ["Indian", "Chinese", "Italian", "Mexican"][Math.floor(Math.random() * 4)],
  dietary: [
    ["Vegetarian"],
    ["Non-Vegetarian"],
    ["Vegan"],
    ["Vegetarian", "Gluten-Free"],
  ][Math.floor(Math.random() * 4)],
  ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
  isFavorite: false,
}));

export function RecipesGrid() {
  const {
    search,
    filters,
    sortBy,
    isLoading,
    filteredRecipes,
    handleSearch: onSearch,
    handleFilterChange: onFilters,
    handleSortChange: onSort,
  } = useRecipeSearch(mockRecipes);

  const handleFavoriteToggle = (id: string) => {
    // In a real app, this would be handled by the API
    console.log("Toggle favorite:", id);
  };

  const handleRecipeClick = (id: string) => {
    // Implement navigation to recipe detail page
    console.log("Navigate to recipe:", id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={sortBy} onValueChange={onSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="cookingTime">Cooking Time</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-5rem)] pr-4">
                <RecipeFilters
                  onFiltersChange={onFilters}
                  className="py-4"
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <aside className="hidden md:block">
            <FadeIn>
              <RecipeFilters onFiltersChange={onFilters} />
            </FadeIn>
          </aside>
          <main>
            {isLoading ? (
              <FadeIn>
                <RecipeGridSkeleton count={12} />
              </FadeIn>
            ) : filteredRecipes.length === 0 ? (
              <FadeIn>
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
                  <div className="text-2xl font-semibold">No recipes found</div>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button variant="outline" onClick={() => onFilters(defaultFilters)}>
                    Clear all filters
                  </Button>
                </div>
              </FadeIn>
            ) : (
              <GridTransition>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <FadeInStagger>
                    {filteredRecipes.map((recipe) => (
                      <FadeInStaggerItem key={recipe.id}>
                        <RecipeCard
                          recipe={recipe}
                          onFavoriteToggle={handleFavoriteToggle}
                          onClick={handleRecipeClick}
                        />
                      </FadeInStaggerItem>
                    ))}
                  </FadeInStagger>
                </div>
              </GridTransition>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}