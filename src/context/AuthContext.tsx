import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'signaledge_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const userData = await api.getCurrentUser(savedToken);
          if (isMounted && userData) {
            setUser(userData);
            setToken(savedToken);
          }
        } catch {
          if (isMounted) {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
            setUser(null);
          }
        }
      } else {
        // Default initialized demo user
        setUser({
          user_id: 'usr-default-01',
          email: 'harishkumar@signaledge.in',
          display_name: 'Harishkumar M',
          role: 'RETAIL_INVESTOR',
          investment_horizon: '7-15YR',
          risk_tolerance: 'MODERATE_AGGRESSIVE',
          portfolio_size_range: '50L-2CR',
          sectors_of_interest: ['Automotive', 'Defense & Aerospace', 'Renewable Energy'],
          primary_goal: 'DISCOVERY',
          onboarding_completed: true,
          created_at: '2026-01-15T09:00:00+05:30',
        });
      }
      if (isMounted) setIsLoading(false);
    };

    initializeAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user as User);
    setToken(res.token);
    localStorage.setItem(TOKEN_KEY, res.token);
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const res = await api.signup(email, password, fullName);
    setUser(res.user as User);
    setToken(res.token);
    localStorage.setItem(TOKEN_KEY, res.token);
  };

  const logout = async () => {
    if (token) {
      try {
        await api.logout(token);
      } catch {
        // ignore network error
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await api.updateProfile(updates, token || undefined);
    setUser((prev) => (prev ? { ...prev, ...updated } : updated));
  };

  const deleteAccount = async () => {
    if (token) {
      await api.deleteAccount(token);
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
