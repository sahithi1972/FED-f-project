import { Button } from "./ui/button";
import { ArrowRight, Plus, Search, ChefHat, Trophy } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignInDialog } from "./SignInDialog";

const steps = [
  {
    icon: Plus,
    title: "Add Your Ingredients",
    description: `List everything in your kitchen - fresh vegetables, grains, leftovers, spices, anything! Our smart system remembers your staples and tracks expiry dates automatically.`,
    features: [
      "Quick ingredient search with autocomplete",
      "Barcode scanning (coming soon)",
      "Expiry date tracking",
      "Storage location (fridge, pantry, freezer)",
    ],
    screenshot: "/images/add-ingredients.jpg",
    number: "01",
  },
  {
    icon: Search,
    title: "Get Recipe Matches",
    description: `Our AI-powered algorithm analyzes your ingredients and finds perfect recipe matches. We prioritize recipes using items that expire soon, helping you prevent waste.`,
    features: [
      "Smart ingredient matching",
      "Substitution suggestions",
      "Budget-based filtering",
      "Cuisine preferences",
    ],
    screenshot: "/images/recipe-matches.jpg",
    number: "02",
  },
  {
    icon: ChefHat,
    title: "Cook & Track",
    description: `Follow easy step-by-step instructions with helpful tips. Log leftovers for future meal planning and track your environmental impact.`,
    features: [
      "Interactive recipe instructions",
      "Cooking timers",
      "Video tutorials",
      "Leftover logging",
    ],
    screenshot: "/images/cooking.jpg",
    number: "03",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: `Every meal you cook contributes to reducing food waste. Collect eco-badges, track your savings, and compete on our leaderboard!`,
    features: [
      "Achievement badges",
      "Waste reduction stats",
      "Money saved tracking",
      "Community leaderboard",
    ],
    screenshot: "/images/rewards.jpg",
    number: "04",
  },
];

interface HowItWorksProps {
  mode?: 'section' | 'page';
}

const HowItWorks = ({ mode = 'section' }: HowItWorksProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isShowingSignIn, setIsShowingSignIn] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const handleStartCooking = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsShowingSignIn(true);
    }
  };

  // Intersection Observer for scroll animations
  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      setIsInView(entry.isIntersecting);
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2,
      rootMargin: "0px",
    });

    const section = document.getElementById('how-it-works');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section 
      id="how-it-works" 
      className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-background/98 to-background scroll-mt-20"
      aria-labelledby="how-it-works-title"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50 dark:from-background dark:via-background dark:to-background/90"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center space-y-4 mb-16 px-4 sm:px-0 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 
            id="how-it-works-title"
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500 bg-clip-text text-transparent pb-2"
          >
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground/90 max-w-2xl mx-auto font-medium">
            Start reducing food waste in 4 simple steps
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 relative transition-all duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
          {/* SVG container for connection lines */}
          <div className="absolute inset-0 hidden lg:block pointer-events-none">
            <svg className="w-full h-full">
              <g className="transform translate-y-1/2">
                {/* First connection */}
                <line 
                  x1="23%" y1="0" 
                  x2="27%" y2="0" 
                  stroke="rgb(16, 185, 129)" 
                  strokeWidth="3"
                />
                {/* Second connection */}
                <line 
                  x1="48%" y1="0" 
                  x2="52%" y2="0" 
                  stroke="rgb(16, 185, 129)" 
                  strokeWidth="3"
                />
                {/* Third connection */}
                <line 
                  x1="73%" y1="0" 
                  x2="77%" y2="0" 
                  stroke="rgb(16, 185, 129)" 
                  strokeWidth="3"
                />
              </g>
            </svg>
          </div>

          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`group relative p-[1px] rounded-2xl transition-all duration-700 ease-in-out ${
                isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: `${isInView ? index * 200 : (3 - index) * 200}ms`
              }}
              role="article"
              aria-labelledby={`step-title-${index}`}
            >
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-amber-500/20 to-emerald-500/30 dark:from-emerald-500/20 dark:via-amber-500/10 dark:to-emerald-500/20"></div>
              
              {/* Content */}
              <div className="relative h-full rounded-2xl bg-[#011f16] p-6 sm:p-8 border border-emerald-900/50">
                <div className="flex justify-between items-start mb-6">
                  {/* Number Badge with gradient */}
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500/80 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    aria-hidden="true"
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 
                    id={`step-title-${index}`}
                    className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-500 transition-colors duration-300"
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Hover gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/5"></div>
              </div>

              {/* No individual connection lines needed here - using SVG overlay */}
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 px-4 sm:px-0 transition-all duration-700 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {isShowingSignIn ? (
            <SignInDialog />
          ) : (
            <Button 
              size="lg"
              variant="hero"
              className="w-full sm:w-auto"
              onClick={handleStartCooking}
            >
              Start Cooking Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
