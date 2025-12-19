import { axiosInstance } from "./axios";
import { useAuthStore, setAccessToken } from "@/src/stores/useAuthStore";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  ValidateResponse,
  ApiResponse,
  SocialSignupRequest,
  SocialSignupResponse,
} from "@/src/types/auth";

/**
 * 로그인
 * - accessToken: body로 받아서 쿠키에 저장
 * - refreshToken: Set-Cookie 헤더로 자동 저장 (HttpOnly)
 */
export const login = async (
  payload: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    payload
  );

  // accessToken을 쿠키에 저장
  if (response.data.isSuccess && response.data.result?.accessToken) {
    setAccessToken(response.data.result.accessToken);
  }

  return response.data;
};

/**
 * 로그아웃
 * - 백엔드에 로그아웃 요청 (refreshToken 쿠키 삭제)
 * - 프론트엔드에서 accessToken 쿠키 삭제
 */
export const logout = async (): Promise<ApiResponse<LogoutResponse>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<LogoutResponse>>(
      "/auth/logout"
    );
    return response.data;
  } finally {
    // 에러가 나도 쿠키는 삭제
    useAuthStore.getState().clearAuth();
  }
};

/**
 * Access Token 재발급
 * - refreshToken 쿠키로 새로운 accessToken 발급
 */
export const refreshAccessToken = async (): Promise<
  ApiResponse<RefreshResponse>
> => {
  const response = await axiosInstance.post<ApiResponse<RefreshResponse>>(
    "/auth/refresh"
  );

  // 새로운 accessToken을 쿠키에 저장
  if (response.data.isSuccess && response.data.result?.accessToken) {
    setAccessToken(response.data.result.accessToken);
  }

  return response.data;
};

/**
 * Access Token 유효성 검증
 */
export const validateToken = async (): Promise<
  ApiResponse<ValidateResponse>
> => {
  const response = await axiosInstance.get<ApiResponse<ValidateResponse>>(
    "/auth/validate"
  );
  return response.data;
};

/**
 * 소셜 회원가입
 * - Authorization 헤더에 accessToken 필요 (axios interceptor에서 자동 추가)
 * - 소셜 로그인 후 추가 정보를 입력받아 회원가입 완료
 */
export const socialSignup = async (
  payload: SocialSignupRequest
): Promise<ApiResponse<SocialSignupResponse>> => {
  const response = await axiosInstance.post<ApiResponse<SocialSignupResponse>>(
    "/auth/social/signup",
    payload
  );
  return response.data;
};
