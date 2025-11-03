// COPILOT:
// Enhance recipe card UI:
// - Add a rounded image placeholder at top
// - Add recipe title in bold
// - Add small badge showing "Match: {matchScore}%"
// - Add Time and Cost line below
// - Add 2-3 small tags as rounded badges
// Make hover slightly lift with shadow.
// Do not remove props or logic. Only change styling.


import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { cn, getRecipeImage } from "@/lib/utils";
import { Heart, Clock, Award, Star } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

import { type Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  onFavoriteToggle?: (id: string) => void;
  onClick?: (id: string) => void;
  viewMode?: string;
}

export const RecipeCard = React.memo(function RecipeCard({
  recipe,
  className,
  onFavoriteToggle,
  onClick,
  viewMode,
}: RecipeCardProps) {
  const {
    id,
    title,
    cookingTime,
    difficulty,
    rating,
    cuisine,
    dietary,
    isFavorite,
  } = recipe;
  // resolve image using helper to tolerate imageUrl/image/mainImage
  const imageSrc = getRecipeImage(recipe);
  // compute a deterministic local fallback index (1..12) based on title
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  };
  const fallbackIndex = ((recipe?.title ? hash(String(recipe.title)) : 0) % 12) + 1;
  const fallbackImage = `/images/recipes/recipe-${fallbackIndex}.jpg`;

  // If helper returned a placeholder, use the deterministic local fallback.
  // Otherwise start with the helper result (which may be a remote URL).
  let resolvedImage = imageSrc === '/placeholder.svg' ? fallbackImage : imageSrc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ translateY: -4 }}
      className={cn("group", className)}
    >
      <Card className={cn("overflow-hidden transition-all duration-300 will-change-transform flex flex-col h-full", "hover:shadow-2xl") }>
        <CardHeader className="p-0">
          {/* Use a fixed image height so all cards render the same visual height */}
          <div className="relative h-44 md:h-56 overflow-hidden rounded-t-lg bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img
              src={resolvedImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                // Avoid repeating the same fallback loop: if we haven't applied the local fallback yet, do so.
                if (!img.dataset.fallbackApplied) {
                  img.dataset.fallbackApplied = '1';
                  img.src = fallbackImage;
                  return;
                }
                // final fallback -> placeholder
                img.src = '/placeholder.svg';
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle?.(id);
              }}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-4 flex-1 flex flex-col">
          <div className="flex flex-col gap-2">
            <h3
              className="line-clamp-2 cursor-pointer text-xl font-semibold text-emerald-300 leading-tight"
              onClick={() => onClick?.(id)}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="flex items-center gap-1 bg-emerald-800 text-emerald-300">
                <Clock className="h-3 w-3" />
                <span className="text-sm text-emerald-300">{cookingTime} mins</span>
              </Badge>
              <Badge className="flex items-center gap-1 bg-emerald-800 text-emerald-300">
                <Award className="h-3 w-3" />
                <span className="text-sm text-emerald-300">{difficulty}</span>
              </Badge>
              <Badge className="flex items-center gap-1 bg-emerald-800 text-emerald-300">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-emerald-300">{rating.toFixed(1)}</span>
              </Badge>
            </div>
          </div>

          <div className="flex-1 mt-2">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-emerald-900 text-emerald-300">{cuisine}</Badge>
              {dietary.map((pref) => (
                <Badge key={pref} className="bg-emerald-900 text-emerald-300">{pref}</Badge>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 mt-auto">
          <motion.div whileHover={{ scale: 1.02 }} className="w-full">
            <Button
              variant="secondary"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition transform"
              onClick={() => onClick?.(id)}
            >
              View Recipe
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
});