/**
 * Firebase Messaging Service Worker
 *
 * 백그라운드 푸시 알림 처리를 위한 Service Worker
 * - 앱이 백그라운드/종료 상태일 때 푸시 수신
 * - 알림 클릭 시 해당 페이지로 이동
 *
 * 주의: public/ 폴더에 위치해야 브라우저가 접근 가능
 */

/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

/** Firebase 설정 (환경변수 사용 불가하여 직접 입력) */
const firebaseConfig = {
  apiKey: 'AIzaSyBKvX4wjkYJIgReMuQ1Lh6VVxY3HAAblbk',
  authDomain: 'modelly-479918.firebaseapp.com',
  projectId: 'modelly-479918',
  storageBucket: 'modelly-479918.firebasestorage.app',
  messagingSenderId: '499520026066',
  appId: '1:499520026066:web:1f2fad0f1ee14bf07c840b',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

/**
 * 백그라운드 메시지 수신 핸들러
 * 앱이 포커스되지 않은 상태에서 푸시를 받으면 실행
 */
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || '새 알림';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/icons/app/icon-192x192.png',
    badge: '/icons/app/icon-72x72.png',
    data: payload.data,
    tag: payload.data?.notificationId || 'default',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * 알림 클릭 핸들러
 * 알림 타입에 따라 적절한 페이지로 이동
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data;
  let targetUrl = '/notification'; // 기본: 알림 목록 페이지

  // 알림 타입별 이동 경로 결정
  if (data?.targetId) {
    const notificationType = data.notificationType || '';

    if (notificationType.includes('채팅') || notificationType.includes('메시지')) {
      targetUrl = `/chat/${data.targetId}`;
    } else if (notificationType.includes('예약')) {
      targetUrl = '/mypage/reservations';
    } else if (notificationType.includes('리뷰')) {
      targetUrl = '/mypage/reviews';
    } else if (notificationType.includes('일정')) {
      targetUrl = '/mypage/reservations';
    }
  }

  // 열린 창이 있으면 포커스, 없으면 새 창 열기
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
