/**
 * useRecentlyViewed
 * Tracks the last N properties the user has viewed, persisted in localStorage.
 * No backend required — browser-side only.
 */

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "mh_recently_viewed";
const MAX_ITEMS = 20; // max properties to keep in history

export interface RecentlyViewedItem {
  id: string;         // property._id or property.id
  name: string;
  address: string;
  price: number;
  area: number;
  image: string;      // thumbnail
  available: boolean;
  viewedAt: string;   // ISO date string
}

// ─── Read from localStorage ───────────────────────────────────────────────────

function readStorage(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentlyViewedItem[];
  } catch {
    return [];
  }
}

// ─── Write to localStorage ────────────────────────────────────────────────────

function writeStorage(items: RecentlyViewedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota errors
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRecentlyViewed() {
  const [history, setHistory] = useState<RecentlyViewedItem[]>(readStorage);

  // Sync state when localStorage changes (e.g. from another tab)
  useEffect(() => {
    const handleStorage = () => setHistory(readStorage());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  /**
   * Call this when the user opens a property detail page.
   */
  const trackView = useCallback((property: RecentlyViewedItem) => {
    setHistory((prev) => {
      // Remove duplicate if already exists, then prepend
      const filtered = prev.filter((p) => p.id !== property.id);
      const updated = [
        { ...property, viewedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_ITEMS);

      writeStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Remove a single item from history.
   */
  const removeItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      writeStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Clear entire history.
   */
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, trackView, removeItem, clearHistory };
}
