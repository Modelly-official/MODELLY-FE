// 리뷰 공통 타입 정의

import type { Category } from '../recruitment/recruitment';

// ===== 카테고리 필터 =====
export type ReviewCategoryFilter = Category | 'ALL';

// ===== 리뷰 탭 타입 =====
export type ReviewTabType = 'unreviewed' | 'written';

// ===== 리뷰 답글 =====
export interface ReviewReply {
  replyId: number;
  content: string;
  createdAt: string;
}

// ===== 리뷰 목록 조회 파라미터 (공통) =====
export interface ReviewListParams {
  category?: Category | string;
  cursorId?: number;
  size?: number;
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

// ===== 리뷰 이미지 업로드 결과 =====
export interface ReviewImageUploadResult {
  thumbnail: string;
  imageUrls: string[];
  imageFolderId: string;
}
