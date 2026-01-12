import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getDesignerReviews,
  createReply,
  updateReply,
  pinReview,
} from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import type {
  ApiResponse,
  DesignerReviewsResponse,
  ReviewListParams,
  CreateReplyRequest,
  CreateReplyResponse,
  PinReviewRequest,
} from '@/src/types';

// Query Keys
export const designerReviewKeys = {
  all: ['designerReviews'] as const,
  list: (params?: ReviewListParams) =>
    [...designerReviewKeys.all, 'list', params] as const,
};

// 커서 타입
interface ReviewCursor {
  cursorId?: number;
}

interface UseDesignerReviewsOptions {
  enabled?: boolean;
}

/**
 * 디자이너가 받은 리뷰 목록 조회 Hook (무한 스크롤)
 */
export function useDesignerReviews(
  params?: Omit<ReviewListParams, 'cursorId'>,
  options: UseDesignerReviewsOptions = {}
) {
  const { enabled = true } = options;

  return useInfiniteQuery<
    ApiResponse<DesignerReviewsResponse>,
    Error,
    { pages: ApiResponse<DesignerReviewsResponse>[]; pageParams: ReviewCursor[] },
    ReturnType<typeof designerReviewKeys.list>,
    ReviewCursor
  >({
    queryKey: designerReviewKeys.list(params),
    queryFn: async ({ pageParam }) => {
      const apiParams = {
        ...params,
        cursorId: pageParam?.cursorId,
      };
      return getDesignerReviews(apiParams);
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
 * 답글 작성 Mutation Hook
 */
export function useCreateReply() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<CreateReplyResponse>,
    Error,
    { reviewId: number; data: CreateReplyRequest }
  >({
    mutationFn: ({ reviewId, data }) => createReply(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designerReviewKeys.all });
      showToast('답글이 등록되었습니다.');
    },
    onError: () => {
      showToast('답글 등록에 실패했습니다.');
    },
  });
}

/**
 * 답글 수정 Mutation Hook
 */
export function useUpdateReply() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<void>,
    Error,
    { replyId: number; data: CreateReplyRequest }
  >({
    mutationFn: ({ replyId, data }) => updateReply(replyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designerReviewKeys.all });
      showToast('답글이 수정되었습니다.');
    },
    onError: () => {
      showToast('답글 수정에 실패했습니다.');
    },
  });
}

/**
 * 리뷰 고정/해제 Mutation Hook
 */
export function usePinReview() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<void>, Error, PinReviewRequest>({
    mutationFn: (pinData) => pinReview(pinData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: designerReviewKeys.all });
      showToast(variables.isPinned ? '리뷰가 고정되었습니다.' : '리뷰 고정이 해제되었습니다.');
    },
    onError: () => {
      showToast('리뷰 고정 상태 변경에 실패했습니다.');
    },
  });
}
