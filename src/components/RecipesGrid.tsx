import { type Recipe } from "@/types/recipe";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RecipeFilters, type RecipeFilters as RecipeFiltersType } from "./RecipeFilters";
import { RecipeCard } from "./RecipeCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRecipeSearch } from "@/hooks/use-recipe-search";
import { RecipeGridSkeleton } from "./RecipeSkeleton";
import { FadeIn, FadeInStagger, FadeInStaggerItem, GridTransition } from "./ui/animations";

// Mock data - replace with actual data from your API
const mockRecipes: Recipe[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  title: ["Spicy Paneer Tikka", "Butter Chicken", "Vegetable Biryani", "Masala Dosa", 
         "Palak Paneer", "Dal Makhani", "Chole Bhature", "Tandoori Roti", 
         "Malai Kofta", "Samosa", "Pav Bhaji", "Gulab Jamun"][i],
  image: `/images/recipes/recipe-${i + 1}.jpg`,
  cookingTime: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
  difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
  rating: 3 + Math.random() * 2,
  cuisineType: ["Indian", "Chinese", "Italian", "Mexican"][Math.floor(Math.random() * 4)],
  dietaryPreferences: [
    ["Vegetarian"],
    ["Non-Vegetarian"],
    ["Vegan"],
    ["Vegetarian", "Gluten-Free"],
  ][Math.floor(Math.random() * 4)],
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
    handleFilters: onFilters,
    handleSort: onSort,
  } = useRecipeSearch({ recipes: mockRecipes });

  const handleFavoriteToggle = (id: string) => {
    // In a real app, this would be handled by the API
    console.log("Toggle favorite:", id);
  };

  const handleRecipeClick = (id: string) => {
    // Implement navigation to recipe detail page
    console.log("Navigate to recipe:", id);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-2 md:w-[400px]">
          <div className="relative flex-1">
            <Search className={`absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${isLoading ? "text-primary" : "text-muted-foreground"}`} />
            <Input
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-8"
              disabled={isLoading}
            />
          </div>
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
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={onSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="time-asc">Cooking Time (Low to High)</SelectItem>
              <SelectItem value="time-desc">Cooking Time (High to Low)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              <RecipeGridSkeleton />
            </FadeIn>
          ) : filteredRecipes.length === 0 ? (
            <FadeIn>
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
                <div className="text-2xl font-semibold">No recipes found</div>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={() => onFilters(null)}>
                  Clear all filters
                </Button>
              </div>
            </FadeIn>
          ) : (
            <GridTransition>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}