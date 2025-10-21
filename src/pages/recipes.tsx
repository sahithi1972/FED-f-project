import { useState, useEffect } from "react";
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

type ViewMode = "grid" | "list";

const budgetOptions = [
  { value: "under-50", label: "Under ₹50" },
  { value: "50-100", label: "₹50-₹100" },
  { value: "premium", label: "Premium" },
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


export default function RecipeSearch() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [timeRange, setTimeRange] = useState([30]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIngredients] = useState(["Tomatoes", "Onions", "Rice"]);

  return (
    <div className="min-h-screen bg-background">
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

          {/* View Toggle & Filter Button (Mobile) */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
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

      <div className="container py-6">
        <div className="flex gap-6 relative">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden md:block w-[240px] lg:w-[280px] flex-shrink-0">
            <div className="sticky top-24">
              <RecipeFilters />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                24 recipes found
              </p>
              <div className="flex items-center gap-2">
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="time">Fastest</SelectItem>
                    <SelectItem value="budget">Cheapest</SelectItem>
                  </SelectContent>
                </Select>
                <div className="border rounded-md p-1 flex gap-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Recipe Grid */}
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {/* Recipe cards will go here */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`bg-card text-card-foreground rounded-lg border shadow-sm ${
                    viewMode === "list" ? "flex gap-4" : ""
                  }`}
                >
                  <div 
                    className={`aspect-video bg-muted ${
                      viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"
                    }`}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">Recipe Name</h3>
                    <p className="text-sm text-muted-foreground">
                      30 mins • Under ₹50
                    </p>
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
            max={60}
            step={5}
            className="w-full"
          />
        </div>

        {/* Budget */}
        <div className="space-y-4">
          <Label>Budget</Label>
          <RadioGroup defaultValue="under-50">
            {budgetOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
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