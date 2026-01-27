import { axiosInstance } from '../axios';
import type { ApiResponse, DesignerListItem, RecruitmentListItem } from '@/src/types';
import type {
  ModelHomeReservationItem,
  ModelHomePopularRecruitmentItem,
  ModelHomePopularRecruitmentsParams,
  ModelHomeNearbyRecruitmentsParams,
  ModelHomePopularDesignersParams,
} from '@/src/types/modelHome';

/**
 * 모델 홈 예약 내역 조회
 * GET /home/models/reservations
 */
export async function getModelHomeReservations(): Promise<ApiResponse<ModelHomeReservationItem[]>> {
  const { data } = await axiosInstance.get<ApiResponse<ModelHomeReservationItem[]>>('/home/models/reservations');
  return data;
}

/**
 * 모델 홈 실시간 인기 TOP 모집글
 * GET /recruitments/popular
 */
export async function getModelHomePopularRecruitments(
  params: ModelHomePopularRecruitmentsParams = {},
): Promise<ApiResponse<ModelHomePopularRecruitmentItem[]>> {
  const { data } = await axiosInstance.get<ApiResponse<ModelHomePopularRecruitmentItem[]>>('/recruitments/popular', {
    params,
  });
  return data;
}

/**
 * 모델 홈 내 주위 모집글
 * GET /recruitments/nearby
 */
export async function getModelHomeNearbyRecruitments(
  params: ModelHomeNearbyRecruitmentsParams,
): Promise<ApiResponse<RecruitmentListItem[]>> {
  const { data } = await axiosInstance.get<ApiResponse<RecruitmentListItem[]>>('/recruitments/nearby', {
    params,
  });
  return data;
}

/**
 * 모델 홈 시술별 인기 디자이너
 * GET /designers/popular
 */
export async function getModelHomePopularDesigners(
  params: ModelHomePopularDesignersParams,
): Promise<ApiResponse<DesignerListItem[]>> {
  const { data } = await axiosInstance.get<ApiResponse<DesignerListItem[]>>('/designers/popular', {
    params,
  });
  return data;
}
