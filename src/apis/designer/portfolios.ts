import { axiosInstance } from '../axios';
import { uploadImageToS3 } from '../auth/profile';
import type { ApiResponse } from '@/src/types';
import type {
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
  DesignerPortfolioListParams,
  DesignerPortfolioListResponse,
  PortfolioMutationResponse,
  PortfolioPresignedUrlsResponse,
  PortfolioImageUploadResult,
  DesignerPortfolioDetail,
} from '@/src/types/portfolio';

/**
 * 디자이너 내 포트폴리오 리스트 조회
 * GET /designers/portfolios
 */
export async function getDesignerPortfolios(
  params: DesignerPortfolioListParams
): Promise<ApiResponse<DesignerPortfolioListResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerPortfolioListResponse>>(
    '/designers/portfolios',
    { params }
  );
  return data;
}

/**
 * 디자이너 포트폴리오 단건 조회
 * GET /designers/portfolios/{portfolioId}
 */
export async function getDesignerPortfolioDetail(
  portfolioId: number
): Promise<ApiResponse<DesignerPortfolioDetail>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerPortfolioDetail>>(
    `/designers/portfolios/${portfolioId}`
  );
  return data;
}

/**
 * 포트폴리오 생성
 * POST /designers/portfolios
 */
export async function createPortfolio(
  request: CreatePortfolioRequest
): Promise<ApiResponse<PortfolioMutationResponse>> {
  const { data } = await axiosInstance.post<ApiResponse<PortfolioMutationResponse>>(
    '/designers/portfolios',
    request
  );
  return data;
}

/**
 * 포트폴리오 수정
 * PUT /designers/portfolios/{portfolioId}
 */
export async function updatePortfolio(
  portfolioId: number,
  request: UpdatePortfolioRequest
): Promise<ApiResponse<PortfolioMutationResponse>> {
  const { data } = await axiosInstance.put<ApiResponse<PortfolioMutationResponse>>(
    `/designers/portfolios/${portfolioId}`,
    request
  );
  return data;
}

/**
 * 포트폴리오 삭제
 * DELETE /designers/portfolios/{portfolioId}
 */
export async function deletePortfolio(portfolioId: number): Promise<ApiResponse<string>> {
  const { data } = await axiosInstance.delete<ApiResponse<string>>(
    `/designers/portfolios/${portfolioId}`
  );
  return data;
}

/**
 * 포트폴리오 이미지용 Presigned URL 발급
 * GET /presigned-url/portfolios
 */
export async function getPortfolioPresignedUrls(
  imageCount: number
): Promise<ApiResponse<PortfolioPresignedUrlsResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<PortfolioPresignedUrlsResponse>>(
    '/presigned-url/portfolios',
    { params: { imageCount } }
  );
  return data;
}

/**
 * 포트폴리오 이미지 업로드 전체 플로우
 * 1. Presigned URL 발급
 * 2. S3에 병렬 업로드
 * 3. 결과 반환 (thumbnail, imageUrls, folderId)
 */
export async function uploadPortfolioImages(
  files: File[]
): Promise<PortfolioImageUploadResult> {
  if (files.length === 0) {
    throw new Error('업로드할 이미지가 없습니다.');
  }

  if (files.length > 3) {
    throw new Error('이미지는 최대 3장까지 업로드할 수 있습니다.');
  }

  const presignedResponse = await getPortfolioPresignedUrls(files.length);

  if (!presignedResponse.isSuccess || !presignedResponse.result) {
    throw new Error(presignedResponse.message || 'Presigned URL 발급 실패');
  }

  const { folderId, presignedUrls, thumbnailUrl } = presignedResponse.result;

  if (presignedUrls.length !== files.length) {
    throw new Error('Presigned URL 개수가 업로드 파일 수와 일치하지 않습니다.');
  }
  if (presignedUrls.some((u) => !u.uploadUrl || !u.imageUrl)) {
    throw new Error('Presigned URL 응답에 누락된 필드가 있습니다.');
  }

  await Promise.all(
    files.map((file, index) => uploadImageToS3(presignedUrls[index].uploadUrl, file))
  );

  return {
    thumbnail: thumbnailUrl,
    imageUrls: presignedUrls.map((item) => item.imageUrl),
    folderId,
  };
}
