import { useAuthStore, getAccessToken, setAccessToken, getUserRole } from '@/src/stores';
import { apiLogger } from '@/src/utils';
import { dispatchAuthError } from '@/src/utils/auth/authErrorDispatcher';
import { isPublicRoute as checkPublicRoute } from '@/src/utils/middleware/routeGuard';
import axios, { AxiosRequestConfig } from 'axios';

// 공개 라우트 체크 (SSR-safe, middleware와 동일 로직 사용)
function isPublicRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return checkPublicRoute(window.location.pathname);
}

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

// SSR-safe redirectUrl 헬퍼 (쿼리 파라미터 포함)
function getRedirectUrl(): string {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search}`;
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

// /auth/ 엔드포인트 중 인증이 필요한 것만 명시 (나머지는 토큰 주입 제외)
const AUTH_REQUIRED_ENDPOINTS = ['/auth/logout', '/auth/validate', '/auth/social/signup'];

// Request Interceptor: 쿠키에서 accessToken 읽어서 헤더에 추가 + 로깅
axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const pathname = url.split('?')[0]; // 쿼리스트링 제거
    const isAuthEndpoint = pathname.startsWith('/auth/');
    const requiresToken = AUTH_REQUIRED_ENDPOINTS.includes(pathname);

    // /auth/ 엔드포인트가 아니거나, 인증이 필요한 /auth/ 엔드포인트인 경우만 토큰 추가
    if (!isAuthEndpoint || requiresToken) {
      const token = getAccessToken();
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
  async (error) => {
    const { clearAuth } = useAuthStore.getState();
    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    const res = error.response;
    const code = res?.data?.serviceCode || res?.data?.data?.codeName || '';

    // API 로깅 (에러)
    apiLogger.error(res?.config?.url || '', res?.status || 0, res?.data || error.message);

    // 토큰 갱신이 필요한지 확인
    // - 401: 토큰 만료
    // - 403 + Authorization 헤더 없음: accessToken이 삭제된 경우
    // - 400 + ACCESS_TOKEN_EXPIRED: 만료된 토큰으로 요청한 경우
    const needsTokenRefresh =
      res?.status === 401 ||
      (res?.status === 403 && !originalRequest.headers?.Authorization) ||
      (res?.status === 400 && code === 'ACCESS_TOKEN_EXPIRED');

    // 토큰 갱신이 필요하고 아직 재시도 안 했으면 갱신 시도
    if (needsTokenRefresh && !originalRequest._retry) {
      originalRequest._retry = true;

      const onPublicRoute = isPublicRoute();
      const hasUserRole = !!getUserRole();

      // 공개 라우트에서 비로그인 유저는 refresh 시도 안 함 (UI 모달이 처리)
      if (onPublicRoute && !hasUserRole) {
        return Promise.reject(error);
      }

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

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest); // 재요청
        }

        // isSuccess=false 또는 accessToken 없음 → 실패 처리
        throw new Error('Token refresh returned no access token');
      } catch (refreshError) {
        // 갱신 실패 - 대기 중인 요청들에게 에러 전달
        onRefreshFailed(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'));
        clearAuth();

        // 공개 라우트: soft (인증 클리어만) / 보호 라우트: hard (리다이렉트)
        if (!onPublicRoute) {
          dispatchAuthError({ type: 'TOKEN_EXPIRED', redirectUrl: getRedirectUrl() });
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // 400 특정 코드 처리 (복구 불가능한 토큰 에러)
    // ACCESS_TOKEN_EXPIRED는 위에서 refresh 시도하므로 여기서 제외
    if (res?.status === 400 && (code === 'INVALID_REFRESH_TOKEN' || code === 'INVALID_TOKEN')) {
      clearAuth();
      // 공개 라우트: soft (인증 클리어만) / 보호 라우트: hard (리다이렉트)
      if (!isPublicRoute()) {
        dispatchAuthError({ type: 'TOKEN_EXPIRED', redirectUrl: getRedirectUrl() });
      }
    }

    return Promise.reject(error);
  },
);
