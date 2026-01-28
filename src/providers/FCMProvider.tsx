'use client';

import { useCallback, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { MessagePayload } from 'firebase/messaging';
import { useQueryClient } from '@tanstack/react-query';
import { useFCM } from '@/src/hooks/custom';
import { useSaveFcmToken, notificationKeys } from '@/src/hooks/queries';
import { getAccessToken } from '@/src/stores';
import { NOTIFICATION_STORAGE_KEYS } from '@/src/constants/notification';
import { showNotificationToast } from '@/src/components/common/NotificationToast';

/** sessionStorage에서 토큰 등록 상태 조회 */
function getTokenRegistered(): boolean {
  try {
    return sessionStorage.getItem(NOTIFICATION_STORAGE_KEYS.TOKEN_REGISTERED) === 'true';
  } catch {
    return false;
  }
}

/** sessionStorage에 토큰 등록 상태 저장 */
function setTokenRegistered(value: boolean): void {
  try {
    if (value) {
      sessionStorage.setItem(NOTIFICATION_STORAGE_KEYS.TOKEN_REGISTERED, 'true');
    } else {
      sessionStorage.removeItem(NOTIFICATION_STORAGE_KEYS.TOKEN_REGISTERED);
    }
  } catch {
    // Private mode fallback
  }
}

interface FCMProviderProps {
  children: ReactNode;
}

/**
 * FCM 포그라운드 메시지 수신 Provider
 * - 앱이 포그라운드일 때 푸시 알림 수신
 * - Sonner 토스트로 누적 표시
 * - 로그인 + 권한 granted 시 자동 FCM 토큰 등록
 */
export function FCMProvider({ children }: FCMProviderProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  /** 포그라운드 메시지 수신 핸들러 */
  const handleMessage = useCallback(
    (payload: MessagePayload) => {
      const title = payload.notification?.title || '새 알림';
      const body = payload.notification?.body || '';
      const data = payload.data as { targetId?: string; notificationType?: string } | undefined;

      // 현재 해당 채팅방에 있으면 배너 표시 안 함
      const isChatNotification = data?.notificationType?.includes('채팅');
      const isInSameChatRoom = pathname === `/chat/${data?.targetId}`;

      if (isChatNotification && isInSameChatRoom) {
        // 알림 쿼리 갱신 (unread + list)
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        return;
      }

      // Sonner 토스트로 알림 표시 (누적 가능)
      showNotificationToast({
        title,
        body,
        targetId: data?.targetId,
        notificationType: data?.notificationType,
      });

      // 알림 쿼리 갱신 (unread + list)
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    [queryClient, pathname]
  );

  // FCM 훅 사용 (포그라운드 메시지 리스너 등록)
  const { permission, requestPermission } = useFCM(handleMessage);
  const { mutate: saveFcmToken } = useSaveFcmToken();

  // 로그인 + 권한 granted 시 자동 FCM 토큰 등록
  useEffect(() => {
    const autoRegisterToken = async () => {
      const accessToken = getAccessToken();

      // 로그아웃 상태면 sessionStorage 리셋 (다음 로그인 시 재등록 가능하도록)
      if (!accessToken) {
        setTokenRegistered(false);
        return;
      }

      // 로그인 상태 + 권한 허용 + 아직 등록 안 함
      if (permission === 'granted' && !getTokenRegistered()) {
        setTokenRegistered(true);

        const fcmToken = await requestPermission();
        if (fcmToken) {
          saveFcmToken(fcmToken, {
            onError: () => {
              setTokenRegistered(false);
            },
          });
        } else {
          setTokenRegistered(false);
        }
      }
    };

    autoRegisterToken();
  }, [permission, requestPermission, saveFcmToken]);

  return <>{children}</>;
}
