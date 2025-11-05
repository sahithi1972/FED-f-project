import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { login, register } = useAuth();

  const cuisines = ["Indian", "Italian", "Asian", "Mexican", "Chinese"];
  const restrictions = ["Vegetarian", "Vegan", "Gluten-free", "Egg-free"];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, rememberMe);
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      alert('You must agree to the Terms & Conditions.');
      return;
    }

    try {
      // Use register from useAuth (only email, password, name supported)
  await register(email, password, email.split('@')[0]);
  // After successful registration, switch the modal to sign-in mode
  // (remove blocking browser alert so user is immediately shown the sign-in form)
  setMode('signin');
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
    } catch (error: any) {
      alert(error?.message || 'Registration failed.');
    }
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
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                      className="text-[#2D7A3E] hover:underline"
                    >
                      Terms & Conditions
                    </button>
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

      {/* Terms & Conditions inline modal */}
      <Dialog open={showTermsModal} onOpenChange={() => setShowTermsModal(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
          </DialogHeader>

          <div className="p-4 max-h-[60vh] overflow-y-auto text-sm space-y-4">
            <p className="font-medium">Welcome to ZeroWasteChef — Terms & Conditions (Sample)</p>
            <p>
              These are placeholder terms and conditions for demonstration purposes. By using this service you agree to the following:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You will try to reduce food waste where possible.</li>
              <li>Content you upload must be your own or properly licensed.</li>
              <li>We are not responsible for any damages resulting from use of recipes.</li>
              <li>We may modify these terms from time to time; continued use constitutes acceptance.</li>
            </ul>
            <p>
              This is a demo placeholder. Replace with your legal terms before going to production.
            </p>
          </div>

          <div className="flex justify-end gap-2 p-4">
            <Button variant="outline" onClick={() => setShowTermsModal(false)}>Close</Button>
            <Button onClick={() => { setAcceptTerms(true); setShowTermsModal(false); }}>Confirm & Accept</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}