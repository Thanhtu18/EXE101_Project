import { api } from '@/services/api';
import { Booking } from '@/types/models';

export const bookingService = {
  async myBookings() {
    const response = await api.get<Booking[]>('/api/users/bookings');
    return response.data;
  },
  async allBookings() {
    const response = await api.get<Booking[]>('/api/bookings');
    return response.data;
  },
  async cancelBooking(id: string) {
    await api.put(`/api/bookings/${id}/cancel`);
  },
  async updateStatus(id: string, status: 'accepted' | 'rejected' | 'completed') {
    await api.put(`/api/bookings/${id}/status`, { status });
  },
};
