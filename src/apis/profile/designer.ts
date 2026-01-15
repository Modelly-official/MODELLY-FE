import { axiosInstance } from '../axios';
import type { ApiResponse } from '@/src/types';
import type { DesignerProfileResponse } from '@/src/types/profile';

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
