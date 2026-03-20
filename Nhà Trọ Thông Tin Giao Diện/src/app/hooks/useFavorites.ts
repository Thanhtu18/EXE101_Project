import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'maphome_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [favorites]);

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (propertyId: string) => favorites.has(propertyId);

  const clearFavorites = () => setFavorites(new Set());

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.size,
  };
}
