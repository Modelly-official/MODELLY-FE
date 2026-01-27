import { useQuery } from '@tanstack/react-query';
import { getPublicDesignerPortfolios } from '@/src/apis';
import { portfolioKeys } from './useDesignerPortfolios';
import type { ApiResponse, DesignerPortfolioListParams, DesignerPortfolioListResponse } from '@/src/types';

interface UsePublicDesignerPortfoliosParams {
  designerId: number | null;
  params?: DesignerPortfolioListParams;
  enabled?: boolean;
}

/**
 * 디자이너 포트폴리오 리스트 조회 Hook (공개)
 */
export function usePublicDesignerPortfolios({
  designerId,
  params,
  enabled = true,
}: UsePublicDesignerPortfoliosParams) {
  const isEnabled = enabled && typeof designerId === 'number' && designerId > 0;

  return useQuery<ApiResponse<DesignerPortfolioListResponse>, Error>({
    queryKey: portfolioKeys.publicList(designerId ?? 0, params),
    queryFn: () => getPublicDesignerPortfolios(designerId as number, params),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}
