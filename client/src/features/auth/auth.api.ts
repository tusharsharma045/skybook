import { apiClient } from '@/lib/axios';
import { AuthResponse, LoginInput, RegisterInput, User } from './auth.types';

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/register', data);
    return res.data.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/refresh');
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<{ user: User }> => {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string; previewCode?: string }> => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: { email: string; code: string; newPassword: string }): Promise<{ message: string }> => {
    const res = await apiClient.post('/auth/reset-password', data);
    return res.data;
  },
};
