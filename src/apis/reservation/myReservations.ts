import { axiosInstance } from '../axios';
import type {
  ApiResponse,
  ReservationsParams,
  ReservationsResponse,
  ModelReservationItem,
  DesignerReservationItem,
} from '@/src/types';

/**
 * 모델 마이페이지 예약 목록 조회
 * GET /models/reservations
 */
export async function getModelMyReservations(
  params: ReservationsParams
): Promise<ApiResponse<ReservationsResponse<ModelReservationItem>>> {
  const { data } = await axiosInstance.get<
    ApiResponse<ReservationsResponse<ModelReservationItem>>
  >('/models/reservations', { params });
  return data;
}

/**
 * 디자이너 마이페이지 예약 목록 조회
 * GET /designers/reservations
 */
export async function getDesignerMyReservations(
  params: ReservationsParams
): Promise<ApiResponse<ReservationsResponse<DesignerReservationItem>>> {
  const { data } = await axiosInstance.get<
    ApiResponse<ReservationsResponse<DesignerReservationItem>>
  >('/designers/reservations', { params });
  return data;
}
