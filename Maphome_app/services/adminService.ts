import { api } from '@/services/api';

export const adminService = {
  async dashboardStats() {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },
  async properties() {
    const response = await api.get('/api/admin/properties');
    return response.data;
  },
  async verificationRequests() {
    const response = await api.get('/api/admin/verification-requests');
    return response.data;
  },
};
