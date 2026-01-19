'use client';

import { useCallback, useState, ReactNode } from 'react';
import { MessagePayload } from 'firebase/messaging';
import { useFCM } from '@/src/hooks/custom';
import NotificationBanner from '@/src/components/common/NotificationBanner';

interface FCMProviderProps {
  children: ReactNode;
}

interface NotificationState {
  title: string;
  body: string;
  targetId?: string;
  notificationType?: string;
}

/**
 * FCM 포그라운드 메시지 수신 Provider
 * - 앱이 포그라운드일 때 푸시 알림 수신
 * - 클릭 가능한 알림 배너로 표시
 */
export function FCMProvider({ children }: FCMProviderProps) {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  /** 포그라운드 메시지 수신 핸들러 */
  const handleMessage = useCallback((payload: MessagePayload) => {
    const title = payload.notification?.title || '새 알림';
    const body = payload.notification?.body || '';
    const data = payload.data as { targetId?: string; notificationType?: string } | undefined;

    setNotification({
      title,
      body,
      targetId: data?.targetId,
      notificationType: data?.notificationType,
    });
  }, []);

  /** 알림 배너 닫기 */
  const handleClose = useCallback(() => {
    setNotification(null);
  }, []);

  // FCM 훅 사용 (포그라운드 메시지 리스너 등록)
  useFCM(handleMessage);

  return (
    <>
      {children}
      {notification && (
        <NotificationBanner
          title={notification.title}
          body={notification.body}
          targetId={notification.targetId}
          notificationType={notification.notificationType}
          onClose={handleClose}
        />
      )}
    </>
  );
}
