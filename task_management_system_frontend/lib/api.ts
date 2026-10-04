import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  async (config) => {
    let token: string | null = null;

    // Check if token exists in localStorage (supports mock / saved sessions)
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth_token');
    }

    // If Firebase current user exists, get the fresh Firebase ID token
    if (auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken();
        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('auth_token', token);
        }
      } catch (err) {
        console.warn('Failed to retrieve fresh Firebase token:', err);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to unwrap data
apiClient.interceptors.response.use(
  (response) => {
    // If backend wrapped response in { success: true, data: ... }
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(Array.isArray(message) ? message.join(', ') : message));
  },
);
