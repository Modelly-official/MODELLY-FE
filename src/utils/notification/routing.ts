import { getUserRole } from '@/src/stores';

interface NotificationRouteParams {
  notificationType?: string;
  targetId?: string | number;
  title?: string;
}

/**
 * 알림 타입과 사용자 역할을 기반으로 이동할 URL 결정
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
export function getNotificationTargetUrl({
  notificationType,
  targetId,
  title = '',
}: NotificationRouteParams): string {
  const type = notificationType || '';
  const id = targetId?.toString();

  // 1. 채팅 알림
  if (type.includes('채팅')) {
    return id ? `/chat/${id}` : '/chat';
  }

  // 2. 리뷰 알림 ("리뷰 알림", "리뷰 답글 알림")
  if (type.includes('리뷰')) {
    return '/mypage/reviews';
  }

  // 3. 일정 알림 (SCHEDULE 타입: "예약 변경", "예약 취소", "일정 알림")
  //    ⚠️ "예약 변경/취소"가 "예약" 키워드를 포함하므로 예약 체크보다 먼저!
  if (type.includes('일정') || type === '예약 변경' || type === '예약 취소') {
    // 리마인더 알림 → 홈으로 이동
    if (title.includes('리마인더') || title.includes('예정')) {
      return '/';
    }
    // 일정 변경/취소 알림 → 채팅방으로
    if (id) {
      return `/chat/${id}`;
    }
    return '/';
  }

  // 4. 예약 알림 (RESERVATION 타입: "예약 확정", "예약 신청 알림", "예약 알림")
  if (type.includes('예약')) {
    const userRole = getUserRole();
    if (userRole === 'designer' && id) {
      return `/reservations/${id}`;
    }
    return '/mypage/reservations';
  }

  return '/notification';
}
