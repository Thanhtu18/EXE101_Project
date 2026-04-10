import { useCallback, useEffect, useState } from 'react';

import { api } from '@/services/api';
import { storage } from '@/services/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const hydrate = async () => {
      const local = await storage.getFavorites();
      setFavorites(local);
    };
    void hydrate();
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback(async (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
    setFavorites(next);
    await storage.setFavorites(next);

    // Sync with backend counters when user is authenticated.
    try {
      await api.post(`/api/properties/${id}/favorite`, {
        action: favorites.includes(id) ? 'remove' : 'add',
      });
    } catch {
      // Keep local experience responsive even if network fails.
    }
  }, [favorites]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
