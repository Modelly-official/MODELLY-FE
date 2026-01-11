// 리뷰(Review) 관련 타입 정의

import type { Category, SubCategory } from '../recruitment/recruitment';

// ===== 카테고리 필터 =====
export type ReviewCategoryFilter = Category | 'ALL';

// ===== 리뷰 탭 타입 =====
export type ReviewTabType = 'unreviewed' | 'written';

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

// ===== 리뷰 답글 =====
export interface ReviewReply {
  replyId: number;
  content: string;
  createdAt: string;
}

// ===== 작성한 리뷰 아이템 =====
export interface WrittenReviewItem {
  reviewId: number;
  rating: number;
  content: string;
  thumbnail?: string;
  imageUrls?: string[];
  designerName: string;
  designerProfileImageUrl?: string;
  category: Category;
  subCategories?: SubCategory[];
  shopName?: string;
  createdAt: string;
  reply?: ReviewReply;
}

// ===== 리뷰 목록 조회 파라미터 =====
export interface ReviewListParams {
  category?: Category;
  cursorId?: number;
  size?: number;
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
}

// ===== 리뷰 작성 요청 =====
export interface CreateReviewRequest {
  rating: number;
  content: string;
  imageUrls?: string[];
}

// ===== 리뷰 작성 응답 =====
export interface CreateReviewResponse {
  reviewId: number;
  createdAt: string;
}

// ===== Presigned URL 응답 (리뷰 이미지) =====
export interface ReviewPresignedUrlItem {
  uploadUrl: string;
  imageUrl: string;
}

export interface ReviewPresignedUrlsResponse {
  folderId: string;
  presignedUrls: ReviewPresignedUrlItem[];
  thumbnailUrl: string;
}
