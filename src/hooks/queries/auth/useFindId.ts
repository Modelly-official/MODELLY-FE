import { useMutation } from '@tanstack/react-query';
import { sendFindIdCode, verifyEmailCode, findId } from '@/src/apis';
import type {
  SendFindIdCodeRequest,
  SendFindIdCodeResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
  FindIdRequest,
  FindIdResponse,
  ApiResponse,
} from '@/src/types';

/**
 * 아이디 찾기 - 인증번호 발송 mutation hook
 */
export function useSendFindIdCode() {
  return useMutation<ApiResponse<SendFindIdCodeResponse>, Error, SendFindIdCodeRequest>({
    mutationFn: sendFindIdCode,
  });
}

/**
 * 이메일 인증번호 검증 mutation hook
 */
export function useVerifyEmailCode() {
  return useMutation<ApiResponse<VerifyEmailCodeResponse>, Error, VerifyEmailCodeRequest>({
    mutationFn: verifyEmailCode,
  });
}

/**
 * 아이디 찾기 - 사용자 정보 조회 mutation hook
 */
export function useFindId() {
  return useMutation<ApiResponse<FindIdResponse>, Error, FindIdRequest>({
    mutationFn: findId,
  });
}
