import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { storage } from '@/services/storage';

const normalize = (value: string) => value.replace(/\/+$/, '');

const resolveMobileHost = () => {
  const constants = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
    manifest?: { debuggerHost?: string };
  };

  const hostUri =
    constants.expoConfig?.hostUri ||
    constants.manifest2?.extra?.expoClient?.hostUri ||
    constants.manifest?.debuggerHost ||
    '';

  return hostUri.split(':')[0];
};

const resolveBaseUrl = () => {
  const raw = normalize(process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000');

  if (Platform.OS === 'web') {
    return raw;
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return raw;
  }

  const isLoopback = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (!isLoopback) {
    return raw;
  }

  const detectedHost = resolveMobileHost();
  if (detectedHost && detectedHost !== 'localhost' && detectedHost !== '127.0.0.1') {
    url.hostname = detectedHost;
    return normalize(url.toString());
  }

  if (Platform.OS === 'android') {
    url.hostname = '10.0.2.2';
    return normalize(url.toString());
  }

  return raw;
};

const baseURL = resolveBaseUrl();

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      await storage.clearAuth();
    }
    return Promise.reject(error);
  },
);

export const extractApiError = (error: unknown, fallback = 'Co loi xay ra, vui long thu lai') => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.code === 'ERR_NETWORK') {
      return 'Khong ket noi duoc server. Kiem tra EXPO_PUBLIC_API_BASE_URL va backend dang chay.';
    }
    return error.response?.data?.message || fallback;
  }
  return fallback;
};
