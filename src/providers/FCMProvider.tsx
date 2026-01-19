'use client';

import { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { MessagePayload } from 'firebase/messaging';
import { useFCM } from '@/src/hooks/custom';
import { useSaveFcmToken } from '@/src/hooks/queries';
import { getAccessToken } from '@/src/stores';
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
 * - 로그인 + 권한 granted 시 자동 FCM 토큰 등록
 */
export function FCMProvider({ children }: FCMProviderProps) {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const tokenRegisteredRef = useRef(false);

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
  const { permission, requestPermission } = useFCM(handleMessage);
  const { mutate: saveFcmToken } = useSaveFcmToken();

  // 로그인 + 권한 granted 시 자동 FCM 토큰 등록
  useEffect(() => {
    const autoRegisterToken = async () => {
      const accessToken = getAccessToken();

      // 로그인 상태 + 권한 허용 + 아직 등록 안 함
      if (accessToken && permission === 'granted' && !tokenRegisteredRef.current) {
        tokenRegisteredRef.current = true;

        const fcmToken = await requestPermission();
        if (fcmToken) {
          saveFcmToken(fcmToken, {
            onError: () => {
              tokenRegisteredRef.current = false;
            },
          });
        } else {
          tokenRegisteredRef.current = false;
        }
      }
    };

    autoRegisterToken();
  }, [permission, requestPermission, saveFcmToken]);

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
