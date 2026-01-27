import { useInfiniteQuery } from '@tanstack/react-query';
import { getDesignerPortfolios } from '@/src/apis';
import type {
  ApiResponse,
  DesignerPortfolioListResponse,
} from '@/src/types';

// Query Key Factory
export const portfolioKeys = {
  all: ['portfolios'] as const,
  lists: () => [...portfolioKeys.all, 'list'] as const,
  list: (size?: number) => [...portfolioKeys.lists(), size] as const,
  details: () => [...portfolioKeys.all, 'detail'] as const,
  detail: (portfolioId: number) => [...portfolioKeys.details(), portfolioId] as const,
  publicLists: () => [...portfolioKeys.all, 'public', 'list'] as const,
  publicList: (designerId: number, params?: { cursorId?: number; size?: number }) =>
    [...portfolioKeys.publicLists(), designerId, params] as const,
  publicInfiniteLists: () => [...portfolioKeys.all, 'public', 'list', 'infinite'] as const,
  publicInfiniteList: (designerId: number, params?: { cursorId?: number; size?: number }) =>
    [...portfolioKeys.publicInfiniteLists(), designerId, params] as const,
  publicDetails: () => [...portfolioKeys.all, 'public', 'detail'] as const,
  publicDetail: (portfolioId: number) => [...portfolioKeys.publicDetails(), portfolioId] as const,
};

interface UseDesignerPortfoliosParams {
  size?: number;
  enabled?: boolean;
}

/**
 * 디자이너 내 포트폴리오 리스트 무한 스크롤 Hook
 */
export function useDesignerPortfolios(params: UseDesignerPortfoliosParams = {}) {
  const { size = 12, enabled = true } = params;

  return useInfiniteQuery<
    ApiResponse<DesignerPortfolioListResponse>,
    Error,
    { pages: ApiResponse<DesignerPortfolioListResponse>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof portfolioKeys.list>,
    number | undefined
  >({
    queryKey: portfolioKeys.list(size),
    queryFn: async ({ pageParam }) => {
      return getDesignerPortfolios({
        cursorId: pageParam,
        size,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) return undefined;
      return lastPage.result.nextCursor ?? undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
