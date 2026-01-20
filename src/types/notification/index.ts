/**
 * 알림(Notification) 관련 타입 정의
 */

/** 알림 타입 (필터용) */
export type NotificationType = 'RESERVATION' | 'CHATTING' | 'REVIEW' | 'SCHEDULE';

/** 알림 아이템 */
export interface NotificationItem {
  notificationId: number;
  /** 알림 타입 (한글, 예: "예약 확정", "새 리뷰") */
  notificationType: string;
  title: string;
  content: string;
  /** 상대 시간 (예: "어제", "2일 전") */
  createdAt: string;
  /** 대상 ID (예약 ID, 채팅방 ID 등) */
  targetId: number;
  isRead: boolean;
}

/** 알림 목록 응답 */
export interface NotificationListResult {
  items: NotificationItem[];
  hasNext: boolean;
  nextCursor: number;
}

/** 알림 설정 */
export interface NotificationSettings {
  chattingNotification: boolean;
  reservationNotification: boolean;
  scheduleNotification: boolean;
  reviewNotification: boolean;
}

/** 안 읽은 알림 응답 */
export interface UnreadNotificationResult {
  unreadCount: number;
}

/** 알림 목록 조회 파라미터 */
export interface NotificationListParams {
  notificationType?: NotificationType;
  cursorId?: number;
  size?: number;
}

/** FCM 토큰 저장 요청 */
export interface SaveFcmTokenRequest {
  fcmToken: string;
}
