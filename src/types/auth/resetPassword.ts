// 비밀번호 재설정 API 관련 타입

// 1) 비밀번호 재설정 - 인증번호 발송
export interface SendResetPasswordCodeRequest {
  name: string;
  loginId: string;
  email: string;
}

export interface SendResetPasswordCodeResponse {
  message: string;
}

// 2) 비밀번호 재설정 - 사용자 정보 검증
export interface VerifyResetPasswordRequest {
  name: string;
  loginId: string;
  email: string;
}

export interface VerifyResetPasswordResponse {
  message: string;
}

// 3) 비밀번호 재설정 - 새로운 비밀번호로 변경
export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
