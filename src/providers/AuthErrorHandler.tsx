'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_ERROR_EVENT, AUTH_ERROR_MESSAGES, AuthErrorEvent } from '@/src/types/auth/authError';
import { showToast } from '@/src/utils';

export function AuthErrorHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAuthError = useCallback(
    (event: CustomEvent<AuthErrorEvent>) => {
      // 중복 리다이렉트 방지
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }

      const { type, redirectUrl } = event.detail;
      showToast(AUTH_ERROR_MESSAGES[type]);
      queryClient.clear(); // 만료된 데이터 캐시 클리어

      redirectTimeoutRef.current = setTimeout(() => {
        // 401/TOKEN_EXPIRED: 로그인 페이지로 리다이렉트 (callbackUrl 유지)
        const callbackUrl = redirectUrl || window.location.pathname;
        router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }, 100);
    },
    [router, queryClient],
  );

  useEffect(() => {
    const handler = (e: Event) => handleAuthError(e as CustomEvent<AuthErrorEvent>);
    window.addEventListener(AUTH_ERROR_EVENT, handler);
    return () => window.removeEventListener(AUTH_ERROR_EVENT, handler);
  }, [handleAuthError]);

  return <>{children}</>;
}
