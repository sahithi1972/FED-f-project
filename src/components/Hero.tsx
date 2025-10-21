import { Button } from "./ui/button";
import { Leaf, ChefHat, TrendingDown, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight max-w-4xl">
            Cook Smart with{" "}
            <span className="text-[#34D399]">What You Have</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-[#34D399] max-w-2xl">
            Transform your available ingredients into delicious meals. Smart cooking starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-[#34D399] hover:bg-[#34D399]/90 text-white font-medium px-8"
            >
              <ChefHat className="h-5 w-5 mr-2" />
              Start Cooking Smart
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-[#34D399] border-[#34D399] hover:bg-[#34D399]/10"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 w-full max-w-3xl">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-[#34D399]">200+</div>
              <div className="text-sm text-[#34D399]">Easy Recipes</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-[#FFB800]">5kg</div>
              <div className="text-sm text-[#34D399]">Avg. Waste Saved</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-[#34D399]">
                <TrendingDown className="inline h-8 w-8" />
                80%
              </div>
              <div className="text-sm text-[#34D399]">Less Waste</div>
            </div>
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
