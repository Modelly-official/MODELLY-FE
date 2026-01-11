import { axiosInstance } from '../axios';
import type {
  ApiResponse,
  UnreviewedReservationsResponse,
  WrittenReviewsResponse,
  ReviewListParams,
  CreateReviewRequest,
  CreateReviewResponse,
  ReviewPresignedUrlsResponse,
} from '@/src/types';

/**
 * 리뷰 미작성 예약 목록 조회
 * GET /models/reservations/unreviewed
 * 인증 필요
 */
export async function getUnreviewedReservations(): Promise<
  ApiResponse<UnreviewedReservationsResponse>
> {
  const { data } = await axiosInstance.get<
    ApiResponse<UnreviewedReservationsResponse>
  >('/models/reservations/unreviewed');
  return data;
}

/**
 * 작성한 리뷰 목록 조회 (페이지네이션)
 * GET /models/reviews
 * 인증 필요
 */
export async function getWrittenReviews(
  params?: ReviewListParams
): Promise<ApiResponse<WrittenReviewsResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<WrittenReviewsResponse>>(
    '/models/reviews',
    { params }
  );
  return data;
}

/**
 * 리뷰 작성
 * POST /models/reviews/{reservationId}
 * 인증 필요
 */
export async function createReview(
  reservationId: number,
  reviewData: CreateReviewRequest
): Promise<ApiResponse<CreateReviewResponse>> {
  const { data } = await axiosInstance.post<ApiResponse<CreateReviewResponse>>(
    `/models/reviews/${reservationId}`,
    reviewData
  );
  return data;
}

/**
 * 리뷰 수정
 * PUT /models/reviews/{reviewId}
 * 인증 필요
 */
export async function updateReview(
  reviewId: number,
  reviewData: CreateReviewRequest
): Promise<ApiResponse<void>> {
  const { data } = await axiosInstance.put<ApiResponse<void>>(
    `/models/reviews/${reviewId}`,
    reviewData
  );
  return data;
}

/**
 * 리뷰 삭제
 * DELETE /models/reviews/{reviewId}
 * 인증 필요
 */
export async function deleteReview(reviewId: number): Promise<ApiResponse<void>> {
  const { data } = await axiosInstance.delete<ApiResponse<void>>(
    `/models/reviews/${reviewId}`
  );
  return data;
}

/**
 * 리뷰 이미지 Presigned URL 발급
 * GET /presigned-url/reviews?reservationId=N&imageCount=N
 * 인증 필요
 */
export async function getReviewPresignedUrls(
  reservationId: number,
  imageCount: number = 1
): Promise<ApiResponse<ReviewPresignedUrlsResponse>> {
  const { data } = await axiosInstance.get<
    ApiResponse<ReviewPresignedUrlsResponse>
  >('/presigned-url/reviews', { params: { reservationId, imageCount } });
  return data;
}
