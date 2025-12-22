import { useMutation } from '@tanstack/react-query';
import { sendResetPasswordCode, verifyResetPassword, resetPassword } from '@/src/apis';
import type {
  SendResetPasswordCodeRequest,
  SendResetPasswordCodeResponse,
  VerifyResetPasswordRequest,
  VerifyResetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ApiResponse,
} from '@/src/types';

/**
 * 비밀번호 재설정 - 인증번호 발송 mutation hook
 */
export function useSendResetPasswordCode() {
  return useMutation<ApiResponse<SendResetPasswordCodeResponse>, Error, SendResetPasswordCodeRequest>({
    mutationFn: sendResetPasswordCode,
  });
}

/**
 * 비밀번호 재설정 - 사용자 정보 검증 mutation hook
 */
export function useVerifyResetPassword() {
  return useMutation<ApiResponse<VerifyResetPasswordResponse>, Error, VerifyResetPasswordRequest>({
    mutationFn: verifyResetPassword,
  });
}

/**
 * 비밀번호 재설정 - 새로운 비밀번호로 변경 mutation hook
 */
export function useResetPassword() {
  return useMutation<ApiResponse<ResetPasswordResponse>, Error, ResetPasswordRequest>({
    mutationFn: resetPassword,
  });
}
