// 디자이너 포트폴리오 관련 타입 정의

import type { CursorPaginationResponse } from '@/src/types/recruitment';
import type { SubCategory } from '@/src/types/recruitment';

// ===== Presigned URL (포트폴리오 이미지 업로드용) =====

/** 단일 Presigned URL */
export interface PortfolioPresignedUrlItem {
  uploadUrl: string;
  imageUrl: string;
}

/** 포트폴리오 이미지용 Presigned URL 응답 */
export interface PortfolioPresignedUrlsResponse {
  folderId: string;
  presignedUrls: PortfolioPresignedUrlItem[];
  thumbnailUrl: string;
}

/** 포트폴리오 이미지 업로드 결과 */
export interface PortfolioImageUploadResult {
  thumbnail: string;
  imageUrls: string[];
  folderId: string;
}

// ===== 내 포트폴리오 리스트 =====

/** 내 포트폴리오 리스트 조회 파라미터 */
export interface DesignerPortfolioListParams {
  cursorId?: number;
  size?: number;
}

/** 내 포트폴리오 리스트 아이템 */
export interface DesignerPortfolioListItem {
  portfolioId: number;
  thumbnail: string;
}

/** 내 포트폴리오 리스트 응답 */
export type DesignerPortfolioListResponse = CursorPaginationResponse<DesignerPortfolioListItem>;

// ===== 포트폴리오 생성/수정 =====

/** 포트폴리오 생성/수정 요청 */
export interface PortfolioRequest {
  title: string;
  thumbnail: string;
  folderId: string;
  imageUrls: string[];
  content: string;
  subCategoryList: SubCategory[];
}

/** 포트폴리오 생성 요청 */
export type CreatePortfolioRequest = PortfolioRequest;

/** 포트폴리오 수정 요청 */
export type UpdatePortfolioRequest = PortfolioRequest;

/** 포트폴리오 생성/수정 응답 */
export type PortfolioMutationResponse = string;
