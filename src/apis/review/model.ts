import { axiosInstance } from '../axios';
import { uploadImageToS3 } from '../auth/profile';
import type {
  ApiResponse,
  UnreviewedReservationsResponse,
  WrittenReviewsResponse,
  ReviewListParams,
  UnreviewedListParams,
  CreateReviewRequest,
  CreateReviewResponse,
  ReviewPresignedUrlsResponse,
  ReviewImageUploadResult,
} from '@/src/types';

/**
 * 리뷰 미작성 예약 목록 조회
 * GET /models/reservations/unreviewed
 * 인증 필요
 */
export async function getUnreviewedReservations(
  params?: UnreviewedListParams
): Promise<ApiResponse<UnreviewedReservationsResponse>> {
  const { data } = await axiosInstance.get<
    ApiResponse<UnreviewedReservationsResponse>
  >('/models/reservations/unreviewed', { params });
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

/**
 * 리뷰 이미지 업로드 (Presigned URL 발급 + S3 업로드)
 * @param reservationId - 예약 ID
 * @param files - 업로드할 이미지 파일 배열
 * @returns 업로드 결과 (thumbnail, imageUrls, imageFolderId)
 */
export async function uploadReviewImages(
  reservationId: number,
  files: File[]
): Promise<ReviewImageUploadResult | null> {
  if (files.length === 0) return null;

  // 1. Presigned URL 발급
  const presignedResponse = await getReviewPresignedUrls(reservationId, files.length);

  if (!presignedResponse.isSuccess || !presignedResponse.result) {
    throw new Error(presignedResponse.message || '이미지 업로드 URL을 가져오지 못했습니다.');
  }

  const { folderId, presignedUrls, thumbnailUrl } = presignedResponse.result;

  // 2. S3에 병렬 업로드
  await Promise.all(
    files.map((file, index) => uploadImageToS3(presignedUrls[index].uploadUrl, file))
  );

  // 3. 결과 반환
  return {
    thumbnail: thumbnailUrl,
    imageUrls: presignedUrls.map((item) => item.imageUrl),
    imageFolderId: folderId,
  };
}
