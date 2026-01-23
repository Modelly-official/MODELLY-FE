// 디자이너 리뷰 관련 타입 정의

// ===== 디자이너 리뷰 답글 =====
export interface DesignerReviewReply {
  replyId: number;
  content: string;
  createdAt: string;
  designerName: string;
}

// ===== 디자이너 리뷰 아이템 (디자이너가 받은 리뷰) =====
export interface DesignerReviewItem {
  reviewId: number;
  modelImage: string;
  modelName: string;
  rating: number;
  createdDate: string;
  isFixed: boolean;
  content: string;
  reviewImages: string[];
  summary: string;
  isMine?: boolean;
  replyDto?: DesignerReviewReply;
}

// ===== 디자이너 리뷰 목록 응답 =====
export interface DesignerReviewsResponse {
  items: DesignerReviewItem[];
  hasNext: boolean;
  nextCursor?: number | null;
  totalCount?: number;
}

// ===== 디자이너 리뷰 썸네일 아이템 =====
export interface DesignerReviewThumbnailItem {
  reviewId: number;
  reviewThumbnail: string;
  isFixed: boolean;
}

// ===== 디자이너 리뷰 썸네일 목록 응답 =====
export interface DesignerReviewThumbnailsResponse {
  items: DesignerReviewThumbnailItem[];
  hasNext: boolean;
  nextCursor?: number | null;
  totalCount: number;
}

// ===== 디자이너 리뷰 상세 응답 =====
export interface DesignerReviewDetailResponse {
  reviewId: number;
  rating: number;
  content: string;
  summary: string;
  thumbnail: string;
  imageUrls: string[];
  isMine: boolean;
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
  isFixed: boolean;
}
