import { useAuthStore, getAccessToken, setAccessToken } from '@/src/stores';
import { apiLogger } from '@/src/utils';
import { dispatchAuthError } from '@/src/utils/auth/authErrorDispatcher';
import axios, { AxiosRequestConfig } from 'axios';

// 토큰 갱신 상태 관리 (Race Condition 방지)
let isRefreshing = false;
let refreshSubscribers: {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}[] = [];

function subscribeTokenRefresh(resolve: (token: string) => void, reject: (error: Error) => void) {
  refreshSubscribers.push({ resolve, reject });
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
}

function onRefreshFailed(error: Error) {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
}

// _retry 플래그를 위한 타입 확장
interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

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
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
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
  async (error) => {
    const { clearAuth } = useAuthStore.getState();
    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    const res = error.response;
    const code = res?.data?.serviceCode || res?.data?.data?.codeName || '';

    // API 로깅 (에러)
    apiLogger.error(res?.config?.url || '', res?.status || 0, res?.data || error.message);

    // 401이고 아직 재시도 안 했으면 토큰 갱신 시도
    if (res?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 이미 갱신 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(
            (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            (err: Error) => {
              reject(err);
            },
          );
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        if (refreshResponse.data?.isSuccess && refreshResponse.data?.result?.accessToken) {
          const newToken = refreshResponse.data.result.accessToken;
          setAccessToken(newToken);

          // 대기 중인 요청들에게 새 토큰 전달
          onTokenRefreshed(newToken);
          isRefreshing = false;

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest); // 재요청
        }
      } catch (refreshError) {
        // 갱신 실패 - 대기 중인 요청들에게 에러 전달
        onRefreshFailed(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'));
      }

      isRefreshing = false;
      clearAuth();
      dispatchAuthError({ type: 'TOKEN_EXPIRED', redirectUrl: window.location.pathname });
      return Promise.reject(error);
    }

    // 400 특정 코드 처리 (토큰 관련 에러)
    if (
      res?.status === 400 &&
      (code === 'INVALID_REFRESH_TOKEN' || code === 'INVALID_TOKEN' || code === 'ACCESS_TOKEN_EXPIRED')
    ) {
      clearAuth();
      dispatchAuthError({ type: 'TOKEN_EXPIRED', redirectUrl: window.location.pathname });
    }

    return Promise.reject(error);
  },
);
