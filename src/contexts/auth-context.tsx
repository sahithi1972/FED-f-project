import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  occupation?: string;
  location?: string;
  gender?: string;
  role?: string;
  profileCompleted?: boolean;
  dietaryPreferences?: any[];
  cuisinePreferences?: any[];
  recipesCreated?: number;
  totalLikes?: number;
  impactScore?: number;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  currentUser?: User | null; // alias for compatibility
  isAuthenticated?: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isLoading?: boolean; // alias for compatibility
  requiresProfileSetup: boolean;
  setProfileCompleted: () => void;
  updateUserData: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requiresProfileSetup, setRequiresProfileSetup] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
            setRequiresProfileSetup(!data.data.profileCompleted);
          } else {
            // Clear user state and tokens on auth failure
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
          }
        } else {
          // Clear user state when no token exists
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear user state on error
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user: userData, token, refreshToken, requiresProfileSetup: needsSetup } = data.data;
      
      // Store token
      localStorage.setItem('authToken', token);
      if (rememberMe && refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Update user state
      setUser(userData);
      setRequiresProfileSetup(needsSetup || false);

      // Store tokens
      localStorage.setItem('authToken', token);
      if (rememberMe) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      setUser(userData);
      setRequiresProfileSetup(needsSetup);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user: userData, token, refreshToken } = data.data;

      // Store tokens
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setRequiresProfileSetup(true); // Always require profile setup after registration
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setRequiresProfileSetup(false);
  };

  const setProfileCompleted = () => {
    setRequiresProfileSetup(false);
    if (user) {
      setUser({ ...user, profileCompleted: true });
    }
  };

  const updateUserData = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      currentUser: user,
      isAuthenticated: !!user,
      isLoading: loading,
      login,
      register,
      logout,
      loading,
      requiresProfileSetup,
      setProfileCompleted,
      updateUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
