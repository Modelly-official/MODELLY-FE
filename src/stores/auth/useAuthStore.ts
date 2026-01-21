import { create } from 'zustand';

import { categoryNameToCode } from '@/src/utils/myRecruitment';
import type { Category } from '@/src/types/recruitment';

interface User {
  userId: number;
  role: 'model' | 'designer';
  username: string;
  loginId: string;
  category?: Category; // 디자이너 카테고리 (HAIR, NAIL, TATTOO, EYELASH)
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearAuth: () => {
    // 쿠키 삭제 (accessToken + userRole + userCategory)
    if (typeof document !== 'undefined') {
      document.cookie = 'access_token=; path=/; max-age=0';
      document.cookie = 'user_role=; path=/; max-age=0';
      document.cookie = 'user_category=; path=/; max-age=0';
    }
    set({ user: null, isAuthenticated: false });
  },
}));

// 쿠키에서 accessToken 읽는 헬퍼 함수
export const getAccessToken = (): string | null => {
  if (typeof document === 'undefined') return null;

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('access_token='))
    ?.split('=')[1];

  return token || null;
};

// 쿠키에 accessToken 저장하는 헬퍼 함수
export const setAccessToken = (token: string) => {
  if (typeof document === 'undefined') return;

  document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
};

// 쿠키에서 userRole 읽는 헬퍼 함수
export const getUserRole = (): 'model' | 'designer' | null => {
  if (typeof document === 'undefined') return null;
  const rawRole = document.cookie
    .split('; ')
    .find((row) => row.startsWith('user_role='))
    ?.split('=')[1];
  if (!rawRole) return null;
  const role = decodeURIComponent(rawRole);

  // 영문 소문자 (정상 케이스)
  if (role === 'designer' || role === 'model') {
    return role;
  }
  // 한글 (하위 호환성)
  if (role === '디자이너') return 'designer';
  if (role === '모델') return 'model';
  // 대문자 (하위 호환성)
  const lowerRole = role.toLowerCase();
  if (lowerRole === 'designer' || lowerRole === 'model') {
    return lowerRole as 'model' | 'designer';
  }

  return null;
};

// 쿠키에 userRole 저장하는 헬퍼 함수
export const setUserRole = (role: 'model' | 'designer' | string) => {
  if (typeof document === 'undefined') return;

  // 한글이나 대문자가 들어와도 영문 소문자로 정규화
  let normalizedRole: 'model' | 'designer';

  const lowerRole = role.toLowerCase();
  if (lowerRole === 'model' || role === '모델') {
    normalizedRole = 'model';
  } else if (lowerRole === 'designer' || role === '디자이너') {
    normalizedRole = 'designer';
  } else {
    console.error('Invalid role:', role);
    return;
  }

  document.cookie = `user_role=${normalizedRole}; path=/; max-age=604800; SameSite=Lax${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
};

// 쿠키에서 userCategory 읽는 헬퍼 함수
export const getUserCategory = (): Category | null => {
  if (typeof document === 'undefined') return null;

  const rawCategory = document.cookie
    .split('; ')
    .find((row) => row.startsWith('user_category='))
    ?.split('=')[1];

  if (!rawCategory) return null;

  const category = decodeURIComponent(rawCategory) as Category;

  // 유효한 카테고리인지 확인
  if (['HAIR', 'NAIL', 'TATTOO', 'EYELASH'].includes(category)) {
    return category;
  }

  return null;
};

// 쿠키에 userCategory 저장하는 헬퍼 함수
export const setUserCategory = (category: Category | string) => {
  if (typeof document === 'undefined') return;

  // 한글이나 대문자가 들어와도 영문 코드로 정규화
  const normalizedCategory = categoryNameToCode(category);

  if (!normalizedCategory) {
    console.error('Invalid category:', category);
    return;
  }

  document.cookie = `user_category=${normalizedCategory}; path=/; max-age=604800; SameSite=Lax${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
};
