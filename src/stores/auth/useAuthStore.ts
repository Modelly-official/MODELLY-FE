import { create } from 'zustand';

interface User {
  userId: number;
  role: 'model' | 'designer';
  username: string;
  loginId: string;
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
    // 쿠키 삭제 (accessToken + userRole)
    if (typeof document !== 'undefined') {
      document.cookie = 'access_token=; path=/; max-age=0';
      document.cookie = 'user_role=; path=/; max-age=0';
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

  document.cookie = `access_token=${token}; path=/; max-age=3600; SameSite=Lax${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
};

// 쿠키에서 userRole 읽는 헬퍼 함수
export const getUserRole = (): 'model' | 'designer' | null => {
  if (typeof document === 'undefined') return null;

  const findCookie = (name: string) =>
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];

  const raw =
    findCookie('user_role') ??
    findCookie('userRole') ?? // 백엔드/프론트 명칭 혼합 대비
    undefined;

  if (!raw) return null;

  const decoded = decodeURIComponent(raw);
  const normalized = decoded.toLowerCase();

  // 다국어 표기 대응
  if (normalized === 'designer' || normalized === '디자이너') return 'designer';
  if (normalized === 'model' || normalized === '모델') return 'model';

  return null;
};

// 쿠키에 userRole 저장하는 헬퍼 함수
export const setUserRole = (role: 'model' | 'designer') => {
  if (typeof document === 'undefined') return;

  document.cookie = `user_role=${role}; path=/; max-age=3600; SameSite=Lax${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`;
};
