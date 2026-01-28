import { NOTIFICATION_ROUTES } from '@/src/constants';
import { getUserRole } from '@/src/stores';

interface NotificationRouteParams {
  notificationType?: string;
  targetId?: string | number;
  title?: string;
}

/**
 * 알림 타입과 사용자 역할을 기반으로 이동할 URL 결정
 * - 채팅 알림: /chat/{targetId}
 * - 예약 알림: 디자이너 → /reservations/{targetId}, 모델 → /mypage/reservations
 * - 일정 알림: 리마인더 → / (홈), 변경/취소 → /chat/{targetId}
 * - 리뷰 알림: /mypage/reviews
 */
export function getNotificationTargetUrl({
  notificationType,
  targetId,
  title = '',
}: NotificationRouteParams): string {
  const type = notificationType || '';
  const route = NOTIFICATION_ROUTES[type];
  const id = targetId?.toString();

  // 채팅 알림
  if (route === 'chat' && id) {
    return `/chat/${id}`;
  }

  // 예약 알림: 디자이너는 예약 상세 페이지로
  if (type === '예약 알림') {
    const userRole = getUserRole();
    if (userRole === 'designer' && id) {
      return `/reservations/${id}`;
    }
    return '/mypage/reservations';
  }

  // 일정 알림: title로 리마인더 vs 변경/취소 구분
  if (type === '일정 알림') {
    // 리마인더 알림 → 홈으로 이동
    if (title.includes('리마인더') || title.includes('예정')) {
      return '/';
    }
    // 일정 변경/취소 알림이면 채팅방으로
    if (id) {
      return `/chat/${id}`;
    }
    return '/';
  }

  // 그 외 (리뷰 알림 등)
  if (route) {
    return route;
  }

  return '/notification';
}
