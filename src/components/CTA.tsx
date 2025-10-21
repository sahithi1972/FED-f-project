import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { SignInDialog } from "./SignInDialog";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();
  return (
    <section className="py-12 sm:py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-eco p-12 md:p-16 shadow-elevated">
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">Join 10,000+ eco-conscious cooks</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground max-w-3xl">
              Ready to Transform Your Kitchen?
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Start your zero-waste cooking journey today. Get personalized recipes, track your impact, and earn rewards.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              {showSignIn ? (
                <SignInDialog />
              ) : (
                <Button
                  size="lg"
                  className="text-white bg-gradient-to-r from-[#F97316] to-[#FB923C] px-8 py-4 rounded-lg font-semibold hover:scale-105 shadow-xl transition-all duration-300"
                  onClick={() => setShowSignIn(true)}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                className="text-[#2D7A3E] border-[#2D7A3E] px-8 py-4 rounded-lg font-semibold hover:bg-[#2D7A3E] hover:text-white transition-colors duration-300"
                onClick={() => navigate('/demo')}
              >
                Watch Demo
              </Button>
            </div>

            <p className="text-sm text-primary-foreground/80 pt-2">
              No credit card required • Free forever plan available
            </p>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
