import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  preferences?: {
    cuisines: string[];
    dietaryRestrictions: string[];
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to your backend
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated authentication success
      setIsAuthenticated(true);
      setCurrentUser({
        email,
        name: email.split('@')[0], // Simple name from email
        preferences: {
          cuisines: [],
          dietaryRestrictions: []
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to your backend
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated registration success
      setIsAuthenticated(true);
      setCurrentUser({
        email,
        name: email.split('@')[0], // Simple name from email
        preferences: {
          cuisines: [],
          dietaryRestrictions: []
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};