'use client';

import { useCallback, ReactNode } from 'react';
import { MessagePayload } from 'firebase/messaging';
import { useFCM } from '@/src/hooks/custom';
import { useToast } from '@/src/hooks/common/useToast';

interface FCMProviderProps {
  children: ReactNode;
}

/**
 * FCM 포그라운드 메시지 수신 Provider
 * - 앱이 포그라운드일 때 푸시 알림 수신
 * - Toast로 알림 표시
 */
export function FCMProvider({ children }: FCMProviderProps) {
  const { showToast } = useToast();

  /** 포그라운드 메시지 수신 핸들러 */
  const handleMessage = useCallback(
    (payload: MessagePayload) => {
      const title = payload.notification?.title || '새 알림';
      const body = payload.notification?.body || '';

      // Toast로 알림 표시
      const message = body ? `${title}: ${body}` : title;
      showToast(message);
    },
    [showToast]
  );

  // FCM 훅 사용 (포그라운드 메시지 리스너 등록)
  useFCM(handleMessage);

  return <>{children}</>;
}
