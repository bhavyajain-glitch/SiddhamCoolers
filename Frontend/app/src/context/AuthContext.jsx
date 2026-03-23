import { createContext, useContext, useState, useEffect } from 'react';
import { AuthApi } from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider — manages auth state (user, token) and persists to localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('siddham_token');
    const savedUser = localStorage.getItem('siddham_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Login with email and password.
   * @returns {{ user, token }}
   */
  const login = async (email, password) => {
    const res = await AuthApi.login(email, password);
    const { user: userData, token: authToken } = res.data;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('siddham_token', authToken);
    localStorage.setItem('siddham_user', JSON.stringify(userData));
    return { user: userData, token: authToken };
  };

  /**
   * Register a new customer account.
   */
  const register = async (data) => {
    const res = await AuthApi.register(data);
    const { user: userData, token: authToken } = res.data;
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('siddham_token', authToken);
    localStorage.setItem('siddham_user', JSON.stringify(userData));
    return { user: userData, token: authToken };
  };

  /**
   * Clear auth state.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('siddham_token');
    localStorage.removeItem('siddham_user');
  };

  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'retailer';
  const isCustomer = user?.role === 'customer';
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isVendor, isCustomer, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;
