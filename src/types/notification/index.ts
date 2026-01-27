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

/** 유효 권한 상태 (브라우저 권한 + 앱 상태 + 플랫폼 통합) */
export type EffectivePermissionState =
  | 'not_supported' // iOS Safari (PWA 미설치) 또는 Notification API 미지원
  | 'browser_denied' // 브라우저에서 권한 거부
  | 'app_dismissed' // 앱 모달에서 거부/취소
  | 'granted' // 권한 허용됨
  | 'prompt_needed'; // 권한 요청 필요 (모달 표시)

/** 권한 상태별 UI 설정 */
export interface PermissionUIConfig {
  /** 토글 비활성화 여부 */
  disabled: boolean;
  /** 안내 메시지 (null이면 표시 안 함) */
  message: string | null;
  /** iOS PWA 설치 가이드 표시 */
  showInstallGuide?: boolean;
  /** "다시 활성화" 버튼 표시 */
  showResetButton?: boolean;
  /** 권한 요청 모달 표시 */
  showModal?: boolean;
}
