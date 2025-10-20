import { Leaf, Clock, DollarSign, Award, Calendar, Lightbulb } from "lucide-react";
import { Card, CardContent } from "./ui/card";

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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Your Kitchen's Best Friend
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to cook smarter, save money, and reduce food waste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] animate-slide-up border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-eco flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
