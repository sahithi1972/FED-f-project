import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { EyeIcon, EyeOffIcon, X } from "lucide-react";
import { useAuth } from "../contexts/auth-context";
import { cn } from "../lib/utils";
import { signUpSchema, type SignUpFormData } from "../lib/validations/auth";

interface GetStartedDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GetStartedDialog({ open, onOpenChange }: GetStartedDialogProps = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange"
  });

  // Watch password field for confirmation validation
  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await registerUser(data.email, data.password);
      setIsOpen(false);
    } catch (error) {
      console.error("Registration failed:", error);
      setError("email", { 
        type: "manual",
        message: "Registration failed. Please try again." 
      });
    }
  };

  const handleSocialSignUp = (provider: string) => {
    console.log(`Signing up with ${provider}`);
    // Here you would implement the actual social sign-up logic
  };

  return (
    <Dialog 
      open={open !== undefined ? open : isOpen} 
      onOpenChange={onOpenChange || setIsOpen}
    >
      <DialogTrigger asChild>
        <Button variant="hero" data-get-started-trigger>Get Started</Button>
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
          <DialogTitle className="text-2xl text-center font-bold">Create Account</DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            Join us in reducing food waste and creating delicious meals
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 px-6 pb-6">
          {/* Email Sign Up Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className={cn("h-11", errors.name && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={cn("h-11", errors.email && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password")}
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
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    validate: value => value === password || "Passwords do not match"
                  })}
                  className={cn("h-11 pr-10", errors.confirmPassword && "border-red-500 focus-visible:ring-red-500")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium" 
              variant="hero"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-11 w-full"
              onClick={() => handleSocialSignUp('Google')}
              loading={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.35 5.35c1.56 1.56 2.37 3.61 2.37 5.65 0 .27-.03.54-.07.81h-6.89v-2.91h4.43c-.18-.88-.74-1.64-1.54-2.12l1.7-1.43zM12 4c2.04 0 3.92.7 5.41 1.87l-2.01 1.69C14.29 6.69 13.19 6 12 6c-2.21 0-4 1.79-4 4H6c0-3.31 2.69-6 6-6zm-6 8c0-1.09.29-2.12.79-3.01l1.7 1.43C7.74 11.36 7 12.64 7 14h2c0-1.66 1.34-3 3-3v2H7v-1zm11.7 2.35c-.38 1.88-1.49 3.55-3.07 4.63C13.79 19.64 12.91 20 12 20c-2.59 0-4.86-1.37-6.13-3.43l2-1.68C8.88 16.76 10.33 18 12 18c1.79 0 3.29-1.13 3.88-2.71h-3.88v-2h6.7c.04.27.07.54.07.81 0 1.94-.81 3.7-2.37 5.25z"/>
              </svg>
              Continue with Google
            </Button>

            <Button 
              variant="outline" 
              className="h-11 w-full"
              onClick={() => handleSocialSignUp('Facebook')}
              loading={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              Continue with Facebook
            </Button>

            <Button 
              variant="outline" 
              className="h-11 w-full"
              onClick={() => handleSocialSignUp('Apple')}
              loading={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 384 512">
                <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              Continue with Apple
            </Button>

            <Button 
              variant="outline" 
              className="h-11 w-full"
              onClick={() => handleSocialSignUp('GitHub')}
              loading={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
              </svg>
              Continue with GitHub
            </Button>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-4 px-6">
          By continuing, you agree to our{" "}
          <Button variant="link" className="p-0 h-auto text-xs">Terms of Service</Button>
          {" "}and{" "}
          <Button variant="link" className="p-0 h-auto text-xs">Privacy Policy</Button>
        </div>

        <div className="p-6 bg-muted/50 border-t mt-4">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" className="p-0">Sign In</Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}