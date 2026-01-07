import type { ApiResponse } from '@/src/types/common';

export type GenderCode = 'MALE' | 'FEMALE';

// 모델 마이페이지 프로필 조회 응답
export interface MypageModelProfile {
  modelId: number;
  nickname: string;
  gender: string; // 예: "여자"
  birth: string; // YYYY-MM-DD
  email: string;
  profileImageUrl: string | null;
}

// 디자이너 마이페이지 프로필 조회 응답
export interface MypageDesignerProfile {
  designerId: number;
  nickname: string;
  gender: string; // 예: "여자"
  birth: string; // YYYY-MM-DD
  email: string;
  intro: string;
  shop: string;
  address: {
    line1: string;
    line2: string;
  };
  category: string; // 예: "헤어"
  profileImageUrl: string | null;
}

// 업데이트 요청 타입
export interface MypageModelProfileUpdateRequest {
  nickname: string;
  gender: GenderCode;
  birth: string; // YYYY-MM-DD
  profileImageUrl?: string | null;
}

export interface MypageDesignerProfileUpdateRequest extends MypageModelProfileUpdateRequest {
  intro: string;
  shop: string;
  addressLine1: string;
  addressLine2: string;
  category: 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH';
}

// 공통 API 응답 래퍼
export type MypageModelProfileResponse = ApiResponse<MypageModelProfile>;
export type MypageDesignerProfileResponse = ApiResponse<MypageDesignerProfile>;
