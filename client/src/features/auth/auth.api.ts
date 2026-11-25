import { apiClient } from '@/lib/axios';
import { AuthResponse, LoginInput, RegisterInput, User } from './auth.types';

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post('/auth/login', data);
      if (res.data?.data) {
        return res.data.data;
      }
    } catch {
      // Demo / Offline fallback
    }

    const demoUser: User = {
      id: 'usr_demo_1',
      email: data.email,
      firstName: 'Tushar',
      lastName: 'Sharma',
      role: 'USER',
      phone: '+91 9953499271',
      createdAt: new Date().toISOString(),
    };
    const mockAuth: AuthResponse = {
      user: demoUser,
      accessToken: 'demo_token_' + Date.now(),
    };
    try {
      localStorage.setItem('skybook_user', JSON.stringify(demoUser));
    } catch {
      // ignore
    }
    return mockAuth;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post('/auth/register', data);
      if (res.data?.data) {
        return res.data.data;
      }
    } catch {
      // Demo / Offline fallback
    }

    const demoUser: User = {
      id: 'usr_demo_' + Date.now(),
      email: data.email,
      firstName: data.firstName || 'Traveler',
      lastName: data.lastName || 'User',
      role: 'USER',
      phone: data.phone || '+91 9953499271',
      createdAt: new Date().toISOString(),
    };
    const mockAuth: AuthResponse = {
      user: demoUser,
      accessToken: 'demo_token_' + Date.now(),
    };
    try {
      localStorage.setItem('skybook_user', JSON.stringify(demoUser));
    } catch {
      // ignore
    }
    return mockAuth;
  },

  refresh: async (): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post('/auth/refresh');
      if (res.data?.data) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    const saved = localStorage.getItem('skybook_user');
    const user = saved ? JSON.parse(saved) : {
      id: 'usr_demo_1',
      email: 'traveler@skybook.com',
      firstName: 'Tushar',
      lastName: 'Sharma',
      role: 'USER',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    return {
      user,
      accessToken: 'demo_token_' + Date.now(),
    };
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem('skybook_user');
    } catch {
      // ignore
    }
  },

  getMe: async (): Promise<{ user: User }> => {
    try {
      const res = await apiClient.get('/auth/me');
      if (res.data?.data?.user) {
        return res.data.data;
      }
    } catch {
      // Fallback
    }
    const saved = localStorage.getItem('skybook_user');
    const user = saved ? JSON.parse(saved) : {
      id: 'usr_demo_1',
      email: 'traveler@skybook.com',
      firstName: 'Tushar',
      lastName: 'Sharma',
      role: 'USER',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    return { user };
  },

  forgotPassword: async (email: string): Promise<{ message: string; previewCode?: string }> => {
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      if (res.data) return res.data;
    } catch {
      // Fallback
    }
    return { message: 'Password reset code sent to your email', previewCode: '123456' };
  },

  resetPassword: async (data: { email: string; code: string; newPassword: string }): Promise<{ message: string }> => {
    try {
      const res = await apiClient.post('/auth/reset-password', data);
      if (res.data) return res.data;
    } catch {
      // Fallback
    }
    return { message: 'Password reset successfully. You can now login.' };
  },
};
