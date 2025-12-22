import { axiosInstance } from '@/src/apis/axios';
import type {
  ApiResponse,
  SendFindIdCodeRequest,
  SendFindIdCodeResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
  FindIdRequest,
  FindIdResponse,
} from '@/src/types';

// 아이디 찾기 - 인증번호 발송
export const sendFindIdCode = async (data: SendFindIdCodeRequest): Promise<ApiResponse<SendFindIdCodeResponse>> => {
  const response = await axiosInstance.post<ApiResponse<SendFindIdCodeResponse>>('/auth/find-id/send-code', data);
  return response.data;
};

// 이메일 인증번호 검증
export const verifyEmailCode = async (data: VerifyEmailCodeRequest): Promise<ApiResponse<VerifyEmailCodeResponse>> => {
  const response = await axiosInstance.post<ApiResponse<VerifyEmailCodeResponse>>('/auth/email/verify', data);
  return response.data;
};

// 아이디 찾기 - 사용자 정보 조회
export const findId = async (data: FindIdRequest): Promise<ApiResponse<FindIdResponse>> => {
  const response = await axiosInstance.post<ApiResponse<FindIdResponse>>('/auth/find-id', data);
  return response.data;
};
