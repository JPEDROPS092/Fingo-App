"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from './api';

interface User {
  id: number;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Default context value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Safe localStorage access
  const getFromStorage = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error accessing localStorage for key ${key}:`, error);
      return null;
    }
  };

  // Safe localStorage write
  const setToStorage = (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        // Delay to ensure component is mounted
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get user from localStorage
        const userJson = getFromStorage('financeAppUser');
        const token = getFromStorage('financeAppToken');
        
        if (userJson && token) {
          try {
            const userData = JSON.parse(userJson);
            setUser({
              id: userData.id,
              username: userData.username,
              email: userData.email
            });
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await authService.login(username, password);
      if (data && data.token) {
        setUser({
          id: data.user_id,
          username: data.username,
          email: data.email
        });
        console.log('Login successful');
        return data;
      } else {
        throw new Error('Login failed: Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      console.log('Logging out user...');
      // Use our safe wrapper instead of directly calling authService
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeAppToken');
        localStorage.removeItem('financeAppUser');
        
        // Clear auth headers
        if (window.location) {
          window.location.href = '/login';
        } else {
          router.replace('/login');
        }
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      router.replace('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
