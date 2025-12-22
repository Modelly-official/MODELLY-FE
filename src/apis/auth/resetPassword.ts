import { axiosInstance } from '@/src/apis/axios';
import type {
  ApiResponse,
  SendResetPasswordCodeRequest,
  SendResetPasswordCodeResponse,
  VerifyResetPasswordRequest,
  VerifyResetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/src/types';

// 비밀번호 재설정 - 인증번호 발송
export const sendResetPasswordCode = async (
  data: SendResetPasswordCodeRequest,
): Promise<ApiResponse<SendResetPasswordCodeResponse>> => {
  const response = await axiosInstance.post<ApiResponse<SendResetPasswordCodeResponse>>(
    '/auth/reset-password/send-code',
    data,
  );
  return response.data;
};

// 비밀번호 재설정 - 사용자 정보 검증
export const verifyResetPassword = async (
  data: VerifyResetPasswordRequest,
): Promise<ApiResponse<VerifyResetPasswordResponse>> => {
  const response = await axiosInstance.post<ApiResponse<VerifyResetPasswordResponse>>(
    '/auth/reset-password/verify',
    data,
  );
  return response.data;
};

// 비밀번호 재설정 - 새로운 비밀번호로 변경
export const resetPassword = async (data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> => {
  const response = await axiosInstance.post<ApiResponse<ResetPasswordResponse>>('/auth/reset-password', data);
  return response.data;
};
