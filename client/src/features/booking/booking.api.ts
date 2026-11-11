import { apiClient } from '@/lib/axios';
import { BookingResponse } from './booking.types';

export const bookingApi = {
  createBooking: async (data: any): Promise<BookingResponse> => {
    const res = await apiClient.post('/bookings', data);
    return res.data?.data?.booking;
  },

  processPayment: async (data: any): Promise<{ payment: any; booking: BookingResponse }> => {
    const res = await apiClient.post('/payments/process', data);
    return res.data?.data;
  },

  getBookingDetails: async (reference: string): Promise<BookingResponse> => {
    const res = await apiClient.get(`/bookings/${reference}`);
    return res.data?.data?.booking;
  },

  getMyBookings: async (): Promise<BookingResponse[]> => {
    const res = await apiClient.get('/bookings');
    return res.data?.data?.bookings || [];
  },

  cancelBooking: async (reference: string, reason?: string): Promise<BookingResponse> => {
    const res = await apiClient.post(`/bookings/${reference}/cancel`, { reason });
    return res.data?.data?.booking;
  },

  downloadTicketPdf: async (reference: string): Promise<Blob> => {
    const res = await apiClient.get(`/bookings/${reference}/pdf`, {
      responseType: 'blob',
    });
    return res.data;
  },
};
