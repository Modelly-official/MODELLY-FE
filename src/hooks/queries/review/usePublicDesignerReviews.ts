import { useQuery } from '@tanstack/react-query';
import { getPublicDesignerReviews, getPublicDesignerReviewThumbnails } from '@/src/apis';
import type {
  ApiResponse,
  DesignerReviewsResponse,
  DesignerReviewThumbnailsResponse,
  ReviewListParams,
} from '@/src/types';

export const publicDesignerReviewKeys = {
  all: ['publicDesignerReviews'] as const,
  list: (designerId: number, params?: ReviewListParams) =>
    [...publicDesignerReviewKeys.all, 'list', designerId, params] as const,
  thumbnails: (designerId: number, params?: ReviewListParams) =>
    [...publicDesignerReviewKeys.all, 'thumbnails', designerId, params] as const,
};

interface UsePublicDesignerReviewListParams {
  designerId: number;
  params?: ReviewListParams;
  enabled?: boolean;
}

interface UsePublicDesignerReviewThumbnailsParams {
  designerId: number;
  params?: ReviewListParams;
  enabled?: boolean;
}

/**
 * 디자이너 리뷰 리스트 조회 Hook (공개)
 */
export function usePublicDesignerReviewList({
  designerId,
  params,
  enabled = true,
}: UsePublicDesignerReviewListParams) {
  return useQuery<ApiResponse<DesignerReviewsResponse>, Error>({
    queryKey: publicDesignerReviewKeys.list(designerId, params),
    queryFn: () => getPublicDesignerReviews(designerId, params),
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * 디자이너 리뷰 썸네일 리스트 조회 Hook (공개)
 */
export function usePublicDesignerReviewThumbnails({
  designerId,
  params,
  enabled = true,
}: UsePublicDesignerReviewThumbnailsParams) {
  return useQuery<ApiResponse<DesignerReviewThumbnailsResponse>, Error>({
    queryKey: publicDesignerReviewKeys.thumbnails(designerId, params),
    queryFn: () => getPublicDesignerReviewThumbnails(designerId, params),
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}
