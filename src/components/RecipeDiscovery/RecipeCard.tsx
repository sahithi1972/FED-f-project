"use client";
import React from "react";
import { Recipe } from "@/types/recipe";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  viewMode: "grid" | "list" | "compact";
  onClick?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, viewMode, onClick }: RecipeCardProps) {
  return (
    <div
      role="article"
      aria-label={recipe.title}
      className={cn("border p-4", viewMode === "list" && "flex")}
      onClick={() => onClick?.(recipe)}
    >
      {recipe.title}
    </div>
  );
}
