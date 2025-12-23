// 회원가입 관련 상수

export const SIGNUP_ROLES = [
  { key: 'designer', label: '디자이너' },
  { key: 'model', label: '모델' },
] as const;

export const SIGNUP_STEPS = {
  SOCIAL: 3,
  REGULAR: 5,
} as const;

export const SIGNUP_MESSAGES = {
  TERMS: {
    TITLE_1: '반가워요! 가입하려면',
    TITLE_2: '약관에 동의가 필요해요',
    ALL_AGREE: '약관 전체 동의',
  },
  ROLE: {
    TITLE_1: '어떤 역할로',
    TITLE_2: 'Monde를 이용하시겠어요?',
  },
  BASIC_INFO: {
    TITLE_1: '반가워요!',
    TITLE_2: '기본 정보를 입력해주세요',
  },
  LOGIN_INFO: {
    TITLE_1: '로그인에 사용할',
    TITLE_2: '정보를 입력해주세요',
  },
  PROFILE_INFO: {
    TITLE_1: 'Monde에서 사용할',
    TITLE_2: '프로필 정보를 입력해주세요',
  },
  COMPLETE: {
    TITLE: '회원가입이 완료되었어요!',
    BUTTON: '시작하기',
  },
  BUTTON: {
    NEXT: '다음',
  },
} as const;

export const AUTH_CODE = {
  MOCK_CODE: '1234',
  MIN_PHONE_LENGTH: 10,
} as const;
