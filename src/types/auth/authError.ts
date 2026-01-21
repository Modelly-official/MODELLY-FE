export type AuthErrorType = 'UNAUTHORIZED' | 'TOKEN_EXPIRED';

export interface AuthErrorEvent {
  type: AuthErrorType;
  redirectUrl?: string;
}

export const AUTH_ERROR_EVENT = 'auth:error';
export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, string> = {
  UNAUTHORIZED: '로그인이 필요합니다',
  TOKEN_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요',
};
