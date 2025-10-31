import React from "react";
import { RecipeCard } from "./RecipeCard";

export function RecipeGrid({ recipes, viewMode }) {
  return (
    <div className={`recipes-grid view-${viewMode}`}> 
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} viewMode={viewMode} />
      ))}
    </div>
  );
}
