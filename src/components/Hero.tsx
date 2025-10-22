import { useState } from "react";
import { Button } from "./ui/button";
import { ChefHat, TrendingDown, ArrowDown, Play } from "lucide-react";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [setRef, isInView] = useIntersectionObserver({ threshold: 0.1 });

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section 
      ref={setRef}
      id="hero" 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24 md:py-32"
      aria-label="Welcome to Zero Waste Chef"
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        {!isVideoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <Play className="w-16 h-16 text-emerald-500 animate-pulse" />
          </div>
        )}
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/images/gif.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
      
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`flex flex-col items-center text-center space-y-8 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight max-w-4xl tracking-tight [text-shadow:_2px_2px_4px_rgb(0_0_0_/_20%)]">
            Cook Smart with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              What You Have
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-emerald-400 max-w-2xl font-medium px-4 transition-all duration-500 delay-150 mb-6">
            Transform your available ingredients into delicious meals. Smart cooking starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 px-4 mb-12 transition-all duration-500 delay-300">
            <Button 
              size="lg" 
              variant="hero"
              className="w-full sm:w-auto min-w-[200px] relative overflow-hidden group hover:scale-105 transition-all duration-300 px-10 py-4"
              onClick={() => scrollToSection('ingredient-search')}
            >
              <ChefHat className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              Find Recipes
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto min-w-[200px] text-emerald-400 border-3 border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300 px-10 py-4"
              onClick={() => scrollToSection('how-it-works')}
            >
              See How It Works
              <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 w-full max-w-3xl text-center transition-all duration-500 delay-500">
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 transition-all duration-300 group-hover:scale-110">
                200+
              </div>
              <div className="text-sm text-emerald-400/90">Easy Recipes</div>
            </div>
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 transition-all duration-300 group-hover:scale-110">
                5kg
              </div>
              <div className="text-sm text-emerald-400/90">Avg. Waste Saved</div>
            </div>
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 flex items-center justify-center gap-2 transition-all duration-300 group-hover:scale-110">
                <TrendingDown className="h-8 w-8" />
                80%
              </div>
              <div className="text-sm text-emerald-400/90">Less Waste</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
    </section>
  );
};

export default Hero;
