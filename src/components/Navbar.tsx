import { Button } from "./ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SignInDialog } from "./SignInDialog";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const handleNavigation = async (item: typeof menuItems[0]) => {
    if (item.requiresAuth && !currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    setIsNavigating(true);
    if (item.onClick) {
      await item.onClick();
    }
    setIsNavigating(false);
    if (isOpen) setIsOpen(false);
  };

  const menuItems = [
    { 
      label: "Home", 
      href: "/",
      onClick: () => {
        if (location.pathname === '/') {
          if (location.hash) {
            // If there's a hash in the URL, reload to clear it
            window.location.href = '/';
          } else {
            // Just scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    },
    { 
      label: "Recipes", 
      href: "/recipes",
      onClick: () => {
        // Handle any ingredient params if they exist
        const params = new URLSearchParams(location.search);
        const ingredients = params.get('ingredients');
        if (ingredients) {
          navigate(`/recipes?ingredients=${ingredients}`);
        }
      }
    },
    { 
      label: "How It Works",
      href: "/#how-it-works",
      onClick: () => {
        if (location.pathname === '/') {
          // If on homepage, scroll to section
          document.getElementById('how-it-works')?.scrollIntoView({
            behavior: 'smooth'
          });
        } else {
          // If on another page, navigate to homepage with section hash
          navigate('/#how-it-works');
        }
      }
    },
    { 
      label: "Dashboard", 
      href: "/dashboard",
      requiresAuth: true 
    },
    {
      label: "My Recipes",
      href: "/my-recipes",
      requiresAuth: true
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-eco flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ZeroWasteChef</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = item.href.startsWith('/') ? location.pathname === item.href : location.hash === item.href;
              const Component = item.href.startsWith('#') ? 'a' : Link;
              
              return (
                <Component
                  key={item.label}
                  href={item.href.startsWith('#') ? item.href : undefined}
                  to={item.href.startsWith('#') ? undefined : item.href}
                  onClick={() => handleNavigation(item)}
                  className={`text-sm font-medium relative ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors ${
                    isActive
                      ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
                      : ""
                  } ${isNavigating ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {item.label}
                </Component>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <SignInDialog 
              open={showAuthModal} 
              onOpenChange={setShowAuthModal}
            />
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
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`block py-2 text-sm font-medium relative ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors ${isNavigating ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => handleNavigation(item)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-2 pt-4 border-t">
              <div className="flex justify-start px-2">
                <ThemeToggle />
              </div>
              <SignInDialog 
                open={showAuthModal} 
                onOpenChange={setShowAuthModal} 
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
