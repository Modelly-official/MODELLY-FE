import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyAccessToken,
  refreshAccessToken,
  isPublicRoute,
  checkRoleAccess,
} from "@/src/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일 및 API 라우트는 제외
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 공개 라우트는 통과
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 쿠키에서 accessToken과 userRole 읽기
  let accessToken = request.cookies.get("access_token")?.value;
  const userRole = request.cookies.get("user_role")?.value as
    | "model"
    | "designer"
    | undefined;

  // accessToken이 없으면 로그인 페이지로
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 백엔드 API로 토큰 유효성 검증
  let isValid = await verifyAccessToken(accessToken);

  // 토큰이 만료된 경우 refreshToken으로 재발급 시도
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
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    // 만료된 쿠키 삭제
    response.cookies.delete("access_token");
    response.cookies.delete("user_role");
    return response;
  }

  // role 쿠키가 없으면 로그인 페이지로 (role 정보 필요)
  if (!userRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    response.cookies.delete("user_role");
    return response;
  }

  // 역할 기반 접근 제어
  if (!checkRoleAccess(pathname, userRole)) {
    // 권한 없음 - 역할에 맞는 홈으로 리다이렉트
    const homeUrl =
      userRole === "model"
        ? new URL("/model", request.url)
        : new URL("/designer", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // 인증 성공 - 응답 생성
  const response = NextResponse.next();

  // 새로운 accessToken이 발급된 경우 쿠키 업데이트
  if (accessToken !== request.cookies.get("access_token")?.value) {
    response.cookies.set("access_token", accessToken, {
      path: "/",
      maxAge: 3600, // 1시간
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // 요청 헤더에 사용자 정보 추가 (서버 컴포넌트에서 활용 가능)
  response.headers.set("x-user-role", userRole);

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
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
};
