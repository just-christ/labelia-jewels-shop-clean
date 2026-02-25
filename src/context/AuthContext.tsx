import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Vérifier si le token est bien formé (3 parties)
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Token mal formé');
        }

        // Vérifier si le token n'est pas expiré
        const payload = JSON.parse(atob(parts[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp && payload.exp < now) {
          throw new Error('Token expiré');
        }

        // Valider les données utilisateur
        if (!payload.userId || !payload.email || !payload.role) {
          throw new Error('Token invalide: données manquantes');
        }

        const userData = {
          id: payload.userId,
          email: payload.email,
          role: payload.role
        };
        
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAdmin(false);
        
        // Rediriger vers login si on n'y est pas déjà
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      const { token, user } = response;
      
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAdmin(user.role === 'admin');
      
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
