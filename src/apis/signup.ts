import { axiosInstance } from './axios';
import type {
  ApiResponse,
  SignupRequest,
  SignupResponse,
  SmsResponse,
  DuplicateCheckResponse,
} from '@/src/types/auth';


// 회원가입
export const signup = async (data: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
  const response = await axiosInstance.post<ApiResponse<SignupResponse>>('/auth/signup', data);
  return response.data;
};

// SMS 인증번호 발송
export const sendSmsCode = async (phoneNumber: string): Promise<ApiResponse<SmsResponse>> => {
  const response = await axiosInstance.post<ApiResponse<SmsResponse>>('/auth/sms/send-code', {
    phoneNumber,
  });
  return response.data;
};

// SMS 인증번호 검증
export const verifySmsCode = async (
  phoneNumber: string,
  authCode: string
): Promise<ApiResponse<SmsResponse>> => {
  const response = await axiosInstance.post<ApiResponse<SmsResponse>>('/auth/sms/verify', {
    phoneNumber,
    authCode,
  });
  return response.data;
};

// 아이디 중복 체크
export const checkLoginId = async (value: string): Promise<ApiResponse<DuplicateCheckResponse>> => {
  const response = await axiosInstance.get<ApiResponse<DuplicateCheckResponse>>(
    `/auth/check/login-id?value=${encodeURIComponent(value)}`
  );
  return response.data;
};

// 이메일 중복 체크
export const checkEmail = async (value: string): Promise<ApiResponse<DuplicateCheckResponse>> => {
  const response = await axiosInstance.get<ApiResponse<DuplicateCheckResponse>>(
    `/auth/check/email?value=${encodeURIComponent(value)}`
  );
  return response.data;
};
