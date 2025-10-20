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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start reducing food waste in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="space-y-4">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-eco text-primary-foreground font-bold text-xl shadow-card">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>

              {/* Arrow connector (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-8 -right-4 h-8 w-8 text-primary/30" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg">
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
