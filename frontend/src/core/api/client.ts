import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  // No withCredentials — backend uses header-only JWT, no cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach Bearer token to every request ──────────────
apiClient.interceptors.request.use((config) => {
  const url = config.url ?? '';
  // Skip auth header for public auth endpoints
  if (url.includes('/auth/login') || url.includes('/auth/register')) {
    return config;
  }
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Response interceptor: on 401 attempt one silent token refresh ──────────
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token as string);
  });
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isAuthUrl =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh');

    if (is401 && !originalRequest._retry && !isAuthUrl) {
      if (isRefreshing) {
        // Queue the request until the ongoing refresh completes
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      try {
        const res = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );
        const newAccessToken: string = res.data.data.access_token;
        // Also capture the new refresh_token returned by token rotation.
        // The old refresh token is now revoked server-side; using the new one
        // on the next expiry ensures the rotation chain stays intact.
        const newRefreshToken: string = res.data.data.refresh_token ?? refreshToken ?? '';

        // Persist both new tokens in the store
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
