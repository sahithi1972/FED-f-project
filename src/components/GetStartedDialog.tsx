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


        </div>

        <div className="text-center text-xs text-muted-foreground mt-6 px-6">
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