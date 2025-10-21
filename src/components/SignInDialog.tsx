import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { GetStartedDialog } from "./GetStartedDialog";
import { useAuth } from "../contexts/auth-context";
import { EyeIcon, EyeOffIcon, X } from "lucide-react";
import { cn } from "../lib/utils";

export function SignInDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      setIsOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ password: "Invalid email or password" });
    }
  };

  const handleSocialSignIn = (provider: string) => {
    console.log(`Signing in with ${provider}`);
    // Here you would implement the actual social sign-in logic
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="absolute right-4 top-4">
          <DialogClose asChild>
            <Button variant="ghost" className="h-6 w-6 p-0 rounded-md" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl text-center font-bold">Welcome Back</DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            Sign in to continue to ZeroWasteChef
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 px-6 pb-6">
          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={cn("h-11", errors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={cn("h-11 pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button variant="link" className="text-sm px-0">
                Forgot password?
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium" 
              variant="hero"
              loading={isLoading}
              loadingText="Signing in..."
            >
              Sign in
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Sign In Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="h-11"
              onClick={() => handleSocialSignIn('Google')}
              loading={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.35 5.35c1.56 1.56 2.37 3.61 2.37 5.65 0 .27-.03.54-.07.81h-6.89v-2.91h4.43c-.18-.88-.74-1.64-1.54-2.12l1.7-1.43zM12 4c2.04 0 3.92.7 5.41 1.87l-2.01 1.69C14.29 6.69 13.19 6 12 6c-2.21 0-4 1.79-4 4H6c0-3.31 2.69-6 6-6zm-6 8c0-1.09.29-2.12.79-3.01l1.7 1.43C7.74 11.36 7 12.64 7 14h2c0-1.66 1.34-3 3-3v2H7v-1zm11.7 2.35c-.38 1.88-1.49 3.55-3.07 4.63C13.79 19.64 12.91 20 12 20c-2.59 0-4.86-1.37-6.13-3.43l2-1.68C8.88 16.76 10.33 18 12 18c1.79 0 3.29-1.13 3.88-2.71h-3.88v-2h6.7c.04.27.07.54.07.81 0 1.94-.81 3.7-2.37 5.25z"/>
              </svg>
            </Button>

            <Button 
              variant="outline" 
              className="h-11"
              onClick={() => handleSocialSignIn('Facebook')}
              loading={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </Button>

            <Button 
              variant="outline" 
              className="h-11"
              onClick={() => handleSocialSignIn('Apple')}
              loading={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </Button>
          </div>
        </div>

        <div className="p-6 bg-muted/50 border-t">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <GetStartedDialog />
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}