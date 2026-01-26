/** localStorage/sessionStorage 키 */
export const NOTIFICATION_STORAGE_KEYS = {
  /** 앱 모달에서 거부 여부 (localStorage) */
  PROMPT_DISMISSED: 'notification_prompt_dismissed',
  /** FCM 토큰 등록 여부 (sessionStorage) */
  TOKEN_REGISTERED: 'fcm_token_registered',
} as const;

/** 권한 상태별 안내 메시지 */
export const PERMISSION_MESSAGES = {
  not_supported: 'iOS에서 알림을 받으려면 홈 화면에 앱을 추가해주세요.',
  browser_denied_pwa: '기기 설정에서 알림을 허용해주세요.',
  browser_denied_web: '브라우저 설정에서 알림을 허용해주세요.',
  app_dismissed: '알림이 비활성화되어 있습니다.',
} as const;

/**
 * 알림 타입별 라우팅 경로
 * - 'chat': 채팅 페이지 (/chat/{targetId})
 * - 'reservation': 예약 상세 페이지 (/reservations/{targetId})
 * - 나머지: 해당 경로로 직접 이동
 */
export const NOTIFICATION_ROUTES: Record<string, string> = {
  // CHATTING
  '채팅 알림': 'chat',
  // RESERVATION
  '예약 확정': '/mypage/reservations',
  '예약 취소': '/mypage/reservations',
  '예약 신청 알림': 'reservation', // DESIGNER → /reservations/{targetId}
  // SCHEDULE
  '예약 변경': 'chat', // targetId = 채팅방 id
  '예약 알림': '/mypage/reservations',
  // REVIEW
  '리뷰 알림': '/mypage/reviews',
  '리뷰 답글 알림': '/mypage/reviews',
};
