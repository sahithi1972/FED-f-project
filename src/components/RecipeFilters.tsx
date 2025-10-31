// COPILOT:
// Convert this filter section into a collapsible sidebar.
// Default state: collapsed on mobile, expanded on desktop.
// Use a "Filters" button at the top that toggles visibility.
// Keep all filter logic exactly the same.
// Only change layout + styling using Tailwind.


import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

interface RecipeFiltersProps {
  onFiltersChange: (filters: RecipeFilters) => void;
  className?: string;
}

export interface RecipeFilters {
  cookingTime: number[];
  difficulty: string;
  budget: string;
  cuisineTypes: string[];
  dietaryPreferences: string[];
  mealTypes: string[];
  cookingMethods: string[];
  seasonal: string;
}

export const defaultFilters: RecipeFilters = {
  cookingTime: [5, 60],
  difficulty: "",
  budget: "",
  cuisineTypes: [],
  dietaryPreferences: [],
  mealTypes: [],
  cookingMethods: [],
  seasonal: "all",
};

export function RecipeFilters({ onFiltersChange, className }: RecipeFiltersProps) {
  const [filters, setFilters] = useState<RecipeFilters>(defaultFilters);

  const handleFilterChange = (key: keyof RecipeFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className={cn("w-full lg:max-w-[300px] transition-all", className)}>
      <div className="sticky top-[80px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear all
          </Button>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {/* Cooking Time */}
          <AccordionItem value="cooking-time" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <span className="text-sm font-medium">Time to Cook</span>
            </AccordionTrigger>
            <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                defaultValue={[5, 60]}
                min={5}
                max={120}
                step={5}
                value={filters.cookingTime}
                onValueChange={(value) => handleFilterChange("cookingTime", value)}
              />
              <div className="flex justify-between text-sm">
                <span>{filters.cookingTime[0]} mins</span>
                <span>{filters.cookingTime[1]}+ mins</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange("cookingTime", [5, 15])}
                >
                  Under 15 mins
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange("cookingTime", [15, 30])}
                >
                  15-30 mins
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange("cookingTime", [30, 60])}
                >
                  30-60 mins
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Difficulty Level */}
        <AccordionItem value="difficulty">
          <AccordionTrigger>Difficulty Level</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.difficulty}
              onValueChange={(value) => handleFilterChange("difficulty", value)}
            >
              {["Easy", "Medium", "Hard"].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level.toLowerCase()} id={level.toLowerCase()} />
                  <Label htmlFor={level.toLowerCase()}>{level}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Budget */}
        <AccordionItem value="budget">
          <AccordionTrigger>Budget</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.budget}
              onValueChange={(value) => handleFilterChange("budget", value)}
            >
              {[
                { label: "Under ₹50 per serving", value: "under-50" },
                { label: "₹50-₹100 per serving", value: "50-100" },
                { label: "₹100-₹200 per serving", value: "100-200" },
                { label: "Premium (₹200+)", value: "premium" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Cuisine Type */}
        <AccordionItem value="cuisine">
          <AccordionTrigger>Cuisine Type</AccordionTrigger>
          <AccordionContent>
            {[
              "Indian",
              "Italian",
              "Chinese",
              "Mexican",
              "Thai",
              "Continental",
              "Fusion",
            ].map((cuisine) => (
              <div key={cuisine} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`cuisine-${cuisine.toLowerCase()}`}
                  checked={filters.cuisineTypes.includes(cuisine)}
                  onCheckedChange={(checked) => {
                    const newCuisines = checked
                      ? [...filters.cuisineTypes, cuisine]
                      : filters.cuisineTypes.filter((c) => c !== cuisine);
                    handleFilterChange("cuisineTypes", newCuisines);
                  }}
                />
                <Label htmlFor={`cuisine-${cuisine.toLowerCase()}`}>{cuisine}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Dietary Preferences */}
        <AccordionItem value="dietary">
          <AccordionTrigger>Dietary Preferences</AccordionTrigger>
          <AccordionContent>
            {[
              "Vegetarian",
              "Vegan",
              "Gluten-Free",
              "Egg-Free",
              "Dairy-Free",
              "Keto-Friendly",
            ].map((diet) => (
              <div key={diet} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`diet-${diet.toLowerCase()}`}
                  checked={filters.dietaryPreferences.includes(diet)}
                  onCheckedChange={(checked) => {
                    const newDiets = checked
                      ? [...filters.dietaryPreferences, diet]
                      : filters.dietaryPreferences.filter((d) => d !== diet);
                    handleFilterChange("dietaryPreferences", newDiets);
                  }}
                />
                <Label htmlFor={`diet-${diet.toLowerCase()}`}>{diet}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Meal Type */}
        <AccordionItem value="meal-type">
          <AccordionTrigger>Meal Type</AccordionTrigger>
          <AccordionContent>
            {["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"].map((meal) => (
              <div key={meal} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`meal-${meal.toLowerCase()}`}
                  checked={filters.mealTypes.includes(meal)}
                  onCheckedChange={(checked) => {
                    const newMeals = checked
                      ? [...filters.mealTypes, meal]
                      : filters.mealTypes.filter((m) => m !== meal);
                    handleFilterChange("mealTypes", newMeals);
                  }}
                />
                <Label htmlFor={`meal-${meal.toLowerCase()}`}>{meal}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Cooking Method */}
        <AccordionItem value="cooking-method">
          <AccordionTrigger>Cooking Method</AccordionTrigger>
          <AccordionContent>
            {[
              "Stovetop",
              "Oven",
              "Microwave",
              "One-Pot",
              "No-Cook",
              "Pressure Cooker",
            ].map((method) => (
              <div key={method} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`method-${method.toLowerCase()}`}
                  checked={filters.cookingMethods.includes(method)}
                  onCheckedChange={(checked) => {
                    const newMethods = checked
                      ? [...filters.cookingMethods, method]
                      : filters.cookingMethods.filter((m) => m !== method);
                    handleFilterChange("cookingMethods", newMethods);
                  }}
                />
                <Label htmlFor={`method-${method.toLowerCase()}`}>{method}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Seasonal */}
        <AccordionItem value="seasonal">
          <AccordionTrigger>Seasonal</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.seasonal}
              onValueChange={(value) => handleFilterChange("seasonal", value)}
            >
              {[
                { label: "Current Season (Auto-detect)", value: "current" },
                { label: "Summer", value: "summer" },
                { label: "Monsoon", value: "monsoon" },
                { label: "Winter", value: "winter" },
                { label: "All Seasons", value: "all" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6 space-x-4">
        <Button
          variant="link"
          className="text-muted-foreground"
          onClick={handleClearFilters}
        >
          Clear All Filters
        </Button>
        <Button onClick={() => onFiltersChange(filters)}>Apply Filters</Button>
      </div>
      </div>
    </div>
  );
}