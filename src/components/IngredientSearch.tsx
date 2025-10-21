import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

type Ingredient = {
  name: string;
  icon: string;
};

const popularIngredients: Ingredient[] = [
  { name: "Tomatoes", icon: "🍅" },
  { name: "Rice", icon: "🍚" },
  { name: "Potatoes", icon: "🥔" },
  { name: "Onion", icon: "🧅" },
  { name: "Chicken", icon: "🍗" },
  { name: "Spinach", icon: "🥬" },
];

export function IngredientSearch() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);

  const handleIngredientAdd = (ingredient: string) => {
    if (selectedIngredients.length >= 10 || selectedIngredients.includes(ingredient)) {
      return;
    }
    setSelectedIngredients([...selectedIngredients, ingredient]);
    setInputValue("");
    setSuggestions([]);
  };

  const handleIngredientRemove = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const filtered = popularIngredients.filter(ing => 
        ing.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleIngredientAdd(inputValue.trim());
    }
  };

  return (
    <section className="relative px-4 py-20 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
            <h2 className="text-4xl font-bold tracking-tight">
              What ingredients do you have?
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            <span className="text-emerald-500 font-medium">{selectedIngredients.length}</span>/10 ingredients selected
          </p>
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Type ingredients you have... (tomato, rice, onion)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full h-14 px-6 rounded-2xl bg-background/50 border-2 border-muted shadow-lg"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Button variant="default" className="bg-emerald-500 hover:bg-emerald-600">
              Find Recipes →
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-background/80 border rounded-2xl shadow-lg overflow-hidden">
              {suggestions.map((ing) => (
                <button
                  key={ing.name}
                  onClick={() => handleIngredientAdd(ing.name)}
                  className="w-full px-6 py-3 text-left hover:bg-emerald-500/10 flex items-center gap-3"
                >
                  <span className="text-xl">{ing.icon}</span>
                  <span className="font-medium">{ing.name}</span>
                </button>
              ))}
            </div>
          )}

          {selectedIngredients.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedIngredients.map((ing) => (
                <Badge
                  key={ing}
                  variant="secondary"
                  className="px-4 py-2 text-base group hover:bg-red-500/10"
                >
                  {ing}
                  <button
                    onClick={() => handleIngredientRemove(ing)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 text-muted-foreground">
              Popular ingredients:
            </h3>
            <div className="flex flex-wrap gap-3">
              {popularIngredients.map((ing) => (
                <Badge
                  key={ing.name}
                  variant="secondary"
                  onClick={() => handleIngredientAdd(ing.name)}
                  className="px-4 py-2 text-base cursor-pointer hover:bg-emerald-500/10"
                >
                  <span className="mr-2 text-lg">{ing.icon}</span>
                  {ing.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IngredientSearch;