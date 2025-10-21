import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ChevronLeft, Clock, Award, Users, Star } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { cn } from "@/lib/utils";

interface RecipeDetailProps {
  recipe: {
    id: string;
    title: string;
    image: string;
    description: string;
    cookingTime: number;
    difficulty: string;
    servings: number;
    rating: number;
    cuisineType: string;
    dietaryPreferences: string[];
    ingredients: Array<{
      name: string;
      amount: string;
      unit: string;
    }>;
    instructions: string[];
    nutritionFacts: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    tips: string[];
    author: {
      name: string;
      image: string;
    };
  };
  onBack: () => void;
}

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Recipes
      </Button>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {recipe.cookingTime} mins
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                {recipe.difficulty}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {recipe.servings} servings
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {recipe.rating.toFixed(1)}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">{recipe.cuisineType}</Badge>
              {recipe.dietaryPreferences.map((pref) => (
                <Badge key={pref} variant="outline">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Instructions</h2>
            <ol className="ml-4 space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="list-decimal text-muted-foreground">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>

          <Separator />

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Tips</h2>
            <ul className="ml-4 space-y-2">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="list-disc text-muted-foreground">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-4 space-y-6 rounded-lg border p-4">
            <div>
              <h3 className="mb-4 text-xl font-semibold">Ingredients</h3>
              <ScrollArea className="h-[300px] pr-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ingredient</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipe.ingredients.map((ingredient, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {ingredient.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {ingredient.amount} {ingredient.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-xl font-semibold">Nutrition Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(recipe.nutritionFacts).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border p-3 text-center"
                  >
                    <div className="text-sm text-muted-foreground">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {key === "calories" ? value : `${value}g`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <img
                src={recipe.author.image}
                alt={recipe.author.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="text-sm text-muted-foreground">Recipe by</div>
                <div className="font-medium">{recipe.author.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}