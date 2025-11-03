import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Recipe {
  id: string;
  title: string;
  image: string;
  prepTime: string;
  difficulty: string;
  tags: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-emerald-500/20 bg-black/40 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300",
        className
      )}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="aspect-video overflow-hidden"
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </motion.div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold tracking-tight text-emerald-50 group-hover:text-emerald-400 transition-colors duration-300">
          {recipe.title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors duration-300"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{recipe.prepTime}</span>
            <span>•</span>
            <span>{recipe.difficulty}</span>
          </div>
          <Button
            variant="ghost"
            className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
          >
            View Recipe
          </Button>
        </div>
      </div>
    </motion.div>
  );
}