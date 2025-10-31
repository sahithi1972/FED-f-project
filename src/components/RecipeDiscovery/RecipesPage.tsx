import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, LayoutList, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { VoiceInput } from "./components/VoiceInput";
import { UploadRecipeDialog } from "./components/UploadRecipeDialog";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { dummyRecipes } from "@/data/dummy-recipes";
import { cn } from "@/lib/utils";
import { QuickFilters } from "./QuickFilters";
import { FiltersPanel } from "./FiltersPanel";
import { EmptyState } from "./EmptyState";
import { ViewMode, SortOption, WeatherType } from "./types";

// Constants and helper functions
const ingredientSuggestions = [
  "Tomatoes",
  "Onions",
  "Garlic",
  "Ginger",
  "Potatoes",
  "Carrots",
  "Chicken",
  "Rice",
  "Pasta",
  "Beans"
];

const suggestIngredientCombo = (currentIngredients: string[]) => {
  // Simple suggestion logic - you can enhance this
  const availableSuggestions = ingredientSuggestions.filter(
    ing => !currentIngredients.includes(ing)
  );
  return availableSuggestions[Math.floor(Math.random() * availableSuggestions.length)];
};

export default function RecipesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentWeather] = useState<WeatherType>("Cloudy");
  const [useWeatherSuggestions, setUseWeatherSuggestions] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [usePantryMode, setUsePantryMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Load initial recipes
  useEffect(() => {
    // Simulate API call with dummy data
    const timer = setTimeout(() => {
      setRecipes(dummyRecipes);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Effect to persist pantry ingredients
  useEffect(() => {
    if (usePantryMode) {
      localStorage.setItem('pantryIngredients', JSON.stringify(selectedIngredients));
    }
  }, [usePantryMode, selectedIngredients]);

  // Handler for exploring popular recipes
  const handleExplorePopular = () => {
    setActiveFilters(['popular']);
    setSortBy('rating');
    setSelectedIngredients([]);
  };

  // Handler for uploading recipe
  const handleUploadRecipe = () => {
    // This would open the recipe upload modal/form
    console.log('Upload recipe');
  };

  const handleVoiceIngredients = (ingredients: string[]) => {
    setSelectedIngredients(prev => [...new Set([...prev, ...ingredients])]);
  };

  // Get suggested ingredient based on current selection
  const currentSuggestion = suggestIngredientCombo(selectedIngredients);

  const searchRef = useRef<HTMLDivElement>(null);
  
  const filteredSuggestions = ingredientSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Recipes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search recipes..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full rounded-lg border bg-transparent px-4 py-2 pl-10 pr-12"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <VoiceInput onIngredientsDetected={(ingredients) => {
                    setSelectedIngredients(prev => [...new Set([...prev, ...ingredients])]);
                  }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="time">Cooking Time</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? (
                  <LayoutList className="h-4 w-4" />
                ) : (
                  <LayoutGrid className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="default"
                className="shrink-0"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Recipe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="border-b">
        <div className="container px-4">
          <QuickFilters
            activeFilters={activeFilters}
            onToggle={(id) => {
              setActiveFilters(prev =>
                prev.includes(id)
                  ? prev.filter(f => f !== id)
                  : [...prev, id]
              );
            }}
            onShowAdvanced={() => setIsFilterOpen(true)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-[300px] sticky top-[80px] h-[calc(100vh-80px)]">
            <FiltersPanel />
          </aside>

          {/* Recipes Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border bg-card">
                    <AspectRatio ratio={16 / 9}>
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <EmptyState
                ingredients={selectedIngredients}
                onExplorePopular={handleExplorePopular}
                onUploadRecipe={handleUploadRecipe}
              />
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="rounded-lg overflow-hidden border bg-card">
                    {/* Recipe card content */}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-full sm:max-w-lg">
          <FiltersPanel />
        </SheetContent>
      </Sheet>

      {/* Upload Recipe Dialog */}
      <UploadRecipeDialog 
        open={isUploadDialogOpen} 
        onClose={() => setIsUploadDialogOpen(false)} 
      />
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" className="w-full sm:w-[540px]">
          <FiltersPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
}