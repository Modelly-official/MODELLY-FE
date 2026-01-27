// 모델 리뷰 관련 타입 정의

import type { Category, SubCategory } from '../recruitment/recruitment';

// ===== 리뷰 미작성 예약 아이템 (API 응답) =====
export interface UnreviewedReservation {
  reservationId: number;
  recruitmentId: number;
  recruitmentTitle: string;
  designerUserId: number;
  designerId: number;
  designerNickname: string;
  shop: string;
  category: Category;
  subCategories: SubCategory[];
  date: string; // yyyy-MM-dd
  startTime: string;
}

// ===== 작성한 리뷰 아이템 =====
export interface WrittenReviewItem {
  reviewId: number;
  reservationId: number;
  rating: number;
  content: string;
  thumbnail?: string;
  imageList?: string[];
  designerName: string;
  shop?: string;
  shopAddress?: string;
  summary?: string; // 카테고리 요약 (예: "파마", "염색", "커트")
  createdAt: string;
}

// ===== 리뷰 미작성 예약 목록 조회 파라미터 =====
export interface UnreviewedListParams {
  month?: string; // yyyy-MM
  category?: Category | string;
  size?: number;
  cursorDate?: string;
  cursorTime?: string;
  cursorId?: number;
}

// ===== 리뷰 미작성 목록 응답 =====
export interface UnreviewedReservationsResponse {
  items: UnreviewedReservation[];
  hasNext: boolean;
  totalCount: number;
  nextCursorId: number | null;
  nextCursorDate: string | null;
  nextCursorTime: string | null;
}

// ===== 작성한 리뷰 목록 응답 =====
export interface WrittenReviewsResponse {
  items: WrittenReviewItem[];
  hasNext: boolean;
  nextCursor: number | null;
  totalCount: number;
}

// ===== 리뷰 작성 요청 =====
export interface CreateReviewRequest {
  rating: number;
  content: string;
  thumbnail?: string;
  imageUrlList?: string[];
  imageFolderId?: string;
}

// ===== 리뷰 작성 응답 =====
export interface CreateReviewResponse {
  reviewId: number;
  createdAt: string;
}
