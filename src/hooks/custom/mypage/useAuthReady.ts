import { useSyncExternalStore, useCallback } from 'react';
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

// 빈 구독 함수 (쿠키는 외부 변경 이벤트가 없음)
const subscribe = () => () => {};

/**
 * 인증 상태 동기화 훅
 * - 쿠키/스토어 기반으로 인증 상태를 초기화
 * - useSyncExternalStore로 SSR/CSR 안전하게 처리
 */
export function useAuthReady(): AuthReadyState {
  const user = useAuthStore((state) => state.user);

  // 클라이언트 스냅샷: 쿠키에서 값 읽기
  const getSnapshot = useCallback(() => {
    const cookieRole = getUserRole();
    const token = getAccessToken();
    const category = getUserCategory();

    return {
      role: (user?.role ?? cookieRole ?? 'model') as Role,
      isLoggedIn: !!(user ?? token),
      cookieCategory: category,
      authReady: true,
    };
  }, [user]);

  // 서버 스냅샷: 기본값 사용
  const getServerSnapshot = useCallback(
    () => ({
      role: (user?.role ?? 'model') as Role,
      isLoggedIn: !!user,
      cookieCategory: null,
      authReady: false,
    }),
    [user]
  );

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { user, ...state };
}
