import { apiClient } from '@/lib/axios';
import { User, SavedPassenger } from '../auth/auth.types';

export const profileApi = {
  updateProfile: async (data: { firstName: string; lastName: string; phone?: string }): Promise<User> => {
    const res = await apiClient.put('/users/profile', data);
    return res.data?.data?.user;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<string> => {
    const res = await apiClient.post('/users/change-password', data);
    return res.data?.message;
  },

  getSavedPassengers: async (): Promise<SavedPassenger[]> => {
    const res = await apiClient.get('/users/passengers');
    return res.data?.data?.passengers || [];
  },

  createSavedPassenger: async (data: Partial<SavedPassenger>): Promise<SavedPassenger> => {
    const res = await apiClient.post('/users/passengers', data);
    return res.data?.data?.passenger;
  },

  updateSavedPassenger: async (id: string, data: Partial<SavedPassenger>): Promise<SavedPassenger> => {
    const res = await apiClient.put(`/users/passengers/${id}`, data);
    return res.data?.data?.passenger;
  },

  deleteSavedPassenger: async (id: string): Promise<string> => {
    const res = await apiClient.delete(`/users/passengers/${id}`);
    return res.data?.message;
  },
};
