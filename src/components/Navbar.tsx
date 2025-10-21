import { Button } from "./ui/button";
import { Leaf, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { AuthDialog } from "./AuthDialog";
import { ArrowLeft } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => item.href.replace("#", ""));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Recipes", href: "/recipes" },
    { label: "Impact", href: "/impact" },
    { label: "How It Works", href: "/how-it-works" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-eco flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ZeroWasteChef</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium relative ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors ${
                    isActive
                      ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                      : ""
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <AuthDialog />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            {menuItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block py-2 text-sm font-medium relative ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors ${
                    isActive
                      ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-0.5 after:bg-primary after:rounded-full"
                      : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="flex flex-col gap-2 pt-4">
              <div className="flex justify-start px-2">
                <ThemeToggle />
              </div>
              <Button variant="ghost" className="w-full">Sign In</Button>
              <Button variant="hero" className="w-full">Get Started</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
