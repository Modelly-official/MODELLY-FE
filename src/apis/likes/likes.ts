import { axiosInstance } from '../axios';
import type { ApiResponse, LikedListParams, LikedDesignersResponse, LikedRecruitmentsResponse } from '@/src/types';

/**
 * 공고 찜하기 / 찜 취소하기 (토글)
 * POST /likes/recruitments/{recruitmentId}
 * 인증 필요
 */
export async function toggleRecruitmentLike(
  recruitmentId: number
): Promise<ApiResponse<string>> {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    `/likes/recruitments/${recruitmentId}`
  );
  return data;
}

/**
 * 디자이너 찜하기 / 찜 취소하기 (토글)
 * POST /likes/designers/{designerId}
 * 인증 필요
 */
export async function toggleDesignerLike(
  designerId: number
): Promise<ApiResponse<string>> {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    `/likes/designers/${designerId}`
  );
  return data;
}

/**
 * 찜한 디자이너 목록 조회
 * GET /likes/designers
 * 인증 필요
 */
export async function getLikedDesigners(
  params: LikedListParams
): Promise<ApiResponse<LikedDesignersResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<LikedDesignersResponse>>(
    '/likes/designers',
    { params }
  );
  return data;
}

/**
 * 찜한 공고 목록 조회
 * GET /likes/recruitments
 * 인증 필요
 */
export async function getLikedRecruitments(
  params: LikedListParams
): Promise<ApiResponse<LikedRecruitmentsResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<LikedRecruitmentsResponse>>(
    '/likes/recruitments',
    { params }
  );
  return data;
}
