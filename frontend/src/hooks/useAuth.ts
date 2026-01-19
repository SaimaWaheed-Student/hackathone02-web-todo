'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken as saveToken, removeToken, isAuthenticated } from '@/lib/auth';
import { api } from '@/lib/api';
import type { TokenResponse } from '@/lib/types';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  loading: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    loading: true,
  });

  // Parse JWT to get user ID
  const parseToken = useCallback((token: string | null): string | null => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    const token = getToken();
    const userId = parseToken(token);
    setState({
      isAuthenticated: isAuthenticated(),
      userId,
      loading: false,
    });
  }, [parseToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post<TokenResponse>(
        '/auth/signin',
        { email, password },
        { skipAuth: true }
      );

      saveToken(response.access_token);
      const userId = parseToken(response.access_token);

      setState({
        isAuthenticated: true,
        userId,
        loading: false,
      });

      router.push('/dashboard');
    },
    [router, parseToken]
  );

  const logout = useCallback(() => {
    removeToken();
    setState({
      isAuthenticated: false,
      userId: null,
      loading: false,
    });
    router.push('/signin');
  }, [router]);

  return {
    ...state,
    login,
    logout,
  };
}
