// 회원가입 API 관련 타입

export interface SignupRequest {
  base: {
    loginId: string;
    password: string;
    email: string;
    name: string;
    phoneNum: string;
    gender: 'MALE' | 'FEMALE';
    birth: string; // YYYY-MM-DD
    userRole: 'DESIGNER' | 'MODEL';
    imageUrl?: string;
  };
  designer?: {
    shop: string;
    addressLine1: string;
    addressLine2: string;
    category: 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH';
    nickname: string;
  };
  model?: {
    nickname: string;
  };
}

export interface SignupResponse {
  message: string;
  loginId: string;
  name: string;
  nickname: string;
}

// SMS 인증 관련 타입

export interface SendSmsRequest {
  phoneNumber: string;
}

export interface VerifySmsRequest {
  phoneNumber: string;
  authCode: string;
}

export interface SmsResponse {
  message: string;
}

// 중복 체크 관련 타입

export interface DuplicateCheckResponse {
  field: string;
  value: string;
  available: boolean;
}

// 공통 API 응답 타입

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
