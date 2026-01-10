// 찜(Likes) 관련 타입 정의

import type { Category } from '../recruitment/recruitment';

// ===== 카테고리 필터 =====
export type LikesCategoryFilter = Category | 'ALL';

// ===== 찜한 디자이너 아이템 =====
export interface LikedDesignerItem {
  designerLikeId: number;
  designerId: number;
  designerName: string;
  designerProfileImage?: string;
  designerCategory: string; // "헤어", "네일" 등 한글
  shopName: string;
  shopAddress: string;
}

// ===== 찜한 공고 아이템 =====
export interface LikedRecruitmentItem {
  recruitmentLikeId: number;
  recruitmentId: number;
  thumbnail?: string;
}

// ===== 찜 목록 조회 파라미터 =====
export interface LikedListParams {
  category?: Category;
  cursorId?: number;
  size?: number;
}

// ===== 찜 목록 응답 =====
export interface LikedDesignersResponse {
  items: LikedDesignerItem[];
  hasNext: boolean;
  nextCursor: number | null;
}

export interface LikedRecruitmentsResponse {
  items: LikedRecruitmentItem[];
  hasNext: boolean;
  nextCursor: number | null;
}
