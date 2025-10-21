import { ChefHat, Clock, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const recipes = [
  {
    title: "Zero-Waste Vegetable Curry",
    time: "30 mins",
    servings: "4",
    image: "/recipes/curry.jpg",
    description: "A delicious curry that uses vegetable stems, leaves, and peels",
  },
  {
    title: "Leftover Rice Stir-Fry",
    time: "20 mins",
    servings: "3",
    image: "/recipes/stir-fry.jpg",
    description: "Transform yesterday's rice into an amazing stir-fry",
  },
  {
    title: "Overripe Banana Bread",
    time: "45 mins",
    servings: "8",
    image: "/recipes/banana-bread.jpg",
    description: "Perfect way to use those overripe bananas",
  },
];

const Recipes = () => {
  return (
    <section id="recipes" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Popular Zero-Waste Recipes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Delicious recipes that help reduce food waste and save money
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <Card
              key={index}
              className="group hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] animate-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 bg-gradient-eco/20" />
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{recipe.title}</h3>
                <p className="text-muted-foreground">{recipe.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
                <Button className="w-full group-hover:bg-primary/90">
                  <ChefHat className="h-4 w-4 mr-2" />
                  View Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recipes;