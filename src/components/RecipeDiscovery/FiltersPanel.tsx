import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchFilters } from "./types";

interface FiltersPanelProps {
  onFiltersChange?: (filters: SearchFilters) => void;
}

export function FiltersPanel({ onFiltersChange }: FiltersPanelProps) {
  return (
    <div className="h-[calc(100vh-6rem)] overflow-auto">
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Cooking Time</Label>
            <span className="text-sm text-muted-foreground">30 mins</span>
          </div>
          <Slider defaultValue={[30]} max={120} step={5} />
        </div>

        <div className="space-y-4">
          <Label>Budget Range</Label>
          <RadioGroup defaultValue="any">
            <div className="grid gap-2">
              {["Any", "Under ₹50", "₹50-₹100", "₹100-₹200", "₹200+"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.toLowerCase()} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>Cuisine Types</Label>
          <div className="grid gap-2">
            {["Indian", "Italian", "Chinese", "Mexican", "Thai"].map((cuisine) => (
              <div key={cuisine} className="flex items-center space-x-2">
                <Checkbox id={`cuisine-${cuisine.toLowerCase()}`} />
                <Label htmlFor={`cuisine-${cuisine.toLowerCase()}`}>{cuisine}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Dietary Preferences</Label>
          <div className="grid gap-2">
            {["Vegetarian", "Vegan", "Gluten-free", "Dairy-free"].map((pref) => (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox id={`diet-${pref.toLowerCase()}`} />
                <Label htmlFor={`diet-${pref.toLowerCase()}`}>{pref}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}