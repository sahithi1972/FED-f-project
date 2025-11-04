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
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'filters'>('ingredients');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add background noise effect
  const noisePattern = "url('/images/noise.png')";

  // Styles with enhanced dark mode and glassmorphism
  const containerStyle = "p-6 flex flex-col h-full";
  const headerStyle = "text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent";
  const inputContainerStyle = "relative mb-8";
  const ingredientCountStyle = "text-xl text-center mb-6 text-emerald-300/90";
  const popularIngredientsStyle = "grid grid-cols-2 gap-4 mt-6";
  const ingredientButtonStyle = "group flex items-center p-4 rounded-xl backdrop-blur-sm bg-black/40 border-2 border-emerald-500/20 hover:bg-emerald-500/20 transition-all w-full text-left space-x-3";

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
    <section id="ingredient-search" className="relative min-h-screen bg-gradient-to-b from-black to-zinc-900/95 overflow-hidden">
        {/* Animated background elements with noise texture */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: noisePattern, opacity: 0.1 }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-emerald-500/10 via-emerald-500/5 to-transparent opacity-30"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-lg relative">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-lg opacity-40 animate-pulse"></div>
              <div className="relative bg-black/40 p-3 rounded-full border-2 border-emerald-500/40 shadow-lg backdrop-blur-sm">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center px-2 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              What ingredients do you have?
            </h2>
            <p className="text-lg text-emerald-400/90">
              <span className="text-emerald-300 font-semibold text-xl">{selectedIngredients.length}</span>
              <span className="text-emerald-500/80">/10</span> ingredients selected
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative group">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur opacity-50 group-hover:opacity-70 transition duration-500"></div>
            
            <Input
              type="text"
              placeholder="Type ingredients..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full h-16 px-6 text-lg rounded-xl bg-black/60 backdrop-blur-lg border-2 border-emerald-500/30 shadow-xl text-emerald-50 placeholder:text-emerald-400/60 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300"
            />
          </div>

          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
            <Button 
              variant="hero"
              size="lg"
              className="group relative px-6 py-3 text-base font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 rounded-xl overflow-hidden"
              onClick={handleFindRecipes}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/50 to-emerald-400/0 translate-x-[-100%] animate-shimmer"></div>
              Find Recipes
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-2 bg-black/80 backdrop-blur-xl border-2 border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden"
              >
                {suggestions.map((ing) => (
                  <button
                    key={ing.name}
                    onClick={() => handleIngredientAdd(ing.name)}
                    className="w-full px-6 py-4 text-left hover:bg-emerald-500/20 flex items-center gap-4 transition-all duration-200 group"
                  >
                    <span className="text-2xl transform transition-transform duration-200 group-hover:scale-110">{ing.icon}</span>
                    <span className="font-medium text-emerald-100 group-hover:text-emerald-200">{ing.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {selectedIngredients.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedIngredients.map((ing) => (
                <Badge
                  key={ing}
                  variant="secondary"
                  className="px-4 py-2 text-base bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-100 hover:bg-red-500/20 transition-all duration-300 group animate-in slide-in-from-bottom-2"
                >
                  {ing}
                  <button
                    onClick={() => handleIngredientRemove(ing)}
                    className="ml-2 text-emerald-300/70 hover:text-red-400 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-10">
            <h3 className="text-xl font-medium mb-6 text-emerald-300/90 text-center">
              Popular ingredients:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {popularIngredients.map((ing) => (
                <button
                  key={ing.name}
                  onClick={() => handleIngredientAdd(ing.name)}
                  className={`group relative flex items-center space-x-3 px-4 py-4 rounded-xl text-base font-medium w-full
                    ${selectedIngredients.includes(ing.name)
                      ? 'bg-emerald-500/30 ring-2 ring-emerald-500 text-emerald-200'
                      : 'bg-black/40 border-2 border-emerald-500/20 text-emerald-100/90'} 
                    hover:bg-emerald-500/20 active:scale-95 transform transition-all duration-200 backdrop-blur-sm`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{ing.icon}</span>
                    <span className="text-base">{ing.name}</span>
                  </div>
                  {selectedIngredients.includes(ing.name) && (
                    <Check className="absolute right-3 w-5 h-5 text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IngredientSearch;