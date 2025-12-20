/**
 * 소셜 로그인 OAuth URL 생성
 * 환경에 따라 자동으로 적절한 URL 사용
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const SOCIAL_LOGIN_URLS = {
  kakao: `https://kauth.kakao.com/oauth/authorize?client_id=e12e503a20ad8ad42c90dfb6d28f0b89&redirect_uri=${BASE_URL}/api/auth/kakao/login&response_type=code`,
  naver: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=5WFnAWIid2yGkX7wDJx4&state=ahepffl&redirect_uri=${BASE_URL}/api/auth/naver/login`,
  google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=215121347036-5585coman45tmb2p2pi49alikgmib35f.apps.googleusercontent.com&redirect_uri=${BASE_URL}/api/auth/google/login&response_type=code&scope=openid%20email%20profile&access_type=offline`,
} as const;

export type SocialProvider = keyof typeof SOCIAL_LOGIN_URLS;
