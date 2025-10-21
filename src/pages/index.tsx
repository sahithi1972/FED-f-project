import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Recipes from "../components/Recipes";
import About from "../components/About";
import ImpactDashboard from "../components/ImpactDashboard";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const Index = () => {
  console.log('Rendering Index component');
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Recipes />
        <ImpactDashboard />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
