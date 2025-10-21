import { Button } from "./ui/button";
import { ArrowRight, Plus, Search, ChefHat, Trophy } from "lucide-react";

const steps = [
  {
    icon: Plus,
    title: "Add Your Ingredients",
    description: "List what you have in your kitchen - vegetables, grains, leftovers, anything!",
    number: "01",
  },
  {
    icon: Search,
    title: "Get Recipe Matches",
    description: "Our smart algorithm finds recipes you can make with available ingredients.",
    number: "02",
  },
  {
    icon: ChefHat,
    title: "Cook & Track",
    description: "Follow easy recipes and log any leftovers for future meal suggestions.",
    number: "03",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Collect eco-badges and track your impact as you reduce food waste.",
    number: "04",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-20 overflow-hidden bg-white dark:bg-background">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50 dark:from-background dark:via-background dark:to-background/90"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#34D399]/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#34D399] to-[#FFB800] bg-clip-text text-transparent pb-2">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-[#34D399] font-medium max-w-2xl mx-auto">
            Start reducing food waste in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 relative">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative p-[1px] rounded-2xl transition-all duration-500 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#34D399]/30 via-[#FFB800]/20 to-[#34D399]/30"></div>
              
              {/* Content */}
              <div className="relative h-full rounded-2xl bg-white dark:bg-black/40 p-8 backdrop-blur-sm border border-gray-100 dark:border-white/10">
                <div className="flex justify-between items-start mb-6">
                  {/* Number Badge with gradient */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#34D399] to-[#FFB800] text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#34D399] to-[#FFB800]/80 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-[#34D399] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-[#34D399] transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Hover gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#34D399]/5 via-transparent to-[#FFB800]/5"></div>
              </div>

              {/* Arrow connector (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-[#34D399] transform group-hover:scale-110 transition-transform duration-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-[#34D399] to-[#FFB800] text-white hover:opacity-90 transition-opacity px-8 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
