import { getUserRole } from '@/src/stores';
import type {
  NotificationCategory,
  NotificationTypeDescription,
} from '@/src/types/notification';

interface NotificationRouteParams {
  notificationType?: NotificationCategory | string;
  typeDescription?: NotificationTypeDescription | string;
  targetId?: string | number;
  title?: string;
}

/**
 * 알림 타입과 세부 타입을 기반으로 이동할 URL 결정 (v2)
 *
 * FCM data 구조:
 * - notificationType: 카테고리 ("예약 알림", "채팅 알림", "리뷰 알림", "일정 알림")
 * - typeDescription: 세부 타입 ("예약 신청 알림", "예약 확정", "예약 변경" 등)
 *
 * 라우팅 규칙:
 * - 채팅 알림: /chat/{targetId}
 * - 리뷰 알림: /mypage/reviews
 * - 일정 알림: 리마인더 → /, 변경/취소 → /chat/{targetId}
 * - 예약 알림: typeDescription으로 분기 (예약 신청 알림 → 디자이너, 그 외 → 모델)
 */
export function getNotificationTargetUrl({
  notificationType,
  typeDescription,
  targetId,
  title = '',
}: NotificationRouteParams): string {
  const type = notificationType || '';
  const typeDesc = typeDescription || '';
  const id = targetId?.toString();

  // 1. 채팅 알림
  if (type === '채팅 알림') {
    return id ? `/chat/${id}` : '/chat';
  }

  // 2. 리뷰 알림
  if (type === '리뷰 알림') {
    return '/mypage/reviews';
  }

  // 3. 일정 알림 (SCHEDULE 타입)
  if (type === '일정 알림') {
    // 리마인더: typeDescription이 "예약 알림"이고 title에 "예정" 포함
    if (typeDesc === '예약 알림' && title.includes('예정')) {
      return '/';
    }
    // 일정 변경/취소 알림 → 채팅방
    if (id) {
      return `/chat/${id}`;
    }
    return '/';
  }

  // 4. 예약 알림 (RESERVATION 타입)
  if (type === '예약 알림') {
    // typeDescription으로 직접 분기
    if (typeDesc === '예약 신청 알림' && id) {
      // 디자이너만 받는 알림 → 예약 상세
      return `/reservations/${id}`;
    }

    // 모델이 받는 알림 (예약 확정, 예약 취소) → 예약 목록
    if (typeDesc === '예약 확정' || typeDesc === '예약 취소') {
      return '/mypage/reservations';
    }

    // fallback: userRole 확인
    const userRole = getUserRole();
    if (userRole === 'designer' && id) {
      return `/reservations/${id}`;
    }
    return '/mypage/reservations';
  }

  // 이전 버전 호환 (includes 기반) - 백엔드 완전 배포 전까지 유지
  if (type.includes('채팅')) return id ? `/chat/${id}` : '/chat';
  if (type.includes('리뷰')) return '/mypage/reviews';
  if (type.includes('일정') || type === '예약 변경' || type === '예약 취소') {
    if (title.includes('예정')) return '/';
    return id ? `/chat/${id}` : '/';
  }
  if (type.includes('예약')) {
    const userRole = getUserRole();
    if (userRole === 'designer' && id) return `/reservations/${id}`;
    return '/mypage/reservations';
  }

  return '/notification';
}
