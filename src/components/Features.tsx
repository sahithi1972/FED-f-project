import { useState } from "react";
import { ChefHat, Package, Wallet, MessageCircle, Sparkles, Leaf, PieChart, Utensils } from "lucide-react";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

const features = [
  {
    icon: ChefHat,
    title: "Smart Recipe Matching",
    description: "Get personalized recipe suggestions based on ingredients you already have.",
    gradient: "from-emerald-500 to-emerald-600",
    delay: 0,
  },
  {
    icon: Sparkles,
    title: "AI-Powered Guidance",
    description: "Get real-time cooking tips, ingredient substitutions, and recipe adjustments.",
    gradient: "from-amber-500 to-amber-600",
    delay: 200,
  },
  {
    icon: PieChart,
    title: "Waste Tracking",
    description: "Monitor and reduce your food waste with smart tracking and analytics.",
    gradient: "from-emerald-500 to-emerald-600",
    delay: 400,
  },
  {
    icon: Utensils,
    title: "Custom Meal Plans",
    description: "Generate personalized meal plans based on your preferences and available ingredients.",
    gradient: "from-amber-500 to-amber-600",
    delay: 600,
  },
];

const Features = () => {
  const [setRef, isInView] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section 
      ref={setRef}
      id="features" 
      className="py-20 sm:py-32 relative overflow-hidden"
      aria-labelledby="features-title"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white dark:from-background dark:via-emerald-950/10 dark:to-background"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            id="features-title"
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent"
          >
            Smart Features, <br className="sm:hidden" />
            Better Cooking
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform helps you cook smarter, waste less, and save more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${
                isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${feature.delay}ms` }}
              role="article"
              aria-labelledby={`feature-title-${index}`}
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-white/80 dark:from-gray-900 dark:to-gray-900/90 rounded-2xl shadow-md backdrop-blur-sm"></div>

              {/* Card Content */}
              <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden border border-emerald-200/20 dark:border-emerald-800/20">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-amber-500/20 rounded-2xl"></div>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                  </div>
                </div>

                {/* Content */}
                <h3 
                  id={`feature-title-${index}`}
                  className="text-xl font-bold text-center mb-3 text-gray-900 dark:text-white"
                >
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
