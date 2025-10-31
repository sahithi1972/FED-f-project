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
import { cn } from "@/lib/utils";
import { Heart, Clock, Award, Star } from "lucide-react";
import React from "react";

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
    image,
    cookingTime,
    difficulty,
    rating,
    cuisineType,
    dietaryPreferences,
    isFavorite,
  } = recipe;

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-4px] duration-300",
        className
      )}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          <img
            src={image || '/placeholder-recipe.jpg'}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
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
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between">
          <h3
            className="line-clamp-2 cursor-pointer text-lg font-semibold hover:text-primary"
            onClick={() => onClick?.(id)}
          >
            {title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {cookingTime} mins
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {difficulty}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{cuisineType}</Badge>
          {dietaryPreferences.map((pref) => (
            <Badge key={pref} variant="outline">
              {pref}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onClick?.(id)}
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
});