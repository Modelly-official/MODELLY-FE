import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getPublicDesignerReviews,
  getPublicDesignerReviewThumbnails,
  getPublicDesignerReviewImages,
} from '@/src/apis';
import type {
  ApiResponse,
  DesignerReviewsResponse,
  DesignerReviewThumbnailsResponse,
  DesignerReviewImagesResponse,
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
  images: (designerId: number, params?: ReviewListParams) =>
    [...publicDesignerReviewKeys.all, 'images', designerId, params] as const,
  imagesInfinite: (designerId: number, params?: ReviewListParams) =>
    [...publicDesignerReviewKeys.all, 'imagesInfinite', designerId, params] as const,
};

interface UsePublicDesignerReviewListParams {
  designerId: number;
  params?: ReviewListParams;
  enabled?: boolean;
}

interface ReviewCursor {
  cursorId?: number;
}

interface ReviewListCursor {
  cursorId?: number;
  cursorIsFixed?: boolean;
}

interface UsePublicDesignerReviewListInfiniteParams {
  designerId: number;
  params?: Omit<ReviewListParams, 'cursorId' | 'cursorIsFixed'>;
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

interface UsePublicDesignerReviewImagesParams {
  designerId: number;
  params?: ReviewListParams;
  enabled?: boolean;
}

interface UsePublicDesignerReviewImagesInfiniteParams {
  designerId: number;
  params?: Omit<ReviewListParams, 'cursorId' | 'cursorIsFixed'>;
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
    { pages: ApiResponse<DesignerReviewsResponse>[]; pageParams: ReviewListCursor[] },
    ReturnType<typeof publicDesignerReviewKeys.listInfinite>,
    ReviewListCursor
  >({
    queryKey: publicDesignerReviewKeys.listInfinite(designerId, params),
    queryFn: async ({ pageParam }) => {
      const apiParams = {
        ...params,
        cursorId: pageParam?.cursorId,
        cursorIsFixed: pageParam?.cursorIsFixed,
      };
      return getPublicDesignerReviews(designerId, apiParams);
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.result?.hasNext) return undefined;
      return {
        cursorId: lastPage.result.nextCursor ?? undefined,
        cursorIsFixed: lastPage.result.nextCursorFixed ?? undefined,
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

/**
 * 디자이너 리뷰 이미지 리스트 조회 Hook (공개)
 */
export function usePublicDesignerReviewImages({
  designerId,
  params,
  enabled = true,
}: UsePublicDesignerReviewImagesParams) {
  return useQuery<ApiResponse<DesignerReviewImagesResponse>, Error>({
    queryKey: publicDesignerReviewKeys.images(designerId, params),
    queryFn: () => getPublicDesignerReviewImages(designerId, params),
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * 디자이너 리뷰 이미지 리스트 조회 Hook (공개, 무한 스크롤)
 */
export function usePublicDesignerReviewImagesInfinite({
  designerId,
  params,
  enabled = true,
}: UsePublicDesignerReviewImagesInfiniteParams) {
  return useInfiniteQuery<
    ApiResponse<DesignerReviewImagesResponse>,
    Error,
    { pages: ApiResponse<DesignerReviewImagesResponse>[]; pageParams: ReviewListCursor[] },
    ReturnType<typeof publicDesignerReviewKeys.imagesInfinite>,
    ReviewListCursor
  >({
    queryKey: publicDesignerReviewKeys.imagesInfinite(designerId, params),
    queryFn: async ({ pageParam }) => {
      const apiParams = {
        ...params,
        cursorId: pageParam?.cursorId,
        cursorIsFixed: pageParam?.cursorIsFixed,
      };
      return getPublicDesignerReviewImages(designerId, apiParams);
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.result?.hasNext) return undefined;
      return {
        cursorId: lastPage.result.nextCursor ?? undefined,
        cursorIsFixed: lastPage.result.nextCursorFixed ?? undefined,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}
