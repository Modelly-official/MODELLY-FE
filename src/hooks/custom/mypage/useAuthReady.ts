import { useSyncExternalStore, useRef } from 'react';
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

interface SnapshotState {
  role: Role;
  isLoggedIn: boolean;
  cookieCategory: Category | null;
  authReady: boolean;
}

// 빈 구독 함수 (쿠키는 외부 변경 이벤트가 없음)
const subscribe = () => () => {};

// 서버 스냅샷 (고정값)
const serverSnapshot: SnapshotState = {
  role: 'model',
  isLoggedIn: false,
  cookieCategory: null,
  authReady: false,
};

/**
 * 인증 상태 동기화 훅
 * - 쿠키/스토어 기반으로 인증 상태를 초기화
 * - useSyncExternalStore로 SSR/CSR 안전하게 처리
 */
export function useAuthReady(): AuthReadyState {
  const user = useAuthStore((state) => state.user);
  const cachedSnapshot = useRef<SnapshotState | null>(null);

  // 클라이언트 스냅샷: 쿠키에서 값 읽기 (캐싱으로 무한 루프 방지)
  const getSnapshot = (): SnapshotState => {
    const cookieRole = getUserRole();
    const token = getAccessToken();
    const category = getUserCategory();

    const role = (user?.role ?? cookieRole ?? 'model') as Role;
    const isLoggedIn = !!(user ?? token);

    // 이전 스냅샷과 비교하여 변경 없으면 캐시된 값 반환
    if (
      cachedSnapshot.current &&
      cachedSnapshot.current.role === role &&
      cachedSnapshot.current.isLoggedIn === isLoggedIn &&
      cachedSnapshot.current.cookieCategory === category
    ) {
      return cachedSnapshot.current;
    }

    // 새 스냅샷 캐싱
    cachedSnapshot.current = {
      role,
      isLoggedIn,
      cookieCategory: category,
      authReady: true,
    };

    return cachedSnapshot.current;
  };

  // 서버 스냅샷: 고정값 반환
  const getServerSnapshot = (): SnapshotState => serverSnapshot;

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { user, ...state };
}
