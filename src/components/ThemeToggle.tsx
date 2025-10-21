import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../hooks/use-theme.ts"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title="Toggle theme"
      className="relative w-9 h-9 rounded-lg"
    >
      <Sun 
        className="absolute h-[1.2rem] w-[1.2rem] transition-all dark:opacity-0" 
        aria-hidden="true"
      />
      <Moon 
        className="absolute h-[1.2rem] w-[1.2rem] transition-all opacity-0 dark:opacity-100"
        aria-hidden="true"
      />
      <span className="sr-only">
        {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      </span>
    </Button>
  );
}