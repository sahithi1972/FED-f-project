import { useState } from 'react';
import { ChefHat, ArrowRight, Sparkles, UtensilsCrossed, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface EmptyStateProps {
  ingredients?: string[];
  onExplorePopular: () => void;
  onUploadRecipe: () => void;
}

export function EmptyState({ ingredients, onExplorePopular, onUploadRecipe }: EmptyStateProps) {
  const [isStirring, setIsStirring] = useState(true);

  // Function to suggest ingredients based on current combination
  const suggestAdditions = (currentIngredients: string[] = []): string[] => {
    if (currentIngredients.includes("Tomato") && currentIngredients.includes("Onion")) {
      return ["Garlic", "Rice"];
    }
    if (currentIngredients.includes("Rice")) {
      return ["Vegetables", "Chicken"];
    }
    if (currentIngredients.includes("Potato")) {
      return ["Cheese", "Onion"];
    }
    if (currentIngredients.length === 0) {
      return ["Rice", "Potato", "Chicken"];
    }
    return ["Rice", "Cheese"];
  };

  const suggestions = suggestAdditions(ingredients);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6"
    >
      {/* Animated Bowl with Spoon */}
      <div className="relative w-24 h-24 mb-6">
        <motion.div
          animate={{
            rotate: isStirring ? [0, 360] : 0
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1
          }}
          onHoverStart={() => setIsStirring(true)}
          onHoverEnd={() => setIsStirring(false)}
          className="relative"
        >
          <UtensilsCrossed size={64} className="text-primary/60" />
        </motion.div>
      </div>

      {/* Main Message */}
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight">
          {ingredients && ingredients.length > 0
            ? `No recipes found for ${ingredients.join(", ")}`
            : "No recipes match your criteria"}
        </h3>
        <p className="text-muted-foreground max-w-[600px]">
          Don't worry! We can help you find something delicious to cook.
        </p>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Try adding these ingredients:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((ingredient) => (
            <TooltipProvider key={ingredient}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 hover:bg-primary/5 cursor-pointer transition-colors"
                  >
                    {ingredient}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Add {ingredient}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          variant="default"
          size="lg"
          onClick={onExplorePopular}
          className="space-x-2"
        >
          <Sparkles size={16} />
          <span>Explore Popular Recipes</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onUploadRecipe}
          className="space-x-2"
        >
          <Upload size={16} />
          <span>Share Your Recipe</span>
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-8 text-sm text-muted-foreground">
        <p>Quick tips:</p>
        <ul className="mt-2 space-y-1">
          <li>• Try using broader ingredients (e.g., "Vegetables" instead of specific ones)</li>
          <li>• Remove some filters to see more results</li>
          <li>• Check out our trending recipes for inspiration</li>
        </ul>
      </div>
    </motion.div>
  );
}