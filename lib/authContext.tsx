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
  refreshToken: () => Promise<boolean>;
}

// Default context value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: () => {},
  isAuthenticated: false,
  refreshToken: async () => false,
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
      console.error(`Erro ao acessar localStorage para chave ${key}:`, error);
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
      console.error(`Erro ao escrever no localStorage para chave ${key}:`, error);
      return false;
    }
  };
  
  // Token refresh function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const token = getFromStorage('financeAppToken');
      if (!token) {
        return false;
      }
      
      // Validar token e obter dados atualizados do usuário
      const response = await authService.validateToken();
      
      if (response && response.data) {
        // Atualizar informações do usuário no storage
        setToStorage('financeAppUser', JSON.stringify({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email
        }));
        
        // Atualizar estado do usuário
        setUser({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      logout();
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
            // Parse user data
            const userData = JSON.parse(userJson);
            setUser({
              id: userData.id,
              username: userData.username,
              email: userData.email
            });
            
            // Validar token com o backend
            refreshToken().catch(err => {
              console.error('Erro na validação inicial do token:', err);
            });
          } catch (parseError) {
            console.error('Erro ao analisar dados do usuário:', parseError);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Configurar intervalo para renovar o token periodicamente (a cada 15 minutos)
    const tokenRefreshInterval = setInterval(() => {
      if (getFromStorage('financeAppToken')) {
        refreshToken().catch(err => {
          console.error('Erro ao atualizar token:', err);
        });
      }
    }, 15 * 60 * 1000);
    
    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(tokenRefreshInterval);
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
        console.log('Login bem-sucedido');
        return data;
      } else {
        throw new Error('Login falhou: Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      console.log('Desconectando usuário...');
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
      console.error('Erro ao desconectar:', error);
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
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
