import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authEvents, UNAUTHORIZED_EVENT } from './authEvents';
import { clearToken, getToken, isTokenExpired, setToken } from './token';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readValidToken(): string | null {
  const token = getToken();
  if (!token) return null;
  if (isTokenExpired(token)) {
    clearToken();
    return null;
  }
  return token;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => readValidToken() !== null,
  );
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearToken();
    setIsAuthenticated(false);
  }, []);

  const login = useCallback((token: string) => {
    setToken(token);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      clearToken();
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    }

    authEvents.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      authEvents.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
