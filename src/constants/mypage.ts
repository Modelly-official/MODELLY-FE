// 마이페이지 관련 상수

/** 설정 메뉴 항목 */
export const SETTING_LINKS = [
  { label: '알림설정', href: '/mypage/notification-settings' },
  {
    label: '고객센터/FAQ',
    onClick: () =>
      window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLSe3FEUwr9RgbMR8uhBXNklICUJ9089BRAuIDfkPAOxL-cYALQ/viewform',
        '_blank',
        'noopener,noreferrer',
      ),
  },
];

/** 계정 메뉴 항목 */
export const ACCOUNT_LINKS = ['계정 추가하기', '로그아웃', '탈퇴하기'] as const;

/** 카테고리 드롭다운 옵션 */
export const CATEGORY_OPTIONS = [
  { value: '헤어', label: '헤어' },
  { value: '네일', label: '네일' },
  { value: '타투', label: '타투' },
  { value: '속눈썹', label: '속눈썹' },
] as const;

/** 퀵 액션 타입 */
export type QuickActionConfig = {
  label: string;
  iconPath: string;
  href?: string;
};

/** 모델 퀵 액션 */
export const MODEL_QUICK_ACTIONS: QuickActionConfig[] = [
  { label: '예약 내역', iconPath: '/icons/myPage/reservationList.svg', href: '/mypage/reservations' },
  { label: '나의 리뷰', iconPath: '/icons/myPage/review.svg', href: '/mypage/reviews' },
  { label: '찜', iconPath: '/icons/myPage/heart.svg', href: '/mypage/likes' },
];

/** 디자이너 퀵 액션 */
export const DESIGNER_QUICK_ACTIONS: QuickActionConfig[] = [
  { label: '예약 내역', iconPath: '/icons/myPage/reservationList.svg', href: '/mypage/reservations' },
  { label: '리뷰 관리', iconPath: '/icons/myPage/review.svg', href: '/mypage/reviews' },
  { label: '포트폴리오', iconPath: '/icons/myPage/portfolio.svg', href: '/mypage/portfolio' },
];

/** 역할별 기본 폴백 이름 */
export const ROLE_FALLBACK_NAMES = {
  model: '모델',
  designer: '디자이너',
} as const;
