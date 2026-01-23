import { axiosInstance } from '../axios';
import type { ApiResponse } from '@/src/types';
import type { DesignerProfileResponse, DesignerProfileUpdateRequest } from '@/src/types/profile';

/**
 * 디자이너 공개 프로필 조회
 * GET /profiles/designers/{designerId}
 */
export async function getPublicDesignerProfile(
  designerId: number
): Promise<ApiResponse<DesignerProfileResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerProfileResponse>>(
    `/profiles/designers/${designerId}`
  );
  return data;
}

/**
 * 디자이너 본인 프로필 조회 (공개용 프로필)
 * GET /designers/profiles
 */
export async function getMyDesignerProfile(): Promise<ApiResponse<DesignerProfileResponse>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerProfileResponse>>('/designers/profiles');
  return data;
}

/**
 * 디자이너 본인 프로필 수정 (공개용 프로필)
 * PUT /designers/profiles
 */
export async function updateMyDesignerProfile(
  payload: DesignerProfileUpdateRequest,
): Promise<ApiResponse<DesignerProfileResponse>> {
  const { data } = await axiosInstance.put<ApiResponse<DesignerProfileResponse>>('/designers/profiles', payload);
  return data;
}
