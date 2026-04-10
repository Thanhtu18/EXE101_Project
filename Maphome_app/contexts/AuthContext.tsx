import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { api, extractApiError } from '@/services/api';
import { storage } from '@/services/storage';
import { AuthResponse, RegisterPayload, User } from '@/types/models';

type LoginResult = { success: boolean; message?: string };

interface AuthContextValue {
  user: User | null;
  isReady: boolean;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<LoginResult>;
  register: (payload: RegisterPayload) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const localUser = await storage.getUser<User>();
      const token = await storage.getToken();

      if (!token || !localUser) {
        setIsReady(true);
        return;
      }

      try {
        const me = await api.get<User>('/api/auth/me');
        setUser(me.data);
        await storage.setUser(me.data);
      } catch {
        await storage.clearAuth();
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };

    void bootstrap();
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<LoginResult> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', { usernameOrEmail, password });
      await storage.setToken(response.data.token);
      await storage.setUser(response.data.user);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: extractApiError(error, 'Dang nhap that bai') };
    }
  };

  const register = async (payload: RegisterPayload): Promise<LoginResult> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', payload);
      await storage.setToken(response.data.token);
      await storage.setUser(response.data.user);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: extractApiError(error, 'Dang ky that bai') };
    }
  };

  const logout = async () => {
    setUser(null);
    await storage.clearAuth();
  };

  const value = useMemo(
    () => ({
      user,
      isReady,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [isReady, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
