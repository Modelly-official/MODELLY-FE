import {
  PUBLIC_ROUTES,
  MODEL_ONLY_ROUTES,
  DESIGNER_ONLY_ROUTES,
  AUTHENTICATED_ROUTES,
} from '@/src/constants/routes';

/**
 * 경로 매칭 함수 (정확한 prefix 매칭)
 * /reservation은 /reservation, /reservation/123 등과 매칭
 * /reservation은 /reservations와 매칭되지 않음
 */
function matchRoute(pathname: string, route: string): boolean {
  if (pathname === route) return true;
  // route + '/'로 시작하는지 확인 (하위 경로 매칭)
  return pathname.startsWith(route + '/');
}

// 정확 매칭만 허용하는 라우트 (하위 경로는 인증 필요)
const EXACT_MATCH_ROUTES = ['/mypage', '/chat'];

/**
 * 공개 라우트 확인
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === '/') return pathname === '/';
    // 정확 매칭만 허용하는 라우트
    if (EXACT_MATCH_ROUTES.includes(route)) return pathname === route;
    return matchRoute(pathname, route);
  });
}

/**
 * 역할 기반 접근 권한 확인
 */
export function checkRoleAccess(pathname: string, role: string): boolean {
  // role을 소문자로 정규화 (대소문자 혼용 방지)
  const normalizedRole = role?.toLowerCase();

  if (MODEL_ONLY_ROUTES.some((route) => matchRoute(pathname, route))) {
    return normalizedRole === 'model';
  }
  if (DESIGNER_ONLY_ROUTES.some((route) => matchRoute(pathname, route))) {
    return normalizedRole === 'designer';
  }
  // 인증된 사용자만 접근 가능한 라우트 (모델/디자이너 모두 접근 가능)
  if (AUTHENTICATED_ROUTES.some((route) => matchRoute(pathname, route))) {
    return normalizedRole === 'model' || normalizedRole === 'designer';
  }
  // 미등록 라우트는 기본 차단 (보안 강화)
  return false;
}
