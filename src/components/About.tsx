import { Heart, Leaf, Globe } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
            About ZeroWasteChef
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our mission is to make sustainable cooking easy and enjoyable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-eco flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
            <p className="text-muted-foreground">
              To empower home cooks to reduce food waste while creating delicious meals
            </p>
          </div>

          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-eco flex items-center justify-center">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Our Impact</h3>
            <p className="text-muted-foreground">
              Helping reduce food waste one recipe at a time, saving both money and the environment
            </p>
          </div>

          <div className="space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-eco flex items-center justify-center">
              <Globe className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Our Community</h3>
            <p className="text-muted-foreground">
              Join thousands of eco-conscious cooks making a difference in their kitchens
            </p>
          </div>
        </div>

        <div className="mt-16 text-center space-y-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold text-foreground">Our Story</h3>
          <p className="text-muted-foreground">
            ZeroWasteChef started with a simple idea: make it easy for people to cook sustainably. 
            We believe that reducing food waste shouldn't be a chore, but an opportunity to get creative in the kitchen. 
            Our platform combines smart technology with practical cooking tips to help you make the most of every ingredient.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;