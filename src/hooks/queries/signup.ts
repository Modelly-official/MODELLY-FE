import { useMutation } from "@tanstack/react-query";
import {
  signup,
  sendSmsCode,
  verifySmsCode,
  checkLoginId,
  checkEmail,
} from "@/src/apis/signup";
import type {
  SignupRequest,
  SignupResponse,
  SmsResponse,
  DuplicateCheckResponse,
  ApiResponse,
} from "@/src/types/auth";

/**
 * 일반 회원가입 mutation hook
 */
export function useSignup() {
  return useMutation<ApiResponse<SignupResponse>, Error, SignupRequest>({
    mutationFn: signup,
  });
}

/**
 * SMS 인증번호 발송 mutation hook
 */
export function useSendSmsCode() {
  return useMutation<ApiResponse<SmsResponse>, Error, string>({
    mutationFn: sendSmsCode,
  });
}

/**
 * SMS 인증번호 검증 mutation hook
 */
export function useVerifySmsCode() {
  return useMutation<
    ApiResponse<SmsResponse>,
    Error,
    { phoneNumber: string; authCode: string }
  >({
    mutationFn: ({ phoneNumber, authCode }) =>
      verifySmsCode(phoneNumber, authCode),
  });
}

/**
 * 아이디 중복 체크 mutation hook
 */
export function useCheckLoginId() {
  return useMutation<ApiResponse<DuplicateCheckResponse>, Error, string>({
    mutationFn: checkLoginId,
  });
}

/**
 * 이메일 중복 체크 mutation hook
 */
export function useCheckEmail() {
  return useMutation<ApiResponse<DuplicateCheckResponse>, Error, string>({
    mutationFn: checkEmail,
  });
}
