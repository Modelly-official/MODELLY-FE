import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPublicRoute, checkRoleAccess } from '@/src/utils/middleware/routeGuard';
import { ValidateResponse } from '@/src/types/auth/auth';
import { ApiResponse } from '@/src/types';

/**
 * 백엔드 API로 accessToken 유효성 검증
 * @param accessToken - 검증할 액세스 토큰
 * @returns 토큰 유효 여부 (true: 유효, false: 무효)
 */
async function verifyAccessToken(accessToken: string): Promise<boolean> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not defined');
      return false;
    }

    const response = await fetch(`${apiBaseUrl}/api/auth/validate`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Token validation failed:', response.status);
      return false;
    }

    const data: ApiResponse<ValidateResponse> = await response.json();

    return data.isSuccess && data.result.isValid === 'VALID';
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

/**
 * refreshToken으로 새로운 accessToken 발급
 * @param request - NextRequest 객체 (refreshToken 쿠키 포함)
 * @returns 새로운 accessToken 또는 null
 */
async function refreshAccessToken(request: NextRequest): Promise<string | null> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not defined');
      return null;
    }

    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!response.ok) {
      console.error('Token refresh failed:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.isSuccess && data.result?.accessToken) {
      return data.result.accessToken;
    }

    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일 및 API 라우트는 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 공개 라우트는 통과
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 쿠키에서 accessToken과 userRole 읽기
  let accessToken = request.cookies.get('access_token')?.value;
  const userRole = request.cookies.get('user_role')?.value as 'model' | 'designer' | undefined;

  let isValid = false;

  if (accessToken) {
    // accessToken이 있으면 유효성 검증
    isValid = await verifyAccessToken(accessToken);
  }

  // accessToken이 없거나 만료된 경우 refreshToken으로 재발급 시도
  if (!isValid) {
    const newAccessToken = await refreshAccessToken(request);

    if (newAccessToken) {
      // 재발급 성공 - 새 토큰으로 다시 검증
      isValid = await verifyAccessToken(newAccessToken);
      accessToken = newAccessToken;
    }
  }

  // 재발급도 실패한 경우 로그인 페이지로
  if (!isValid) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    const response = NextResponse.redirect(loginUrl);
    // 만료된 쿠키 삭제
    response.cookies.delete('access_token');
    response.cookies.delete('user_role');
    return response;
  }

  // role 쿠키가 없으면 로그인 페이지로 (role 정보 필요)
  if (!userRole) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('access_token');
    response.cookies.delete('user_role');
    return response;
  }

  // 역할 기반 접근 제어
  if (!checkRoleAccess(pathname, userRole)) {
    // 권한 없음 - 홈으로 리다이렉트 (홈에서 역할에 따라 다른 콘텐츠 표시)
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 인증 성공 - 응답 생성
  const response = NextResponse.next();

  // 새로운 accessToken이 발급된 경우 쿠키 업데이트
  if (accessToken && accessToken !== request.cookies.get('access_token')?.value) {
    response.cookies.set('access_token', accessToken, {
      path: '/',
      maxAge: 3600, // 1시간
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  // 요청 헤더에 사용자 정보 추가 (서버 컴포넌트에서 활용 가능)
  response.headers.set('x-user-role', userRole);

  return response;
}

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외한 모든 요청 경로를 매칭:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico, robots.txt 등
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};
