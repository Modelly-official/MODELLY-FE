// 라우트 설정

// 로그인 안해도 접속 가능 경로
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth/callback', // 소셜 로그인 콜백
  '/chat',
];

// 로그인 후 모델만 접속 가능 경로 (임시로 넣어둠)
export const MODEL_ONLY_ROUTES = ['/model'];

// 로그인 후 디자이너만 접속 가능 경로 (임시로 넣어둠)
export const DESIGNER_ONLY_ROUTES = ['/designer'];

// 로그인 후, 디자이너나 모델 둘 다 접속 가능 경로
export const AUTHENTICATED_ROUTES = ['/messages'];
