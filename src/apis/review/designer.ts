import { axiosInstance } from '../axios';
import type {
  ApiResponse,
  DesignerReviewsResponse,
  ReviewListParams,
  CreateReplyRequest,
  CreateReplyResponse,
  PinReviewRequest,
} from '@/src/types';

/**
 * 디자이너가 받은 리뷰 목록 조회
 * GET /designers/reviews
 * 인증 필요
 */
export async function getDesignerReviews(
  params?: ReviewListParams
): Promise<ApiResponse<DesignerReviewsResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerReviewsResponse>>(
    '/designers/reviews',
    { params }
  );
  return data;
}

/**
 * 답글 작성
 * POST /designers/reviews/{reviewId}
 * 인증 필요
 */
export async function createReply(
  reviewId: number,
  replyData: CreateReplyRequest
): Promise<ApiResponse<CreateReplyResponse>> {
  const { data } = await axiosInstance.post<ApiResponse<CreateReplyResponse>>(
    `/designers/reviews/${reviewId}`,
    replyData
  );
  return data;
}

/**
 * 답글 수정
 * PUT /designers/replies/{replyId}
 * 인증 필요
 */
export async function updateReply(
  replyId: number,
  replyData: CreateReplyRequest
): Promise<ApiResponse<void>> {
  const { data } = await axiosInstance.put<ApiResponse<void>>(
    `/designers/replies/${replyId}`,
    replyData
  );
  return data;
}

/**
 * 리뷰 고정/해제
 * PATCH /designers/reviews
 * 인증 필요
 */
export async function pinReview(
  pinData: PinReviewRequest
): Promise<ApiResponse<void>> {
  const { data } = await axiosInstance.patch<ApiResponse<void>>(
    '/designers/reviews',
    pinData
  );
  return data;
}
