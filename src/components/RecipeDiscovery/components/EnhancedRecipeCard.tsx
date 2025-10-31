import React from "react";
import { format } from "date-fns";
import { Eye, Heart, Clock, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HoverPreview } from "./HoverPreview";

interface Recipe {
  id: string;
  title: string;
  image: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  status: "published" | "draft" | "saved";
  stats: {
    views: number;
    likes: number;
    saves: number;
  };
  updatedAt: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusIcons = {
  published: "✅",
  draft: "📝",
  saved: "❤️",
};

const formatDate = (date: string) => {
  return format(new Date(date), "MMM d, yyyy");
};

export function EnhancedRecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-xl">{statusIcons[recipe.status]}</span>
            <Badge variant="outline" className="capitalize">
              {recipe.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                onEdit(recipe.id);
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                onDelete(recipe.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="aspect-video relative mb-4">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.cookingTime}m
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {recipe.stats.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {recipe.stats.likes}
          </span>
        </div>
        <span>
          Updated {formatDate(recipe.updatedAt)}
        </span>
      </CardFooter>

      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 p-6">
        <HoverPreview
          ingredients={recipe.ingredients}
          steps={recipe.steps}
          onViewFull={() => onEdit(recipe.id)}
        />
      </div>
    </Card>
  );
}