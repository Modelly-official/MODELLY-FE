/**
 * FCM(Firebase Cloud Messaging) 훅
 *
 * 푸시 알림 권한 요청 및 토큰 발급을 담당
 *
 * @example
 * const { token, permission, requestPermission } = useFCM();
 *
 *   권한 요청 및 토큰 발급
 * const handleEnableNotification = async () => {
 *   const fcmToken = await requestPermission();
 *   if (fcmToken) {
 *     await saveFcmToken(fcmToken); // 서버에 토큰 저장
 *   }
 * };
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { getFirebaseMessaging, VAPID_KEY } from '@/src/config/firebase';

interface UseFCMReturn {
  /** 발급된 FCM 토큰 (null이면 미발급) */
  token: string | null;
  /** 현재 알림 권한 상태: 'default' | 'granted' | 'denied' */
  permission: NotificationPermission;
  /** 알림 권한 요청 및 토큰 발급 함수 */
  requestPermission: () => Promise<string | null>;
}

/** SSR 안전한 초기 권한 상태 조회 */
function getInitialPermission(): NotificationPermission {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return 'default';
}

/**
 * FCM 훅
 * @param onMessageReceived - 포그라운드 메시지 수신 콜백 (선택)
 */
export function useFCM(onMessageReceived?: (payload: MessagePayload) => void): UseFCMReturn {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(getInitialPermission);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * 알림 권한 요청 및 FCM 토큰 발급
   * @returns FCM 토큰 또는 null (권한 거부/오류 시)
   */
  const requestPermission = useCallback(async (): Promise<string | null> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    try {
      // 1. 브라우저 알림 권한 요청
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') return null;

      // 2. Firebase Messaging 인스턴스 획득
      const messaging = await getFirebaseMessaging();
      if (!messaging) return null;

      // 3. Service Worker 등록
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;

      // 4. FCM 토큰 발급
      const fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      setToken(fcmToken);
      return fcmToken;
    } catch {
      return null;
    }
  }, []);

  /** 포그라운드 메시지 수신 리스너 설정 */
  useEffect(() => {
    if (!onMessageReceived) return;

    const setup = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribeRef.current = onMessage(messaging, onMessageReceived);
    };

    setup();

    return () => {
      unsubscribeRef.current?.();
    };
  }, [onMessageReceived]);

  return { token, permission, requestPermission };
}
