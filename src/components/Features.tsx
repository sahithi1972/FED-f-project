import { Leaf, Clock, DollarSign, Award, Calendar, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Smart Ingredient Tracking",
    description: "Add ingredients you have at home and get instant recipe suggestions to use them before they expire.",
    color: "text-primary",
  },
  {
    icon: Clock,
    title: "Quick & Easy Recipes",
    description: "Filter recipes by cooking time. Perfect for busy office workers and students with 15-30 minute meals.",
    color: "text-accent",
  },
  {
    icon: DollarSign,
    title: "Budget-Friendly",
    description: "Find affordable recipes under ₹50 per serving. Save money while reducing waste.",
    color: "text-secondary",
  },
  {
    icon: Award,
    title: "Waste Reduction Rewards",
    description: "Earn eco-badges and points for repurposing leftovers and preventing food waste.",
    color: "text-primary",
  },
  {
    icon: Calendar,
    title: "Leftover Management",
    description: "Track leftovers with expiry alerts and get suggestions to transform them into new delicious meals.",
    color: "text-secondary",
  },
  {
    icon: Lightbulb,
    title: "Smart Substitutions",
    description: "Missing an ingredient? Get instant substitution suggestions based on what you have in your kitchen.",
    color: "text-accent",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#34D399]/10 via-transparent to-transparent"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#34D399]/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-[#34D399]/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-[#34D399] to-[#FFB800] bg-clip-text text-transparent pb-2">
            Your Kitchen's Best Friend
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-normal">
            Everything you need to cook smarter, save money, and reduce food waste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="group relative p-[1px] rounded-2xl transition-all duration-500 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#34D399]/30 via-[#FFB800]/20 to-[#34D399]/30"></div>
              
              {/* Content */}
              <div className="relative h-full rounded-2xl bg-white dark:bg-card p-6 md:p-8 backdrop-blur-sm border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#34D399]/10 to-[#FFB800]/5 border border-[#34D399]/20 touch-target">
                    <feature.icon className="h-6 w-6 text-[#34D399] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-800 dark:text-white group-hover:text-[#34D399] transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-[#34D399] transition-colors duration-300 font-normal">
                  {feature.description}
                </p>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#34D399]/5 via-transparent to-[#FFB800]/5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
