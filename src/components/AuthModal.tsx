import { useState } from "react";
import { Eye, EyeOff, Facebook } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth } from "../contexts/auth-context";

type AuthMode = "signin" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { login } = useAuth();

  const cuisines = ["Indian", "Italian", "Asian", "Mexican", "Chinese"];
  const restrictions = ["Vegetarian", "Vegan", "Gluten-free", "Egg-free"];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement sign up logic here
  };

  const PasswordStrengthIndicator = () => {
    const strength = password.length < 8 ? "weak" : 
                    password.length < 12 ? "medium" : "strong";
    
    return (
      <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
        <div 
          className={`h-full rounded-full transition-all ${
            strength === "weak" ? "w-1/3 bg-red-500" :
            strength === "medium" ? "w-2/3 bg-yellow-500" :
            "w-full bg-green-500"
          }`}
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 space-y-4">
          <DialogTitle className="text-2xl text-center font-bold">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {mode === "signin" 
              ? "Sign in to continue to ZeroWasteChef"
              : "Join our community of eco-conscious cooks"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-6">
          {mode === "signin" ? (
            // Sign In Form
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Button variant="link" className="text-sm px-0">
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-[#2D7A3E] hover:bg-[#2D7A3E]/90 text-white"
              >
                Sign In
              </Button>

              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                  or continue with
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="w-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </Button>
                <Button variant="outline" className="w-full">
                  <Facebook className="h-5 w-5 text-[#1877F2]" />
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.75c-5.385 0-9.75-4.365-9.75-9.75S6.615 2.25 12 2.25s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75zM12 6c-2.005 0-3.601 1.546-3.601 3.551 0 .247.027.486.074.714-.613-.098-1.188-.147-1.724-.147-1.087 0-2.049.241-2.049.241s-.306.128-.306.511c0 .384.304.511.304.511.453.145 1.072.321 1.558.435-.846.649-1.404 1.703-1.404 2.884 0 1.99 1.753 3.551 3.851 3.551.577 0 1.116-.118 1.595-.324.479.206 1.018.324 1.595.324 2.098 0 3.851-1.561 3.851-3.551 0-1.181-.558-2.235-1.404-2.884.486-.114 1.105-.29 1.558-.435 0 0 .304-.127.304-.511 0-.383-.306-.511-.306-.511s-.962-.241-2.049-.241c-.536 0-1.111.049-1.724.147.047-.228.074-.467.074-.714C15.601 7.546 14.005 6 12 6z"/>
                  </svg>
                </Button>
              </div>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                <PasswordStrengthIndicator />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label>Cuisine Preferences</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisines" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisines.map((cuisine) => (
                      <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dietary Restrictions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {restrictions.map((restriction) => (
                    <div key={restriction} className="flex items-center space-x-2">
                      <Checkbox
                        id={restriction.toLowerCase()}
                        checked={dietaryRestrictions.includes(restriction)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setDietaryRestrictions([...dietaryRestrictions, restriction]);
                          } else {
                            setDietaryRestrictions(
                              dietaryRestrictions.filter((r) => r !== restriction)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={restriction.toLowerCase()}>{restriction}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="/terms" className="text-[#2D7A3E] hover:underline">
                    Terms & Conditions
                  </a>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-[#2D7A3E] hover:bg-[#2D7A3E]/90 text-white"
                disabled={!acceptTerms}
              >
                Create Account
              </Button>
            </form>
          )}

          <div className="text-center text-sm">
            {mode === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-[#2D7A3E] hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-[#2D7A3E] hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}