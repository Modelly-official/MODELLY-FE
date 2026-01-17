/**
 * Firebase 설정 및 초기화
 *
 * FCM(Firebase Cloud Messaging) 푸시 알림을 위한 Firebase 설정 파일
 * - 앱 초기화: getFirebaseApp()
 * - 메시징 인스턴스: getFirebaseMessaging()
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';

/** Firebase 프로젝트 설정 (환경변수에서 로드) */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** 싱글톤 인스턴스 */
let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

/**
 * Firebase 앱 인스턴스 반환 (싱글톤)
 * 이미 초기화된 앱이 있으면 재사용
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

/**
 * Firebase Messaging 인스턴스 반환
 * - 서버 사이드에서는 null 반환
 * - 브라우저가 FCM을 지원하지 않으면 null 반환
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  // 서버 사이드 체크
  if (typeof window === 'undefined') {
    return null;
  }

  // 브라우저 지원 여부 체크
  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  // 싱글톤 인스턴스 반환
  if (!messaging) {
    const firebaseApp = getFirebaseApp();
    messaging = getMessaging(firebaseApp);
  }

  return messaging;
}

/** 웹 푸시 인증용 VAPID 키 */
export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
