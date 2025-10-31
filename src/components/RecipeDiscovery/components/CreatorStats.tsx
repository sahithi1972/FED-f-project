import React from "react";
import { Trophy, Eye, Heart, Utensils } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface CreatorStatsProps {
  recipes: Recipe[];
}

export function CreatorStats({ recipes }: CreatorStatsProps) {
  const totalViews = recipes.reduce((sum, r) => sum + r.stats.views, 0);
  const totalLikes = recipes.reduce((sum, r) => sum + r.stats.likes, 0);
  const avgCookingTime = Math.round(
    recipes.reduce((sum, r) => sum + r.cookingTime, 0) / recipes.length || 0
  );

  const publishedRecipes = recipes.filter((r) => r.status === "published");
  const draftRecipes = recipes.filter((r) => r.status === "draft");
  const savedRecipes = recipes.filter((r) => r.status === "saved");

  const mostLikedRecipe = recipes.reduce((prev, current) => {
    return (prev.stats.likes > current.stats.likes) ? prev : current;
  }, recipes[0]);

  // Determine badge level
  const getBadgeInfo = (recipeCount: number) => {
    if (recipeCount >= 20) return { title: "Master Chef 👨‍🍳", color: "bg-gradient-to-r from-yellow-400 to-yellow-600" };
    if (recipeCount >= 10) return { title: "Top Contributor 🌟", color: "bg-gradient-to-r from-blue-400 to-blue-600" };
    if (recipeCount >= 5) return { title: "Recipe Creator 🔥", color: "bg-gradient-to-r from-green-400 to-green-600" };
    return { title: "Kitchen Explorer 🌱", color: "bg-gradient-to-r from-gray-400 to-gray-600" };
  };

  const badge = getBadgeInfo(publishedRecipes.length);

  return (
    <div className="space-y-6">
      {/* Creator Badge */}
      <div className={`p-4 rounded-lg text-white ${badge.color}`}>
        <h2 className="text-2xl font-bold">{badge.title}</h2>
        <p className="opacity-90">Keep creating to unlock more badges!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{recipes.length}</div>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {publishedRecipes.length} published • {draftRecipes.length} drafts • {savedRecipes.length} saved
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Avg. {Math.round(totalViews / publishedRecipes.length || 0)} per recipe
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Avg. {Math.round(totalLikes / publishedRecipes.length || 0)} per recipe
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Popular Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold truncate" title={mostLikedRecipe?.title}>
                {mostLikedRecipe?.title}
              </div>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {mostLikedRecipe?.stats.likes} likes • {mostLikedRecipe?.stats.views} views
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Average Cooking Time:</span>
              <Badge variant="secondary">{avgCookingTime} minutes</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Recipe Completion Rate:</span>
              <Badge variant="secondary">
                {Math.round((publishedRecipes.length / recipes.length) * 100)}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Engagement Rate:</span>
              <Badge variant="secondary">
                {Math.round((totalLikes / totalViews) * 100)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}