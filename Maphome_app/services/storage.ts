import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  token: 'maphome:token',
  user: 'maphome:user',
  favorites: 'maphome:favorites',
};

const memoryStorage = new Map<string, string>();

const hasWebStorage = () => typeof globalThis !== 'undefined' && !!globalThis.localStorage;

const safeSetItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    if (hasWebStorage()) {
      globalThis.localStorage.setItem(key, value);
      return;
    }
    memoryStorage.set(key, value);
  }
};

const safeGetItem = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    if (hasWebStorage()) {
      return globalThis.localStorage.getItem(key);
    }
    return memoryStorage.get(key) ?? null;
  }
};

const safeRemoveItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    if (hasWebStorage()) {
      globalThis.localStorage.removeItem(key);
      return;
    }
    memoryStorage.delete(key);
  }
};

export const storage = {
  async setToken(token: string) {
    await safeSetItem(KEYS.token, token);
  },
  async getToken() {
    return safeGetItem(KEYS.token);
  },
  async removeToken() {
    await safeRemoveItem(KEYS.token);
  },
  async setUser<T>(user: T) {
    await safeSetItem(KEYS.user, JSON.stringify(user));
  },
  async getUser<T>() {
    const raw = await safeGetItem(KEYS.user);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  async removeUser() {
    await safeRemoveItem(KEYS.user);
  },
  async setFavorites(ids: string[]) {
    await safeSetItem(KEYS.favorites, JSON.stringify(ids));
  },
  async getFavorites() {
    const raw = await safeGetItem(KEYS.favorites);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
  async clearAuth() {
    await Promise.all([safeRemoveItem(KEYS.token), safeRemoveItem(KEYS.user)]);
  },
};
