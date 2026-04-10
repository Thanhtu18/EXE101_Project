import { api } from '@/services/api';
import { RentalProperty } from '@/types/models';

export const propertyService = {
  async list(params?: { keyword?: string; minPrice?: number; maxPrice?: number }) {
    const response = await api.get<RentalProperty[]>('/api/properties', { params: { name: params?.keyword, minPrice: params?.minPrice, maxPrice: params?.maxPrice } });
    return response.data;
  },
  async search(keyword: string) {
    const response = await api.get<RentalProperty[]>('/api/properties/search', { params: { q: keyword } });
    return response.data;
  },
  async detail(id: string) {
    const response = await api.get<RentalProperty>(`/api/properties/${id}`);
    return response.data;
  },
  async incrementView(id: string) {
    await api.post(`/api/properties/${id}/view`);
  },
};
