'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { apiClient } from '@/shared/lib/axios';

interface AuthPayload {
  user: { id: string; email: string; name: string | null };
  accessToken: string;
}

export function useAuth() {
  const { token, setToken, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.get<AuthPayload['user']>('/auth/me').then((r) => r.data),
    enabled: !!token,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: (dto: { email: string; password: string }) =>
      apiClient.post<AuthPayload>('/auth/login', dto).then((r) => r.data),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (dto: { email: string; password: string; name?: string }) =>
      apiClient.post<AuthPayload>('/auth/register', dto).then((r) => r.data),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });

  return {
    user: meQuery.data ?? null,
    isAuthenticated: !!token,
    isLoading: meQuery.isLoading,
    login: loginMutation,
    register: registerMutation,
    logout: () => {
      logout();
      queryClient.clear();
    },
  };
}
