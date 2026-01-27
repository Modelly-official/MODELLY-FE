import { useInfiniteQuery } from '@tanstack/react-query';
import { getPublicDesignerPortfolios } from '@/src/apis';
import { portfolioKeys } from './useDesignerPortfolios';
import type { ApiResponse, DesignerPortfolioListParams, DesignerPortfolioListResponse } from '@/src/types';

interface UsePublicDesignerPortfoliosInfiniteParams {
  designerId: number | null;
  params?: Omit<DesignerPortfolioListParams, 'cursorId'>;
  enabled?: boolean;
}

/**
 * 디자이너 포트폴리오 리스트 무한 스크롤 Hook (공개)
 */
export function usePublicDesignerPortfoliosInfinite({
  designerId,
  params,
  enabled = true,
}: UsePublicDesignerPortfoliosInfiniteParams) {
  const isEnabled = enabled && typeof designerId === 'number' && designerId > 0;

  return useInfiniteQuery<
    ApiResponse<DesignerPortfolioListResponse>,
    Error,
    { pages: ApiResponse<DesignerPortfolioListResponse>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof portfolioKeys.publicInfiniteList>,
    number | undefined
  >({
    queryKey: portfolioKeys.publicInfiniteList(designerId ?? 0, params),
    queryFn: ({ pageParam }) =>
      getPublicDesignerPortfolios(designerId as number, {
        ...params,
        cursorId: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) return undefined;
      return lastPage.result.nextCursor ?? undefined;
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}
