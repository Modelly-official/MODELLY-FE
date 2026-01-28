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
 * IndexedDB에서 userRole 읽기
 * Service Worker에서 쿠키 접근이 불가하므로 IndexedDB 사용
 * 주의: SW가 먼저 실행될 수 있으므로 onupgradeneeded에서 스토어 생성 필요
 */
async function getUserRoleFromIDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open('moandi-sw', 1);
    request.onerror = () => resolve(null);

    // SW가 먼저 실행되면 스토어를 생성해야 앱의 saveUserRoleToIDB가 동작함
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('user-info')) {
        db.createObjectStore('user-info');
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('user-info')) {
        db.close();
        resolve(null);
        return;
      }
      const tx = db.transaction('user-info', 'readonly');
      const getRequest = tx.objectStore('user-info').get('userRole');
      getRequest.onsuccess = () => {
        db.close();
        resolve(getRequest.result || null);
      };
      getRequest.onerror = () => {
        db.close();
        resolve(null);
      };
    };
  });
}

/**
 * 알림 타입별 이동 경로 결정
 *
 * 백엔드 반환 값 (notificationType):
 * - CHATTING: "채팅 알림"
 * - RESERVATION: "예약 확정", "예약 취소", "예약 신청 알림", "예약 알림"
 * - REVIEW: "리뷰 알림", "리뷰 답글 알림"
 * - SCHEDULE: "예약 변경", "예약 취소", "일정 알림"
 *
 * 라우팅 규칙:
 * - 채팅 알림: /chat/{targetId}
 * - 리뷰 알림: /mypage/reviews
 * - 일정 알림 (SCHEDULE): 리마인더 → /, 변경/취소 → /chat/{targetId}
 * - 예약 알림 (RESERVATION): 디자이너 → /reservations/{targetId}, 모델 → /mypage/reservations
 */
async function getNotificationTargetUrl(data, title) {
  const type = data?.notificationType || '';
  const targetId = data?.targetId;

  // 1. 채팅 알림
  if (type.includes('채팅')) {
    return targetId ? `/chat/${targetId}` : '/chat';
  }

  // 2. 리뷰 알림 ("리뷰 알림", "리뷰 답글 알림")
  if (type.includes('리뷰')) {
    return '/mypage/reviews';
  }

  // 3. 일정 알림 (SCHEDULE 타입: "예약 변경", "예약 취소", "일정 알림")
  //    ⚠️ "예약 변경/취소"가 "예약" 키워드를 포함하므로 예약 체크보다 먼저!
  if (type.includes('일정') || type === '예약 변경' || type === '예약 취소') {
    // 리마인더 알림 → 홈으로 이동
    if (title && (title.includes('리마인더') || title.includes('예정'))) {
      return '/';
    }
    // 일정 변경/취소 알림 → 채팅방으로 이동
    if (targetId) {
      return `/chat/${targetId}`;
    }
    return '/';
  }

  // 4. 예약 알림 (RESERVATION 타입: "예약 확정", "예약 신청 알림", "예약 알림")
  if (type.includes('예약')) {
    const userRole = await getUserRoleFromIDB();
    if (userRole === 'designer' && targetId) {
      return `/reservations/${targetId}`;
    }
    return '/mypage/reservations';
  }

  return '/notification';
}

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
  const title = event.notification.title;

  event.waitUntil(
    getNotificationTargetUrl(data, title).then((targetUrl) => {
      return clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
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
      });
    })
  );
});
