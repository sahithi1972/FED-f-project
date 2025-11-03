
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import About from "../components/About";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import ChatButton from "../components/ChatButton";
import IngredientSearch from "../components/IngredientSearch";
import { useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import { useAuthModal } from "../contexts/auth-modal-context";


const Index = () => {
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();

  useEffect(() => {
    if (!loading && !user) {
      openModal('signin');
    }
  }, [user, loading, openModal]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <IngredientSearch />
        <Features />
        <HowItWorks />
        <About />
        <CTA />
      </main>
      <Footer />
      <ChatButton />
    </div>
  );
};

export default Index;
