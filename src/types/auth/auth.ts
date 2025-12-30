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

// 소셜 회원가입 요청 타입
export interface SocialSignupRequest {
  base: {
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

export interface SocialSignupResponse {
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

// 로그인 관련 타입

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  accessToken: string;
  userRole: 'MODEL' | 'DESIGNER';
  category?: 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH'; // 디자이너 카테고리
}

export interface LogoutResponse {
  message: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface ValidateResponse {
  message: string;
  isValid: 'VALID' | 'INVALID';
}

// 소셜 로그인 콜백 응답 타입

export interface SocialLoginCallbackRequest {
  code: string;
  state?: string; // 네이버용
}

export interface SocialLoginCallbackResponse {
  userId: number;
  accessToken: string;
  registered: boolean;
  userRole: 'MODEL' | 'DESIGNER';
  category?: 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH'; // 디자이너 카테고리
}

