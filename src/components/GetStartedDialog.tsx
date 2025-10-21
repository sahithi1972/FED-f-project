import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Mail } from "lucide-react";
import { useAuth } from "../contexts/auth-context";

export function GetStartedDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setIsOpen(false);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    console.log(`Signing up with ${provider}`);
    // Here you would implement the actual social sign-up logic
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="hero">Get Started</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">Get Started</DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            Create your account to start reducing food waste
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 px-2">
          {/* Email Sign In Form - Always visible */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="flex items-center gap-2 my-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground px-2">OR</span>
            <Separator className="flex-1" />
          </div>

          {/* Social Sign In Buttons */}
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-11 text-base hover:bg-accent/5"
            onClick={() => handleSocialSignUp('Gmail')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
            </svg>
            Continue with Gmail
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-11 text-base bg-[#4285F4] text-white hover:bg-[#3367D6]"
            onClick={() => handleSocialSignUp('Google')}
          >
            <div className="bg-white p-1 rounded">
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
            CONTINUE WITH GOOGLE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}