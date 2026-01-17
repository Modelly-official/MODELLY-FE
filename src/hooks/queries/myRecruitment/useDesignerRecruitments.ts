import { useInfiniteQuery } from '@tanstack/react-query';
import { getDesignerRecruitments } from '@/src/apis';
import type { ApiResponse, MyRecruitmentListResponse, RecruitmentStatus } from '@/src/types';

export const myRecruitmentKeys = {
  all: ['myRecruitments'] as const,
  lists: () => [...myRecruitmentKeys.all, 'list'] as const,
  list: (status: RecruitmentStatus, month?: string) =>
    [...myRecruitmentKeys.lists(), status, month] as const,
};

interface UseDesignerRecruitmentsParams {
  status: RecruitmentStatus;
  month?: string; // OPEN일 때만 필요
  size?: number;
  enabled?: boolean;
}

/**
 * 디자이너 내 공고 목록 무한 스크롤 Hook
 * useInfiniteQuery를 사용하여 커서 기반 페이징 지원
 */
export function useDesignerRecruitments(params: UseDesignerRecruitmentsParams) {
  const { status, month, size = 10, enabled = true } = params;

  type CursorParam = { cursorId?: number; cursorEarliestDate?: string } | undefined;

  return useInfiniteQuery<
    ApiResponse<MyRecruitmentListResponse>,
    Error,
    { pages: ApiResponse<MyRecruitmentListResponse>[]; pageParams: CursorParam[] },
    ReturnType<typeof myRecruitmentKeys.list>,
    CursorParam
  >({
    queryKey: myRecruitmentKeys.list(status, month),
    queryFn: async ({ pageParam }) => {
      return getDesignerRecruitments({
        status,
        month,
        size,
        cursorId: pageParam?.cursorId,
        cursorEarliestDate: pageParam?.cursorEarliestDate,
      });
    },
    initialPageParam: undefined as { cursorId?: number; cursorEarliestDate?: string } | undefined,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage.result.hasNext) return undefined;

      const items = lastPage.result.items;
      if (items.length === 0) return undefined;

      // 마지막 아이템에서 커서 정보 추출
      const lastItem = items[items.length - 1];
      const nextCursorId = lastItem.recruitmentId;

      // period에서 시작 날짜 추출 ("2026-01-03 ~ 2026-01-17" → "2026-01-03")
      const periodMatch = lastItem.period?.match(/^(\d{4}-\d{2}-\d{2})/);
      const nextCursorEarliestDate = periodMatch ? periodMatch[1] : undefined;

      // 무한 루프 방지
      if (nextCursorId === lastPageParam?.cursorId) {
        return undefined;
      }

      return { cursorId: nextCursorId, cursorEarliestDate: nextCursorEarliestDate };
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
