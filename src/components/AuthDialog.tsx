import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "../lib/utils";

type AuthMode = "signin" | "signup";

export function AuthDialog() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Sign In" : "Create Account"}</DialogTitle>
          <DialogDescription>
            {mode === "signin" 
              ? "Welcome back! Sign in to your account." 
              : "Join us to start your zero-waste cooking journey."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisinePreferences">Cuisine Preferences</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vegetarian" />
                      <Label htmlFor="vegetarian">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vegan" />
                      <Label htmlFor="vegan">Vegan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="glutenFree" />
                      <Label htmlFor="glutenFree">Gluten-free</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="dairyFree" />
                      <Label htmlFor="dairyFree">Dairy-free</Label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {mode === "signin" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
                <Button variant="link" className="px-0">Forgot password?</Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button type="submit" className="w-full">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button">
                Google
              </Button>
              <Button variant="outline" type="button">
                Facebook
              </Button>
            </div>

            <div className="text-center text-sm">
              {mode === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <Button variant="link" className="p-0" onClick={toggleMode}>
                    Sign Up
                  </Button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <Button variant="link" className="p-0" onClick={toggleMode}>
                    Sign In
                  </Button>
                </p>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}