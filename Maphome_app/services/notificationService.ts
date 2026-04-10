import { api } from '@/services/api';
import { AppNotification } from '@/types/models';

export const notificationService = {
  async list() {
    const response = await api.get<AppNotification[]>('/api/notifications');
    return response.data;
  },
  async unreadCount() {
    const response = await api.get<{ count: number }>('/api/notifications/unread-count');
    return response.data.count;
  },
  async markRead(id: string) {
    await api.put(`/api/notifications/${id}/read`);
  },
  async markAllRead() {
    await api.put('/api/notifications/read-all');
  },
};
