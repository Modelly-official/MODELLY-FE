import { useAuthStore, getAccessToken, setAccessToken } from '@/src/stores';
import { apiLogger } from '@/src/utils';
import axios from 'axios';

// 인증 없이 접근 가능한 API
const NON_AUTH_URLS = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/sms', '/auth/check', '/presigned-url/profiles'];

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // refreshToken 쿠키 자동 전송
});

// Request Interceptor: 쿠키에서 accessToken 읽어서 헤더에 추가 + 로깅
axiosInstance.interceptors.request.use(
  (config) => {
    const isNonAuthRequest = NON_AUTH_URLS.some((path) => config.url?.includes(path));

    if (!isNonAuthRequest) {
      const token = getAccessToken(); // 쿠키에서 읽기
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // API 로깅 (NEXT_PUBLIC_API_LOGGING=true 일 때만 활성화)
    apiLogger.request(config.method || 'GET', config.url || '', config.params || config.data);

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: 새 accessToken이 오면 쿠키에 저장 + 로깅
axiosInstance.interceptors.response.use(
  (response) => {
    const authHeader = response.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      setAccessToken(newToken); // 쿠키에 저장
    }

    // API 로깅 (성공)
    apiLogger.response(response.config.url || '', response.status, response.data);

    return response;
  },
  (error) => {
    const { clearAuth } = useAuthStore.getState();
    const res = error.response;
    const code = res?.data?.serviceCode || res?.data?.data?.codeName || '';

    // API 로깅 (에러)
    apiLogger.error(res?.config?.url || '', res?.status || 0, res?.data || error.message);

    const shouldLogout =
      res?.status === 401 ||
      (res?.status === 400 &&
        (code === 'INVALID_REFRESH_TOKEN' || code === 'INVALID_TOKEN' || code === 'ACCESS_TOKEN_EXPIRED'));

    if (shouldLogout) {
      clearAuth(); // 쿠키도 함께 삭제됨
    }

    return Promise.reject(error);
  },
);
