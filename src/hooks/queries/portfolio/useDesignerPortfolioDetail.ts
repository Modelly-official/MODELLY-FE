import { useQuery } from '@tanstack/react-query';
import { getDesignerPortfolioDetail } from '@/src/apis';
import { portfolioKeys } from './useDesignerPortfolios';
import type { ApiResponse, DesignerPortfolioDetail } from '@/src/types';

interface UseDesignerPortfolioDetailParams {
  portfolioId: number | null;
  enabled?: boolean;
}

/**
 * 디자이너 포트폴리오 단건 조회 Hook
 */
export function useDesignerPortfolioDetail({
  portfolioId,
  enabled = true,
}: UseDesignerPortfolioDetailParams) {
  const isEnabled = enabled && typeof portfolioId === 'number' && portfolioId > 0;

  return useQuery<ApiResponse<DesignerPortfolioDetail>, Error>({
    queryKey: portfolioKeys.detail(portfolioId ?? 0),
    queryFn: () => getDesignerPortfolioDetail(portfolioId as number),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}
