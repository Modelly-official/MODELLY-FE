import { NextRequest } from "next/server";
import {
  PUBLIC_ROUTES,
  MODEL_ONLY_ROUTES,
  DESIGNER_ONLY_ROUTES,
} from "@/src/constants/routes";

interface ValidateResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    userId: number;
    role: "MODEL" | "DESIGNER";
    username: string;
  };
}

/**
 * 백엔드 API로 accessToken 검증
 * @param accessToken - 검증할 액세스 토큰
 * @returns 사용자 정보 또는 null
 */
export async function verifyAccessToken(accessToken: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/validate`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: ValidateResponse = await response.json();

    if (data.isSuccess && data.result) {
      return {
        userId: data.result.userId,
        role: data.result.role.toLowerCase() as "model" | "designer",
        username: data.result.username,
      };
    }

    return null;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

/**
 * refreshToken으로 새로운 accessToken 발급
 * @param request - NextRequest 객체 (refreshToken 쿠키 포함)
 * @returns 새로운 accessToken 또는 null
 */
export async function refreshAccessToken(
  request: NextRequest
): Promise<string | null> {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.isSuccess && data.result?.accessToken) {
      return data.result.accessToken;
    }

    return null;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

/**
 * 공개 라우트 확인
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });
}

/**
 * 역할 기반 접근 권한 확인
 */
export function checkRoleAccess(pathname: string, role: string): boolean {
  if (MODEL_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    return role === "model";
  }
  if (DESIGNER_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    return role === "designer";
  }
  return true;
}
