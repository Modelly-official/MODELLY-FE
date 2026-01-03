// 라우트 설정

// ===== 공개 라우트 (로그인 없이 접근 가능) =====
// 비로그인 사용자도 접근 가능하며, 로그인 필요 기능은 모달로 제어
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/find-id',
  '/find-password',
  '/auth/callback',
  // 모델 공개 페이지 (비로그인도 접근 가능, 제한 기능은 모달로 제어)
  '/explore', // 탐색 - 리스트 확인 가능, 공고 클릭 시 모달
  '/map', // 지도 - 리스트 확인 가능, 공고 클릭 시 모달
  '/chat', // 채팅 - 비로그인 시 모달 표시
  '/mypage', // 마이페이지 - 비로그인 시 블러+모달 표시
  '/post', // 공고 상세
];

// ===== 모델 전용 라우트 =====
export const MODEL_ONLY_ROUTES: string[] = [
  '/reservation', // 예약
];

// ===== 디자이너 전용 라우트 =====
export const DESIGNER_ONLY_ROUTES = [
  '/myRecruitment', // 내 공고 관리 (목록, 생성, 수정, 상세)
];

// ===== 인증된 사용자 공통 라우트 =====
export const AUTHENTICATED_ROUTES: string[] = [
  // 추후 인증 필요 공통 페이지 추가 시 사용
];
