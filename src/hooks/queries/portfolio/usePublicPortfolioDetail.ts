import { useQuery } from '@tanstack/react-query';
import { getPublicPortfolioDetail } from '@/src/apis';
import { portfolioKeys } from './useDesignerPortfolios';
import type { ApiResponse, PublicPortfolioDetail } from '@/src/types';

interface UsePublicPortfolioDetailParams {
  portfolioId: number | null;
  enabled?: boolean;
}

/**
 * 포트폴리오 단건 조회 Hook (공개)
 */
export function usePublicPortfolioDetail({
  portfolioId,
  enabled = true,
}: UsePublicPortfolioDetailParams) {
  const isEnabled = enabled && typeof portfolioId === 'number' && portfolioId > 0;

  return useQuery<ApiResponse<PublicPortfolioDetail>, Error>({
    queryKey: portfolioKeys.publicDetail(portfolioId ?? 0),
    queryFn: () => getPublicPortfolioDetail(portfolioId as number),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}
