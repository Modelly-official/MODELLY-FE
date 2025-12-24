import { axiosInstance } from '../axios';
import type { ApiResponse } from '@/src/types';

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
