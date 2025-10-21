import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { LayoutGrid, LayoutList, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { ScrollArea } from "../components/ui/scroll-area";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { AspectRatio } from "../components/ui/aspect-ratio";

type ViewMode = "grid" | "list";

type SortOption = "relevant" | "fastest" | "budget" | "rated" | "newest" | "ingredients";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevant", label: "Most Relevant" },
  { value: "fastest", label: "Fastest First" },
  { value: "budget", label: "Budget-Friendly" },
  { value: "rated", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "ingredients", label: "Using Your Ingredients" },
];

const budgetOptions = [
  { value: "under-50", label: "Under ₹50 per serving" },
  { value: "50-100", label: "₹50-₹100 per serving" },
  { value: "100-200", label: "₹100-₹200 per serving" },
  { value: "premium", label: "Premium (₹200+)" },
];

const cuisines = [
  "Indian",
  "Italian",
  "Asian",
  "Mexican",
  "Mediterranean",
  "American",
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
];

const seasons = [
  "All",
  "Summer",
  "Monsoon",
  "Winter"
];

const equipment = [
  "One-pot",
  "Microwave",
  "Minimal",
  "Pressure Cooker",
  "Air Fryer",
];

function RecipeFilters() {
  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
      <div className="p-6 space-y-8">
        {/* Time Range */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Cooking Time</Label>
            <span className="text-sm text-muted-foreground">30 mins</span>
          </div>
          <Slider
            defaultValue={[30]}
            max={120}
            step={5}
            className="w-full"
          />
        </div>

        {/* Budget */}
        <div className="space-y-4">
          <Label>Budget</Label>
          <div className="grid gap-2">
            {budgetOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Cuisine */}
        <div className="space-y-4">
          <Label>Cuisine</Label>
          <div className="grid gap-2">
            {cuisines.map((cuisine) => (
              <div key={cuisine} className="flex items-center space-x-2">
                <Checkbox id={`cuisine-${cuisine}`} />
                <Label htmlFor={`cuisine-${cuisine}`}>{cuisine}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-4">
          <Label>Dietary Restrictions</Label>
          <div className="grid gap-2">
            {dietaryOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox id={`diet-${option}`} />
                <Label htmlFor={`diet-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Season */}
        <div className="space-y-4">
          <Label>Season</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.toLowerCase()} value={season.toLowerCase()}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Equipment */}
        <div className="space-y-4">
          <Label>Equipment</Label>
          <div className="grid gap-2">
            {equipment.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={`equipment-${item}`} />
                <Label htmlFor={`equipment-${item}`}>{item}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default function RecipeSearch() {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [timeRange, setTimeRange] = useState([30]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [totalRecipes, setTotalRecipes] = useState(48);
  const [sortBy, setSortBy] = useState<SortOption>("relevant");
  
  // Get ingredients from URL if they exist
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ingredientsParam = searchParams.get("ingredients");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    ingredientsParam ? ingredientsParam.split(",") : ["Tomatoes", "Onions", "Rice"]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container pt-4">
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
      
      {/* Top Bar */}
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-2 flex-1">
              <input
                type="search"
                placeholder="Search recipes..."
                className="flex-1 bg-transparent outline-none"
              />
              <Button
                size="sm"
                loading={isSearching}
                loadingText="Searching..."
                onClick={() => {
                  setIsSearching(true);
                  // Simulate search delay
                  setTimeout(() => setIsSearching(false), 1000);
                }}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <RadioGroup
              defaultValue={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
              className="flex items-center gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid" id="grid" className="sr-only" />
                <Label htmlFor="grid" className="cursor-pointer">
                  <LayoutGrid className={`h-5 w-5 ${viewMode === 'grid' ? 'text-primary' : 'text-muted-foreground'}`} />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="list" id="list" className="sr-only" />
                <Label htmlFor="list" className="cursor-pointer">
                  <LayoutList className={`h-5 w-5 ${viewMode === 'list' ? 'text-primary' : 'text-muted-foreground'}`} />
                </Label>
              </div>
            </RadioGroup>
            
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px]" side="right">
                <RecipeFilters />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Selected Ingredients */}
        <div className="container py-2 border-t">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {selectedIngredients.map((ingredient) => (
              <Badge key={ingredient} variant="secondary" className="whitespace-nowrap">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <div className="flex gap-6 relative">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden md:block w-[240px] lg:w-[280px] flex-shrink-0">
            <div className="sticky top-24">
              <RecipeFilters />
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">All Recipes</h2>
              <p className="text-sm text-muted-foreground">
                {totalRecipes} recipes available
              </p>
            </div>

            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {/* Recipe cards will be rendered here */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={viewMode === "grid" ? "" : "flex gap-4 items-start"}
                >
                  <div className={`${viewMode === "grid" ? "w-full" : "w-[180px] shrink-0"}`}>
                    <AspectRatio ratio={16 / 9}>
                      <Skeleton className="h-full w-full" />
                    </AspectRatio>
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}