import { create } from "zustand";

interface User {
  userId: number;
  role: "model" | "designer";
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
    // 쿠키 삭제
    if (typeof document !== "undefined") {
      document.cookie = "access_token=; path=/; max-age=0";
    }
    set({ user: null, isAuthenticated: false });
  },
}));

// 쿠키에서 accessToken 읽는 헬퍼 함수
export const getAccessToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  return token || null;
};

// 쿠키에 accessToken 저장하는 헬퍼 함수
export const setAccessToken = (token: string) => {
  if (typeof document === "undefined") return;
  
  document.cookie = `access_token=${token}; path=/; max-age=3600; SameSite=Lax${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
};
