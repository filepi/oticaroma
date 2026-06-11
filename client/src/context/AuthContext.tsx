import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AdminNivel } from '../types';

const TOKEN_KEY = 'oticaroma_admin_token';
const NIVEL_KEY = 'oticaroma_admin_nivel';
const USUARIO_KEY = 'oticaroma_admin_usuario';

interface AuthContextValue {
  token: string | null;
  nivel: AdminNivel | null;
  usuario: string | null;
  login: (token: string, nivel: AdminNivel, usuario: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [nivel, setNivel] = useState<AdminNivel | null>(() => {
    const stored = sessionStorage.getItem(NIVEL_KEY);
    return stored === 'admin' || stored === 'operacional' ? stored : null;
  });
  const [usuario, setUsuario] = useState<string | null>(() => sessionStorage.getItem(USUARIO_KEY));

  const login = useCallback((newToken: string, newNivel: AdminNivel, newUsuario: string) => {
    sessionStorage.setItem(TOKEN_KEY, newToken);
    sessionStorage.setItem(NIVEL_KEY, newNivel);
    sessionStorage.setItem(USUARIO_KEY, newUsuario);
    setToken(newToken);
    setNivel(newNivel);
    setUsuario(newUsuario);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(NIVEL_KEY);
    sessionStorage.removeItem(USUARIO_KEY);
    setToken(null);
    setNivel(null);
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        nivel,
        usuario,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: nivel === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
