import { createContext, useContext, useState, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('adaptiq_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('adaptiq_user', JSON.stringify(data.user));
    localStorage.setItem('adaptiq_access_token', data.accessToken);
    localStorage.setItem('adaptiq_refresh_token', data.refreshToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem('adaptiq_user', JSON.stringify(data.user));
    localStorage.setItem('adaptiq_access_token', data.accessToken);
    localStorage.setItem('adaptiq_refresh_token', data.refreshToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch {}
    localStorage.removeItem('adaptiq_user');
    localStorage.removeItem('adaptiq_access_token');
    localStorage.removeItem('adaptiq_refresh_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
