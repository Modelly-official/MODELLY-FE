import { axiosInstance } from '../axios';
import type {
  ApiResponse,
  DesignerReviewsResponse,
  DesignerReviewThumbnailsResponse,
  DesignerReviewImagesResponse,
  DesignerReviewDetailResponse,
  ReviewListParams,
} from '@/src/types';

/**
 * 디자이너 리뷰 리스트 조회 (공개)
 * GET /{designerId}/reviews
 */
export async function getPublicDesignerReviews(
  designerId: number,
  params?: ReviewListParams
): Promise<ApiResponse<DesignerReviewsResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerReviewsResponse>>(`/${designerId}/reviews`, {
    params,
  });
  return data;
}

/**
 * 디자이너 리뷰 썸네일 리스트 조회 (공개)
 * GET /{designerId}/reviews/thumbnails
 */
export async function getPublicDesignerReviewThumbnails(
  designerId: number,
  params?: ReviewListParams
): Promise<ApiResponse<DesignerReviewThumbnailsResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerReviewThumbnailsResponse>>(
    `/${designerId}/reviews/thumbnails`,
    { params }
  );
  return data;
}

/**
 * 디자이너 리뷰 이미지 리스트 조회 (공개)
 * GET /{designerId}/reviews/images
 */
export async function getPublicDesignerReviewImages(
  designerId: number,
  params?: ReviewListParams
): Promise<ApiResponse<DesignerReviewImagesResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerReviewImagesResponse>>(
    `/${designerId}/reviews/images`,
    { params }
  );
  return data;
}

/**
 * 리뷰 단건 조회
 * GET /reviews/{reviewId}
 */
export async function getReviewDetail(reviewId: number): Promise<ApiResponse<DesignerReviewDetailResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerReviewDetailResponse>>(`/reviews/${reviewId}`);
  return data;
}
