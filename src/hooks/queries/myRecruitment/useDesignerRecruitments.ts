import { useInfiniteQuery } from '@tanstack/react-query';
import { getDesignerRecruitments } from '@/src/apis';
import type { ApiResponse, MyRecruitmentListResponse } from '@/src/types';

export const myRecruitmentKeys = {
  all: ['myRecruitments'] as const,
  lists: () => [...myRecruitmentKeys.all, 'list'] as const,
  list: (month: string) => [...myRecruitmentKeys.lists(), month] as const,
};

interface UseDesignerRecruitmentsParams {
  month: string;
  size?: number;
  enabled?: boolean;
}

/**
 * 디자이너 내 공고 목록 무한 스크롤 Hook
 * useInfiniteQuery를 사용하여 커서 기반 페이징 지원
 */
export function useDesignerRecruitments(params: UseDesignerRecruitmentsParams) {
  const { month, size = 10, enabled = true } = params;

  return useInfiniteQuery<
    ApiResponse<MyRecruitmentListResponse>,
    Error,
    { pages: ApiResponse<MyRecruitmentListResponse>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof myRecruitmentKeys.list>,
    number | undefined
  >({
    queryKey: myRecruitmentKeys.list(month),
    queryFn: async ({ pageParam }) => {
      return getDesignerRecruitments({
        month,
        size,
        cursorId: pageParam,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) return undefined;
      return lastPage.result.nextCursor;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
