import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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
  listInfinite: (designerId: number, params?: ReviewListParams) =>
    [...publicDesignerReviewKeys.all, 'listInfinite', designerId, params] as const,
  thumbnails: (designerId: number, params?: ReviewListParams) =>
    [...publicDesignerReviewKeys.all, 'thumbnails', designerId, params] as const,
  thumbnailsInfinite: (designerId: number, params?: ReviewListParams) =>
    [...publicDesignerReviewKeys.all, 'thumbnailsInfinite', designerId, params] as const,
};

interface UsePublicDesignerReviewListParams {
  designerId: number;
  params?: ReviewListParams;
  enabled?: boolean;
}

interface ReviewCursor {
  cursorId?: number;
}

interface UsePublicDesignerReviewListInfiniteParams {
  designerId: number;
  params?: Omit<ReviewListParams, 'cursorId'>;
  enabled?: boolean;
}

interface UsePublicDesignerReviewThumbnailsParams {
  designerId: number;
  params?: ReviewListParams;
  enabled?: boolean;
}

interface UsePublicDesignerReviewThumbnailsInfiniteParams {
  designerId: number;
  params?: Omit<ReviewListParams, 'cursorId'>;
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
 * 디자이너 리뷰 리스트 조회 Hook (공개, 무한 스크롤)
 */
export function usePublicDesignerReviewListInfinite({
  designerId,
  params,
  enabled = true,
}: UsePublicDesignerReviewListInfiniteParams) {
  return useInfiniteQuery<
    ApiResponse<DesignerReviewsResponse>,
    Error,
    { pages: ApiResponse<DesignerReviewsResponse>[]; pageParams: ReviewCursor[] },
    ReturnType<typeof publicDesignerReviewKeys.listInfinite>,
    ReviewCursor
  >({
    queryKey: publicDesignerReviewKeys.listInfinite(designerId, params),
    queryFn: async ({ pageParam }) => {
      const apiParams = {
        ...params,
        cursorId: pageParam?.cursorId,
      };
      return getPublicDesignerReviews(designerId, apiParams);
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.result?.hasNext) return undefined;
      return {
        cursorId: lastPage.result.nextCursor ?? undefined,
      };
    },
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

/**
 * 디자이너 리뷰 썸네일 리스트 조회 Hook (공개, 무한 스크롤)
 */
export function usePublicDesignerReviewThumbnailsInfinite({
  designerId,
  params,
  enabled = true,
}: UsePublicDesignerReviewThumbnailsInfiniteParams) {
  return useInfiniteQuery<
    ApiResponse<DesignerReviewThumbnailsResponse>,
    Error,
    { pages: ApiResponse<DesignerReviewThumbnailsResponse>[]; pageParams: ReviewCursor[] },
    ReturnType<typeof publicDesignerReviewKeys.thumbnailsInfinite>,
    ReviewCursor
  >({
    queryKey: publicDesignerReviewKeys.thumbnailsInfinite(designerId, params),
    queryFn: async ({ pageParam }) => {
      const apiParams = {
        ...params,
        cursorId: pageParam?.cursorId,
      };
      return getPublicDesignerReviewThumbnails(designerId, apiParams);
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.result?.hasNext) return undefined;
      return {
        cursorId: lastPage.result.nextCursor ?? undefined,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}
