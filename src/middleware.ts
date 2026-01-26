import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPublicRoute, checkRoleAccess, isDesignerBlockedRoute } from '@/src/utils/middleware/routeGuard';
import { ValidateResponse } from '@/src/types/auth/auth';
import { ApiResponse } from '@/src/types';

/**
 * refreshAccessToken 결과 타입
 * - accessToken: 새로 발급된 accessToken
 * - setCookieHeader: 백엔드에서 전달하는 Set-Cookie 헤더 (refresh_token 갱신)
 */
interface RefreshResult {
  accessToken: string | null;
  setCookieHeader: string | null;
}

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
 * - 백엔드에서 Set-Cookie 헤더로 새로운 refresh_token을 전달하므로 함께 반환
 * @param request - NextRequest 객체 (refreshToken 쿠키 포함)
 * @returns RefreshResult (accessToken과 setCookieHeader)
 */
async function refreshAccessToken(request: NextRequest): Promise<RefreshResult> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      console.error('[Middleware] NEXT_PUBLIC_API_BASE_URL is not defined');
      return { accessToken: null, setCookieHeader: null };
    }

    const refreshToken = request.cookies.get('refresh_token')?.value;
    const accessToken = request.cookies.get('access_token')?.value;

    // 디버그 로그: 쿠키 상태
    console.log('[Middleware Debug] ===== Refresh Attempt =====');
    console.log('[Middleware Debug] Path:', request.nextUrl.pathname);
    console.log('[Middleware Debug] refresh_token exists:', !!refreshToken);
    console.log('[Middleware Debug] access_token exists:', !!accessToken);
    if (refreshToken) {
      // JWT의 payload에서 iat 확인 (Base64 디코딩)
      try {
        const payload = JSON.parse(atob(refreshToken.split('.')[1]));
        console.log(
          '[Middleware Debug] refresh_token iat:',
          payload.iat,
          '→',
          new Date(payload.iat * 1000).toISOString(),
        );
      } catch {
        console.log('[Middleware Debug] refresh_token payload parse failed');
      }
    }

    if (!refreshToken) {
      console.log('[Middleware Debug] No refresh_token cookie, skip refresh');
      return { accessToken: null, setCookieHeader: null };
    }

    const response = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    console.log('[Middleware Debug] Refresh API response status:', response.status);

    if (!response.ok) {
      // 에러 응답 본문도 로깅
      try {
        const errorBody = await response.text();
        console.error('[Middleware Debug] Refresh failed body:', errorBody);
      } catch {
        console.error('[Middleware Debug] Could not read error body');
      }
      console.error('[Middleware] Token refresh failed:', response.status);
      return { accessToken: null, setCookieHeader: null };
    }

    const data = await response.json();

    // 백엔드에서 전달하는 Set-Cookie 헤더 (새로운 refresh_token)
    const setCookieHeader = response.headers.get('set-cookie');

    if (data.isSuccess && data.result?.accessToken) {
      console.log('[Middleware Debug] Refresh SUCCESS');
      console.log('[Middleware Debug] Set-Cookie header exists:', !!setCookieHeader);
      return {
        accessToken: data.result.accessToken,
        setCookieHeader,
      };
    }

    console.log('[Middleware Debug] Refresh response not successful:', data);
    return { accessToken: null, setCookieHeader: null };
  } catch (error) {
    console.error('Token refresh error:', error);
    return { accessToken: null, setCookieHeader: null };
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

  // 공개 라우트: soft refresh 시도 (실패해도 통과)
  if (isPublicRoute(pathname)) {
    const currentAccessToken = request.cookies.get('access_token')?.value;
    const userRole = request.cookies.get('user_role')?.value;

    // 디자이너가 차단된 라우트에 접근 시 홈으로 리다이렉트
    if (userRole === 'designer' && isDesignerBlockedRoute(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // user_role 있고 accessToken 없으면 갱신 시도 (이전에 로그인했던 사용자)
    if (userRole && !currentAccessToken) {
      const refreshResult = await refreshAccessToken(request);
      if (refreshResult.accessToken) {
        const response = NextResponse.next();
        response.cookies.set('access_token', refreshResult.accessToken, {
          path: '/',
          maxAge: 604800,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        // 백엔드에서 새로운 refresh_token을 Set-Cookie로 보냈다면 클라이언트에 전달
        if (refreshResult.setCookieHeader) {
          response.headers.append('Set-Cookie', refreshResult.setCookieHeader);
        }
        return response;
      }
    }
    return NextResponse.next();
  }

  // 쿠키에서 accessToken과 userRole 읽기
  let accessToken = request.cookies.get('access_token')?.value;
  const userRole = request.cookies.get('user_role')?.value as 'model' | 'designer' | undefined;

  let isValid = false;
  let refreshSetCookieHeader: string | null = null;

  if (accessToken) {
    // accessToken이 있으면 유효성 검증
    isValid = await verifyAccessToken(accessToken);
  }

  // accessToken이 없거나 만료된 경우 refreshToken으로 재발급 시도
  if (!isValid) {
    const refreshResult = await refreshAccessToken(request);

    if (refreshResult.accessToken) {
      // 재발급 성공 - refresh API가 성공하면 토큰은 유효함
      isValid = true;
      accessToken = refreshResult.accessToken;
      refreshSetCookieHeader = refreshResult.setCookieHeader;
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
    response.cookies.delete('user_category');
    return response;
  }

  // role 쿠키가 없으면 로그인 페이지로 (role 정보 필요)
  if (!userRole) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('access_token');
    response.cookies.delete('user_role');
    response.cookies.delete('user_category');
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
      maxAge: 604800, // 7일 (refreshToken 유효기간과 동기화)
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  // 백엔드에서 새로운 refresh_token을 Set-Cookie로 보냈다면 클라이언트에 전달
  if (refreshSetCookieHeader) {
    response.headers.append('Set-Cookie', refreshSetCookieHeader);
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
