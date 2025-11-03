import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Low-Carb"
];

const cuisineTypes = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "Mediterranean"
];

export function FiltersPanel() {
  return (
    <aside className="space-y-6 p-4 rounded-xl bg-black/40 border border-emerald-500/20 backdrop-blur-sm">
      <div>
        <h3 className="text-lg font-semibold text-emerald-400 mb-4">Filters</h3>
        
        {/* Cooking Time */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-emerald-300">Cooking Time</h4>
          <Slider
            defaultValue={[30]}
            max={120}
            step={5}
            className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-600"
          />
          <div className="flex justify-between text-sm text-emerald-200">
            <span>5 mins</span>
            <span>2 hours</span>
          </div>
        </div>

        <Separator className="my-6 bg-emerald-500/20" />

        {/* Dietary Preferences */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-emerald-300">Dietary Preferences</h4>
          <div className="grid grid-cols-2 gap-2">
            {dietaryOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="text-sm border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-emerald-500/20" />

        {/* Cuisine Type */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-emerald-300">Cuisine Type</h4>
          <div className="flex flex-wrap gap-2">
            {cuisineTypes.map((cuisine) => (
              <Badge
                key={cuisine}
                variant="outline"
                className="cursor-pointer border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                {cuisine}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-emerald-500/20" />

        {/* Additional Options */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-emerald-300">Additional Options</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-200">Include Video Recipes</span>
              <Switch className="bg-emerald-500/20 data-[state=checked]:bg-emerald-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-200">Only Show Easy Recipes</span>
              <Switch className="bg-emerald-500/20 data-[state=checked]:bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          className="flex-1 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
        >
          Reset
        </Button>
        <Button
          className="flex-1 bg-emerald-500 text-emerald-50 hover:bg-emerald-600"
        >
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}