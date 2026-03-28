import { useState, useEffect } from 'react';
import api from '@/app/utils/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';


export function useFavorites() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites(new Set());
        return;
      }
      try {
        const res = await api.get("/api/user/me/favorites");
        if (res.status === 200) {
          const data = res.data;
          // Backend trả về mảng các property details hoặc mảng IDs (tuỳ setup)
          // Ở userController, populate("favorites") trả về mảng document. Phải parse lấy _id
          const ids = data.map((item: any) => item._id || item);
          setFavorites(new Set(ids));
        }
      } catch (err) {
        console.error('Failed to fetch user favorites:', err);
      }
    };
    fetchFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = async (propertyId: string) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu tin đăng');
      return;
    }

    // Optimistic update
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(propertyId)) next.delete(propertyId);
      else next.add(propertyId);
      return next;
    });

    try {
      setLoading(true);
      const res = await api.post("/api/user/me/favorites/toggle", { propertyId });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed to toggle favorite on server');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra, không thể thay đổi danh sách yêu thích');
      // Revert optimistic update
      setFavorites(prev => {
        const next = new Set(prev);
        if (next.has(propertyId)) next.delete(propertyId);
        else next.add(propertyId);
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (propertyId: string) => favorites.has(propertyId);

  const clearFavorites = () => setFavorites(new Set());

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.size,
    loading
  };
}
