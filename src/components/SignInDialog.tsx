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
import { GetStartedDialog } from "./GetStartedDialog";
import { useAuth } from "../contexts/auth-context";

export function SignInDialog() {
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
      console.error("Login failed:", error);
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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">Welcome Back</DialogTitle>
          <DialogDescription className="text-center text-base text-muted-foreground">
            Sign in to continue to ZeroWasteChef
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 px-2">
          {/* Email Sign In Form */}
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
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
              <div className="flex justify-end">
                <Button variant="link" className="text-sm px-0">
                  Forgot password?
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
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
            className="flex items-center justify-center gap-2 h-11 text-base bg-[#4285F4] text-white hover:bg-[#3367D6]"
            onClick={() => handleSocialSignIn('Google')}
          >
            <div className="bg-white p-1 rounded">
              <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
            Continue with Google
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 h-11 text-base hover:bg-accent/5 border-2"
            onClick={() => handleSocialSignIn('Apple')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-.98.423-2.03 1.137-2.89.71-.85 1.83-1.54 2.86-1.54.11 0 .21.02.27.04.03.08.07.17.07.27zm3.413 22.107V11.21c0-5.83-3.953-8.117-7.447-8.117-1.912 0-3.37.668-4.085 1.297-.75-.573-1.715-.925-2.885-.925-2.817 0-5.183 1.962-5.183 4.618 0 1.163.39 2.076 1.044 2.773.71.752 1.71 1.194 2.852 1.194.03 0 .06 0 .09-.002.15 1.297.57 2.588 1.487 3.527.91.94 2.19 1.514 3.59 1.514.21 0 .41-.012.61-.035v4.733c0 .32.26.58.582.58h3.32c.32 0 .583-.26.583-.582v-5.39c0-.32-.26-.58-.58-.582h-3.32c-.32 0-.583.26-.583.582v1.18c-.14.027-.28.046-.424.057-.01-.077-.014-.155-.014-.235 0-1.56.73-2.93 1.84-3.83 1.1-.89 2.58-1.42 4.22-1.42 3.18 0 5.45 1.98 5.45 4.98v7.92c0 .32.26.58.582.58h3.32c.32 0 .583-.26.583-.582z" />
            </svg>
            Continue with Apple
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <GetStartedDialog />
        </p>
      </DialogContent>
    </Dialog>
  );
}