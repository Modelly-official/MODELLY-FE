/**
 * API 로깅 유틸리티
 * 개발 환경에서 SSR/CSR API 호출을 추적하기 위한 로거
 *
 * 환경 변수로 제어:
 * - NEXT_PUBLIC_API_LOGGING=true  → 로깅 활성화
 * - NEXT_PUBLIC_API_LOGGING=false → 로깅 비활성화 (기본값)
 */

const isLoggingEnabled = () => {
  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_API_LOGGING === 'true';
};

const getPrefix = () => {
  const isServer = typeof window === 'undefined';
  return isServer ? '[SSR]' : '[CSR]';
};

export const apiLogger = {
  request: (method: string, url: string, params?: unknown) => {
    if (!isLoggingEnabled()) return;
    const prefix = getPrefix();
    console.log(`${prefix} [REQ] ${method.toUpperCase()} ${url}`, params ?? '');
  },

  response: (url: string, status: number, data: unknown) => {
    if (!isLoggingEnabled()) return;
    const prefix = getPrefix();
    console.log(`${prefix} [RES] ${status} ${url}`, data);
  },

  error: (url: string, status: number, error: unknown) => {
    if (!isLoggingEnabled()) return;
    const prefix = getPrefix();
    console.error(`${prefix} [ERR] ${status} ${url}`, error);
  },
};
