import { useAuthStore } from '@/src/stores/useAuthStore';
import axios from 'axios';

// 인증 없이 접근 가능한 API
const NON_AUTH_URLS = [
  '/auth/login',
  '/auth/signup',
  '/auth/refresh',
  '/auth/sms',
  '/auth/check',
];

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: accessToken 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const isNonAuthRequest = NON_AUTH_URLS.some((path) =>
      config.url?.includes(path),
    );

    if (!isNonAuthRequest) {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: 새 accessToken 자동 저장
axiosInstance.interceptors.response.use(
  (response) => {
    const authHeader = response.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      useAuthStore.getState().setAccessToken(newToken);
    }
    return response;
  },
  (error) => {
    const { clearAuth } = useAuthStore.getState();
    const res = error.response;
    const code = res?.data?.serviceCode || res?.data?.data?.codeName || '';

    const shouldLogout =
      res?.status === 400 &&
      (code === 'INVALID_REFRESH_TOKEN' ||
        code === 'INVALID_TOKEN' ||
        code === 'ACCESS_TOKEN_EXPIRED');

    if (shouldLogout) {
      clearAuth();
    }

    return Promise.reject(error);
  },
);
