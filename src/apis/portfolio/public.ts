import { axiosInstance } from '../axios';
import type { ApiResponse } from '@/src/types';
import type {
  DesignerPortfolioListParams,
  DesignerPortfolioListResponse,
  PublicPortfolioDetail,
} from '@/src/types/portfolio';

/**
 * 디자이너 포트폴리오 리스트 조회 (공개)
 * GET /{designerId}/portfolios
 */
export async function getPublicDesignerPortfolios(
  designerId: number,
  params?: DesignerPortfolioListParams
): Promise<ApiResponse<DesignerPortfolioListResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerPortfolioListResponse>>(
    `/${designerId}/portfolios`,
    { params }
  );
  return data;
}

/**
 * 포트폴리오 단건 조회 (공개)
 * GET /portfolios/{portfolioId}
 */
export async function getPublicPortfolioDetail(
  portfolioId: number
): Promise<ApiResponse<PublicPortfolioDetail>> {
  const { data } = await axiosInstance.get<ApiResponse<PublicPortfolioDetail>>(
    `/portfolios/${portfolioId}`
  );
  return data;
}
