import { useState } from "react";
import { Search, X, Check, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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

const dietaryOptions = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Gluten-Free", value: "gluten-free" },
  { label: "Dairy-Free", value: "dairy-free" },
];

function IngredientSearch() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'filters'>('ingredients');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFindRecipes = () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please add at least one ingredient"
      });
      return;
    }

    navigate('/initial-search', { 
      state: { ingredients: selectedIngredients } 
    });
  };

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
    <section id="ingredient-search" className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-20 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-5xl relative">
        <div className="text-center mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full blur-md opacity-30 animate-pulse"></div>
              <div className="relative bg-emerald-50 dark:bg-black/40 p-3 rounded-full border border-emerald-500/30 shadow-lg">
                <Search className="w-12 h-12 text-emerald-600 dark:text-emerald-500" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center px-4 sm:px-0 text-foreground dark:text-white">
              What ingredients do you have?
            </h2>
          </div>
          <p className="text-xl text-muted-foreground/80 dark:text-emerald-400/80 mb-8">
            <span className="text-emerald-500 font-semibold">{selectedIngredients.length}</span>/10 ingredients selected
          </p>
        </div>

        <div className="relative">
          <div className="relative group">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 to-amber-500/50 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            
            <Input
              type="text"
              placeholder="Type ingredients..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full h-16 sm:h-20 px-6 text-lg sm:text-xl rounded-2xl bg-background/80 dark:bg-black/40 backdrop-blur-md border-2 border-emerald-500/20 dark:border-white/10 shadow-xl placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300"
            />
          </div>

          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
            <Button 
              variant="hero"
              size="lg"
              className="group shadow-lg hover:shadow-emerald-500/30 hover:scale-105 relative transition-all duration-300 after:absolute after:inset-0 after:rounded-lg after:bg-emerald-500/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
              onClick={handleFindRecipes}
            >
              Find Recipes
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-background/80 dark:bg-black/60 backdrop-blur-md border border-emerald-500/20 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
              {suggestions.map((ing) => (
                <button
                  key={ing.name}
                  onClick={() => handleIngredientAdd(ing.name)}
                  className="w-full px-6 py-3 text-left hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 flex items-center gap-3 transition-colors duration-200"
                >
                  <span className="text-xl transform transition-transform duration-200 hover:scale-110">{ing.icon}</span>
                  <span className="font-medium">{ing.name}</span>
                </button>
              ))}
            </div>
          )}

          {selectedIngredients.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedIngredients.map((ing) => (
                <Badge
                  key={ing}
                  variant="secondary"
                  className="px-4 py-2 text-base bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all duration-300 group"
                >
                  {ing}
                  <button
                    onClick={() => handleIngredientRemove(ing)}
                    className="ml-2 text-muted-foreground hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-12">
            <h3 className="text-lg font-medium mb-6 text-foreground/70 dark:text-emerald-400/80 text-center">
              Popular ingredients:
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {popularIngredients.map((ing) => (
                <Badge
                  key={ing.name}
                  onClick={() => handleIngredientAdd(ing.name)}
                  className={`group px-5 py-3 my-1 cursor-pointer text-base font-medium border-2 border-transparent hover:border-green-400 
                    ${selectedIngredients.includes(ing.name) 
                      ? 'bg-emerald-600 text-white shadow-md' 
                      : 'bg-amber-100/80 dark:bg-amber-500/20 hover:bg-amber-200/80 dark:hover:bg-amber-500/30'} 
                    hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-out`}
                >
                  <span className="mr-2.5 text-xl transform inline-block transition-transform duration-200 group-hover:scale-110">{ing.icon}</span>
                  {ing.name}
                  {selectedIngredients.includes(ing.name) && (
                    <Check className="inline-block ml-2 w-4 h-4" />
                  )}
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