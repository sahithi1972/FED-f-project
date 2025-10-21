import { Button } from "./ui/button";
import { ArrowRight, Sparkles, PlayCircle, ChefHat, Leaf } from "lucide-react";
import { useState } from "react";
import { SignInDialog } from "./SignInDialog";
import { useNavigate } from "react-router-dom";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

const CTA = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [setRef, isInView] = useIntersectionObserver({ threshold: 0.2 });
  const navigate = useNavigate();

  return (
    <section 
      ref={setRef}
      id="cta" 
      className="py-20 sm:py-32 relative overflow-hidden bg-gradient-to-b from-background via-emerald-50/20 to-background dark:from-background dark:via-emerald-950/10 dark:to-background"
      aria-labelledby="cta-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 p-8 sm:p-12 md:p-16 shadow-2xl">
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 dark:bg-emerald-600 backdrop-blur-sm shadow-lg transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
              }`}
            >
              <ChefHat className="h-4 w-4 text-white animate-bounce" />
              <span className="text-sm font-medium text-white">Join 10,000+ eco-conscious cooks</span>
              <Leaf className="h-4 w-4 text-white animate-bounce animation-delay-200" />
            </div>

            <h2 
              id="cta-title"
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl tracking-tight transition-all duration-700 delay-150 ${
                isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              Ready to Transform <br className="sm:hidden" />
              Your Kitchen?
            </h2>

            <p className={`text-lg md:text-xl text-white/90 max-w-2xl transition-all duration-700 delay-300 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Start your zero-waste cooking journey today. Get personalized recipes, track your impact, and earn rewards.
            </p>

            <div className={`flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto transition-all duration-700 delay-500 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {showSignIn ? (
                <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
              ) : (
                <Button
                  size="lg"
                  variant="hero"
                  className="w-full sm:w-auto relative group overflow-hidden"
                  onClick={() => setShowSignIn(true)}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/20 transition-colors duration-300"
                onClick={() => navigate('/demo')}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className={`flex items-center gap-6 text-sm text-white/80 pt-2 transition-all duration-700 delay-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>No credit card required</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>

          {/* Background patterns */}
          <div className="absolute inset-0 w-full h-full mix-blend-overlay opacity-10">
            <svg className="absolute inset-0 w-full h-full" width="720" height="480" viewBox="0 0 720 480" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="url(#squares)" d="M0 0h720v480H0z"/>
              <defs>
                <pattern id="squares" patternUnits="userSpaceOnUse" width="32" height="32">
                  <path d="M0 0h32v32H0z"/>
                  <path fill="rgba(255,255,255,0.1)" d="M0 0h16v16H0z"/>
                </pattern>
              </defs>
            </svg>
          </div>

          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400 to-amber-400 opacity-30 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-400 to-emerald-400 opacity-30 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
