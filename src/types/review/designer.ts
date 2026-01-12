// 디자이너 리뷰 관련 타입 정의

import type { Category } from '../recruitment/recruitment';
import type { ReviewReply } from './common';

// ===== 디자이너 리뷰 아이템 (디자이너가 받은 리뷰) =====
export interface DesignerReviewItem {
  reviewId: number;
  rating: number;
  content: string;
  thumbnail?: string;
  imageUrls?: string[];
  modelName: string;
  modelProfileImageUrl?: string;
  category?: Category;
  isPinned: boolean;
  createdAt: string;
  reply?: ReviewReply;
}

// ===== 디자이너 리뷰 목록 응답 =====
export interface DesignerReviewsResponse {
  items: DesignerReviewItem[];
  hasNext: boolean;
  nextCursor?: number | null;
}

// ===== 답글 작성 요청 =====
export interface CreateReplyRequest {
  content: string;
}

// ===== 답글 작성 응답 =====
export interface CreateReplyResponse {
  replyId: number;
  createdAt: string;
}

// ===== 리뷰 고정/해제 요청 =====
export interface PinReviewRequest {
  reviewId: number;
  isPinned: boolean;
}
