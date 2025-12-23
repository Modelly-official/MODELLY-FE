// 라우트 설정

// ===== 공개 라우트 (로그인 없이 접근 가능) =====
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/find-id',
  '/find-password',
  '/auth/callback',
  // 모델 공개 페이지
  '/explore', // 모델 탐색(공고)
  '/home', // (예정) 모델 홈 - 추후 구현 시 /explore로 redirect
  '/map', // 지도
  // 공통 공개 페이지
  '/post', // 공고 상세
  '/designer', // 디자이너 프로필
  '/terms',
  '/privacy',
  '/faq',
];

// ===== 모델 전용 라우트 =====
export const MODEL_ONLY_ROUTES = [
  '/favorites', // 찜 목록
  '/model/chat', // 모델 채팅
  '/model/mypage', // 모델 마이페이지
];

// ===== 디자이너 전용 라우트 =====
export const DESIGNER_ONLY_ROUTES = [
  '/designer/home', // 디자이너 홈
  '/designer/posts', // 내 공고
  '/designer/calendar', // 캘린더
  '/designer/chat', // 디자이너 채팅
  '/designer/mypage', // 디자이너 마이페이지
];

// ===== 인증된 사용자 공통 라우트 =====
export const AUTHENTICATED_ROUTES = [
  '/chat', // 채팅 (공통)
  '/reservation', // 예약 관련
];
