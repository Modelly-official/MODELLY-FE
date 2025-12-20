import { useMutation, useQuery } from '@tanstack/react-query';
import { login, logout, validateToken, socialSignup } from '@/src/apis';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ValidateResponse,
  SocialSignupRequest,
  SocialSignupResponse,
  ApiResponse,
} from '@/src/types';

/**
 * 로그인 mutation hook
 */
export function useLogin() {
  return useMutation<ApiResponse<LoginResponse>, Error, LoginRequest>({
    mutationFn: login,
  });
}

/**
 * 로그아웃 mutation hook
 */
export function useLogout() {
  return useMutation<ApiResponse<LogoutResponse>, Error, void>({
    mutationFn: logout,
  });
}

/**
 * 소셜 회원가입 mutation hook
 */
export function useSocialSignup() {
  return useMutation<ApiResponse<SocialSignupResponse>, Error, SocialSignupRequest>({
    mutationFn: socialSignup,
  });
}

/**
 * 토큰 유효성 검증 query hook
 * 일반적으로 직접 사용하기보다는 middleware나 인증 가드에서 사용
 */
export function useValidateToken(options?: { enabled?: boolean }) {
  return useQuery<ApiResponse<ValidateResponse>, Error>({
    queryKey: ['auth', 'validate'],
    queryFn: validateToken,
    staleTime: 5 * 60 * 1000, // 5분 (토큰 유효성은 자주 체크할 필요 X)
    retry: 0, // 토큰 검증 실패 시 재시도 X
    ...options,
  });
}
