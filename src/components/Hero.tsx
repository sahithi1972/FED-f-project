import { Button } from "./ui/button";
import { Leaf, ChefHat, TrendingDown, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Reduce Food Waste by 80%</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl leading-tight">
            Transform Leftovers into{" "}
            <span className="bg-gradient-eco bg-clip-text text-transparent">Delicious Meals</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Turn your leftover ingredients into delicious meals. Get personalized recipes based on what you have, track waste reduction, and earn rewards for sustainable cooking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="hero" size="lg" className="text-base">
              <ChefHat className="h-5 w-5" />
              Start Cooking Smart
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              <Leaf className="h-5 w-5" />
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 w-full max-w-3xl">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Easy Recipes</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-secondary">5kg</div>
              <div className="text-sm text-muted-foreground">Avg. Waste Saved</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-accent">
                <TrendingDown className="inline h-8 w-8" />
              </div>
              <div className="text-sm text-muted-foreground">80% Less Waste</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
