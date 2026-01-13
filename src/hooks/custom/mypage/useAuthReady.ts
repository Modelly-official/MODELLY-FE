import { useMemo, useSyncExternalStore } from 'react';
import { getAccessToken, getUserRole, getUserCategory, useAuthStore } from '@/src/stores';
import type { Category } from '@/src/types/recruitment';

type Role = 'model' | 'designer';

/** 인증된 사용자 정보 타입 */
type AuthUser = {
  userId: number;
  role: Role;
  username: string;
  loginId: string;
  category?: Category;
} | null;

interface AuthReadyState {
  user: AuthUser;
  role: Role;
  isLoggedIn: boolean;
  authReady: boolean;
  cookieCategory: Category | null;
}

// 클라이언트 마운트 상태를 추적하는 외부 스토어
let isMounted = false;
const listeners = new Set<() => void>();

const mountStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => isMounted,
  getServerSnapshot: () => false,
  mount: () => {
    if (!isMounted) {
      isMounted = true;
      listeners.forEach((listener) => listener());
    }
  },
};

// 앱 시작 시 마운트 표시
if (typeof window !== 'undefined') {
  mountStore.mount();
}

/**
 * 인증 상태 동기화 훅
 * - 쿠키/스토어 기반으로 인증 상태를 초기화
 * - useSyncExternalStore로 hydration 안전하게 처리
 */
export function useAuthReady(): AuthReadyState {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 클라이언트 마운트 상태 구독
  const isClient = useSyncExternalStore(
    mountStore.subscribe,
    mountStore.getSnapshot,
    mountStore.getServerSnapshot
  );

  // 인증 상태 계산 (isClient가 변경되면 재계산)
  const authState = useMemo(() => {
    if (!isClient) {
      return {
        role: 'model' as Role,
        isLoggedIn: false,
        cookieCategory: null as Category | null,
        authReady: false,
      };
    }

    const cookieRole = getUserRole();
    const token = getAccessToken();
    const category = getUserCategory();

    const role = (user?.role ?? cookieRole ?? 'model') as Role;
    const isLoggedIn = !!(isAuthenticated || user || token);

    return {
      role,
      isLoggedIn,
      cookieCategory: category,
      authReady: true,
    };
  }, [isClient, user, isAuthenticated]);

  return { user, ...authState };
}
