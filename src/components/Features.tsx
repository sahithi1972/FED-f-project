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
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-background via-background/98 to-background"
      aria-labelledby="features-title"
    >
      {/* Subtle decorative background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(22 163 74 / 0.15) 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            id="features-title"
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 dark:from-emerald-300 dark:via-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent leading-tight tracking-tight antialiased"
            style={{ textRendering: 'geometricPrecision' }}
          >
            Smart Features, Better Cooking
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-500/30 via-emerald-400/40 to-emerald-500/30 dark:from-emerald-400/30 dark:via-emerald-300/40 dark:to-emerald-400/30 rounded-full mx-auto mb-10 blur-[0.5px]"></div>
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto font-medium antialiased">
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
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 rounded-2xl shadow-md backdrop-blur-sm group-hover:shadow-xl group-hover:shadow-emerald-500/5 dark:group-hover:shadow-emerald-400/5 transition-all duration-500"></div>

              {/* Card Content */}
              <div className="relative p-6 sm:p-8 rounded-2xl border border-emerald-200/20 dark:border-emerald-800/20 group-hover:border-emerald-500/30 dark:group-hover:border-emerald-400/30 transition-all duration-500">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5 dark:from-emerald-400/10 dark:via-transparent dark:to-emerald-400/5 rounded-2xl"></div>
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
                  className="relative text-xl font-semibold text-center mb-3 text-gray-900 dark:text-gray-100 tracking-normal min-h-[28px] px-2"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                >
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed [word-spacing:0.5px]">
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
