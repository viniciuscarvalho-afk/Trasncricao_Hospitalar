import { useState, useEffect } from 'react';
import { Usuario } from '../types';
import { AuthService } from '../services/auth/authService';

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const usuario = await AuthService.login(email, senha);
      if (usuario) {
        setUser(usuario);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no hook de login:', error);
      return false;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}

