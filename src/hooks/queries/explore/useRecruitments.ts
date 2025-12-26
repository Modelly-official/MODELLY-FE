import { useInfiniteQuery } from '@tanstack/react-query';
import { getRecruitments } from '@/src/apis';
import type { RecruitmentListParams, RecruitmentListResponse, ApiResponse } from '@/src/types';

export const recruitmentKeys = {
  all: ['recruitments'] as const,
  lists: () => [...recruitmentKeys.all, 'list'] as const,
  list: (params: RecruitmentListParams) => [...recruitmentKeys.lists(), params] as const,
  details: () => [...recruitmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...recruitmentKeys.details(), id] as const,
};

interface UseRecruitmentsParams extends Omit<RecruitmentListParams, 'cursorId'> {
  enabled?: boolean;
}

/**
 * 공고 목록 무한 스크롤 Hook
 * useInfiniteQuery를 사용하여 커서 기반 페이징 지원
 */
export function useRecruitments(params: UseRecruitmentsParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useInfiniteQuery<
    ApiResponse<RecruitmentListResponse>,
    Error,
    { pages: ApiResponse<RecruitmentListResponse>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof recruitmentKeys.list>,
    number | undefined
  >({
    queryKey: recruitmentKeys.list(queryParams),
    queryFn: async ({ pageParam }) => {
      return getRecruitments({
        ...queryParams,
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
