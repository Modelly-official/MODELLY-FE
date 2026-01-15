import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getUnreviewedReservations,
  getWrittenReviews,
  createReview,
  updateReview,
  deleteReview,
} from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import type {
  ApiResponse,
  Category,
  UnreviewedReservationsResponse,
  WrittenReviewsResponse,
  ReviewListParams,
  UnreviewedListParams,
  CreateReviewRequest,
  CreateReviewResponse,
} from '@/src/types';

// Query Keys
export const reviewKeys = {
  all: ['reviews'] as const,
  unreviewed: (params?: { category?: Category }) =>
    [...reviewKeys.all, 'unreviewed', params] as const,
  written: (params?: ReviewListParams) =>
    [...reviewKeys.all, 'written', params] as const,
};

// 커서 타입
interface ReviewCursor {
  cursorId?: number;
}

interface UnreviewedCursor {
  cursorDate?: string;
  cursorTime?: string;
  cursorId?: number;
}

interface UseReviewsOptions {
  enabled?: boolean;
}

interface UseUnreviewedParams {
  category?: Category;
}

/**
 * 리뷰 미작성 예약 목록 조회 Hook (무한 스크롤)
 */
export function useUnreviewedReservations(
  params?: UseUnreviewedParams,
  options: UseReviewsOptions = {}
) {
  const { enabled = true } = options;

  return useInfiniteQuery<
    ApiResponse<UnreviewedReservationsResponse>,
    Error,
    { pages: ApiResponse<UnreviewedReservationsResponse>[]; pageParams: UnreviewedCursor[] },
    ReturnType<typeof reviewKeys.unreviewed>,
    UnreviewedCursor
  >({
    queryKey: reviewKeys.unreviewed(params),
    queryFn: async ({ pageParam }) => {
      // 영문 카테고리 코드 그대로 전달
      const apiParams: UnreviewedListParams = {
        ...pageParam,
        category: params?.category,
      };
      return getUnreviewedReservations(apiParams);
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.result?.hasNext) return undefined;
      return {
        cursorDate: lastPage.result.nextCursorDate ?? undefined,
        cursorTime: lastPage.result.nextCursorTime ?? undefined,
        cursorId: lastPage.result.nextCursorId ?? undefined,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * 작성한 리뷰 목록 조회 Hook (무한 스크롤)
 */
export function useWrittenReviews(
  params?: Omit<ReviewListParams, 'cursorId'>,
  options: UseReviewsOptions = {}
) {
  const { enabled = true } = options;

  return useInfiniteQuery<
    ApiResponse<WrittenReviewsResponse>,
    Error,
    { pages: ApiResponse<WrittenReviewsResponse>[]; pageParams: ReviewCursor[] },
    ReturnType<typeof reviewKeys.written>,
    ReviewCursor
  >({
    queryKey: reviewKeys.written(params),
    queryFn: async ({ pageParam }) => {
      // 영문 카테고리 코드 그대로 전달
      const apiParams = {
        ...params,
        cursorId: pageParam?.cursorId,
      };
      return getWrittenReviews(apiParams);
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
 * 리뷰 작성 Mutation Hook
 */
export function useCreateReview() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<CreateReviewResponse>,
    Error,
    { reservationId: number; data: CreateReviewRequest }
  >({
    mutationFn: ({ reservationId, data }) => createReview(reservationId, data),
    onSuccess: () => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      showToast('리뷰가 등록되었습니다.');
    },
    onError: () => {
      showToast('리뷰 등록에 실패했습니다.');
    },
  });
}

/**
 * 리뷰 수정 Mutation Hook
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<void>,
    Error,
    { reviewId: number; data: CreateReviewRequest }
  >({
    mutationFn: ({ reviewId, data }) => updateReview(reviewId, data),
    onSuccess: () => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      showToast('리뷰가 수정되었습니다.');
    },
    onError: () => {
      showToast('리뷰 수정에 실패했습니다.');
    },
  });
}

/**
 * 리뷰 삭제 Mutation Hook
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      showToast('리뷰가 삭제되었습니다.');
    },
    onError: () => {
      showToast('리뷰 삭제에 실패했습니다.');
    },
  });
}
