// 아이디 찾기 API 관련 타입

// 1) 아이디 찾기 - 인증번호 발송
export interface SendFindIdCodeRequest {
  name: string;
  email: string;
}

export interface SendFindIdCodeResponse {
  message: string;
}

// 2) 이메일 인증번호 검증
export interface VerifyEmailCodeRequest {
  email: string;
  authCode: string;
  type: 'FIND_ID' | 'RESET_PASSWORD' | 'SIGNUP';
}

export interface VerifyEmailCodeResponse {
  message: string;
}

// 3) 아이디 찾기 - 사용자 정보 조회
export interface FindIdRequest {
  name: string;
  email: string;
}

export interface FindIdResponse {
  loginType: string; // 'JWT', 'KAKAO', 'NAVER', 'GOOGLE' 등
  name: string;
  loginId: string;
  email: string;
}
