import { useInfiniteQuery } from '@tanstack/react-query';
import { getRecruitments } from '@/src/apis';
import type { RecruitmentListParams, RecruitmentListResponse, ApiResponse } from '@/src/types';
import type { MockEndpoint } from '@/src/config/api';

export const recruitmentKeys = {
  all: ['recruitments'] as const,
  lists: () => [...recruitmentKeys.all, 'list'] as const,
  list: (params: RecruitmentListParams) => [...recruitmentKeys.lists(), params] as const,
  details: () => [...recruitmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...recruitmentKeys.details(), id] as const,
};

interface UseRecruitmentsParams extends Omit<RecruitmentListParams, 'cursorId'> {
  enabled?: boolean;
  /** mock endpoint 오버라이드 (기본: 'recruitments', map에서는 'mapRecruitments') */
  mockEndpoint?: MockEndpoint;
}

/**
 * 공고 목록 무한 스크롤 Hook
 * useInfiniteQuery를 사용하여 커서 기반 페이징 지원
 */
export function useRecruitments(params: UseRecruitmentsParams = {}) {
  const { enabled = true, mockEndpoint, ...queryParams } = params;

  return useInfiniteQuery<
    ApiResponse<RecruitmentListResponse>,
    Error,
    { pages: ApiResponse<RecruitmentListResponse>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof recruitmentKeys.list>,
    number | undefined
  >({
    queryKey: recruitmentKeys.list(queryParams),
    queryFn: async ({ pageParam }) => {
      return getRecruitments(
        { ...queryParams, cursorId: pageParam },
        { mockEndpoint }
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.result.hasNext) return undefined;
      // API 버그 방어: 이전 페이지의 nextCursor와 동일하면 더 이상 데이터 없음 (무한 루프 방지)
      if (allPages.length >= 2) {
        const prevCursor = allPages[allPages.length - 2].result.nextCursor;
        if (prevCursor === lastPage.result.nextCursor) {
          return undefined;
        }
      }
      return lastPage.result.nextCursor;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
