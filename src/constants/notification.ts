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
