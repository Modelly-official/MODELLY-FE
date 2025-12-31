import {
  PUBLIC_ROUTES,
  MODEL_ONLY_ROUTES,
  DESIGNER_ONLY_ROUTES,
  AUTHENTICATED_ROUTES,
} from '@/src/constants/routes';

/**
 * 공개 라우트 확인
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

/**
 * 역할 기반 접근 권한 확인
 */
export function checkRoleAccess(pathname: string, role: string): boolean {
  // role을 소문자로 정규화 (대소문자 혼용 방지)
  const normalizedRole = role?.toLowerCase();

  if (MODEL_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    return normalizedRole === 'model';
  }
  if (DESIGNER_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    return normalizedRole === 'designer';
  }
  // 인증된 사용자만 접근 가능한 라우트 (모델/디자이너 모두 접근 가능)
  if (AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route))) {
    return normalizedRole === 'model' || normalizedRole === 'designer';
  }
  // 미등록 라우트는 기본 차단 (보안 강화)
  return false;
}
