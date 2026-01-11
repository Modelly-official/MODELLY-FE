import {
  useQuery,
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
  UnreviewedReservationsResponse,
  WrittenReviewsResponse,
  ReviewListParams,
  CreateReviewRequest,
  CreateReviewResponse,
} from '@/src/types';

// Query Keys
export const reviewKeys = {
  all: ['reviews'] as const,
  unreviewed: () => [...reviewKeys.all, 'unreviewed'] as const,
  written: (params?: ReviewListParams) =>
    [...reviewKeys.all, 'written', params] as const,
};

// 커서 타입
interface ReviewCursor {
  cursorId?: number;
}

interface UseReviewsOptions {
  enabled?: boolean;
}

/**
 * 리뷰 미작성 예약 목록 조회 Hook
 */
export function useUnreviewedReservations(
  options: UseReviewsOptions = {}
) {
  const { enabled = true } = options;

  return useQuery<
    ApiResponse<UnreviewedReservationsResponse>,
    Error
  >({
    queryKey: reviewKeys.unreviewed(),
    queryFn: getUnreviewedReservations,
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
      return getWrittenReviews({
        ...params,
        cursorId: pageParam?.cursorId,
      });
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
