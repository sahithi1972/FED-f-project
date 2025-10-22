import { Heart, Leaf, Globe } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-background via-background/98 to-background/95">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(22 163 74 / 0.4) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500 bg-clip-text text-transparent pb-2">
            About ZeroWasteChef
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto font-medium">
            Our mission is to make sustainable cooking easy and enjoyable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <div className="group relative p-6 rounded-2xl bg-white/[0.01] dark:bg-black/[0.01] backdrop-blur-sm border border-emerald-500/10 dark:border-emerald-400/10 transition-all duration-300 hover:border-emerald-500/20 dark:hover:border-emerald-400/20 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/[0.02] to-emerald-600/[0.02] dark:from-emerald-400/[0.02] dark:to-emerald-500/[0.02]"></div>
            <div className="space-y-4 text-center relative">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 dark:from-emerald-400/20 dark:to-emerald-500/20 p-[1px] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)] dark:shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
                <div className="w-full h-full rounded-xl bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">Our Mission</h3>
              <p className="text-muted-foreground/80 group-hover:text-foreground/90 transition-colors duration-300">
                To empower home cooks to reduce food waste while creating delicious meals
              </p>
            </div>
          </div>

          <div className="group relative p-6 rounded-2xl bg-white/[0.01] dark:bg-black/[0.01] backdrop-blur-sm border border-emerald-500/10 dark:border-emerald-400/10 transition-all duration-300 hover:border-emerald-500/20 dark:hover:border-emerald-400/20 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/[0.02] to-emerald-600/[0.02] dark:from-emerald-400/[0.02] dark:to-emerald-500/[0.02]"></div>
            <div className="space-y-4 text-center relative">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 dark:from-emerald-400/20 dark:to-emerald-500/20 p-[1px] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)] dark:shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
                <div className="w-full h-full rounded-xl bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <Leaf className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">Our Impact</h3>
              <p className="text-muted-foreground/80 group-hover:text-foreground/90 transition-colors duration-300">
                Helping reduce food waste one recipe at a time, saving both money and the environment
              </p>
            </div>
          </div>

          <div className="group relative p-6 rounded-2xl bg-white/[0.01] dark:bg-black/[0.01] backdrop-blur-sm border border-emerald-500/10 dark:border-emerald-400/10 transition-all duration-300 hover:border-emerald-500/20 dark:hover:border-emerald-400/20 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/[0.02] to-emerald-600/[0.02] dark:from-emerald-400/[0.02] dark:to-emerald-500/[0.02]"></div>
            <div className="space-y-4 text-center relative">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 dark:from-emerald-400/20 dark:to-emerald-500/20 p-[1px] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)] dark:shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
                <div className="w-full h-full rounded-xl bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <Globe className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">Our Community</h3>
              <p className="text-muted-foreground/80 group-hover:text-foreground/90 transition-colors duration-300">
                Join thousands of eco-conscious cooks making a difference in their kitchens
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
            <h3 className="text-2xl font-bold text-foreground px-4">Our Story</h3>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
          </div>
          <p className="text-muted-foreground/90 text-lg leading-relaxed">
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