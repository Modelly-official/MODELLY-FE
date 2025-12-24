import { useInfiniteQuery } from '@tanstack/react-query';
import { getDesigners } from '@/src/apis';
import type { DesignerListParams, DesignerListResponse, ApiResponse } from '@/src/types';

export const designerKeys = {
  all: ['designers'] as const,
  lists: () => [...designerKeys.all, 'list'] as const,
  list: (params: DesignerListParams) => [...designerKeys.lists(), params] as const,
};

interface UseDesignersParams extends Omit<DesignerListParams, 'cursorId'> {
  enabled?: boolean;
}

/**
 * 디자이너 목록 무한 스크롤 Hook
 * useInfiniteQuery를 사용하여 커서 기반 페이징 지원
 */
export function useDesigners(params: UseDesignersParams = {}) {
  const { enabled = true, ...queryParams } = params;

  return useInfiniteQuery<
    ApiResponse<DesignerListResponse>,
    Error,
    { pages: ApiResponse<DesignerListResponse>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof designerKeys.list>,
    number | undefined
  >({
    queryKey: designerKeys.list(queryParams),
    queryFn: async ({ pageParam }) => {
      return getDesigners({
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
