import { ChefHat, Package, Wallet, MessageCircle } from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "Smart Recipe Matching",
    description: "Get personalized recipe suggestions based on ingredients you already have.",
  },
  {
    icon: Package,
    title: "Ingredient Management",
    description: "Smart ingredient tracking to help you cook efficiently and reduce waste.",
  },
  {
    icon: Wallet,
    title: "Cost Savings",
    description: "Save money by utilizing what you have and minimizing food waste.",
  },
  {
    icon: MessageCircle,
    title: "Chef AI Assistant",
    description: "Get real-time cooking guidance and ingredient substitution tips.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-12 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Smart Cooking Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how our AI-powered platform helps you cook smarter and reduce food waste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-[1.02] group relative overflow-hidden"
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-[#2D7A3E] to-orange-500 p-[1px] [mask-image:linear-gradient(white,white),linear-gradient(white,white)] [mask-composite:exclude]" />
              </div>

              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-[#2D7A3E]/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-[#2D7A3E]/20 transition-colors">
                <feature.icon className="w-10 h-10 text-[#2D7A3E]" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-center mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
