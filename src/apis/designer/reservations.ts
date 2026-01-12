import { axiosInstance } from '../axios';
import type {
  ApiResponse,
  DesignerReservationListItem,
  GetDesignerReservationListParams,
  ReservationScrollResult,
} from '@/src/types';
import type {
  GetTodayReservationsParams,
  TodayReservationsResult,
  PendingReservationsResult,
  ReservationDetailResult,
} from '@/src/types/designerHome';

/**
 * 오늘의 예약 목록 조회
 * GET /designers/reservations/daily?date=yyyy-MM-dd
 */
export async function getTodayReservations(
  params: GetTodayReservationsParams
): Promise<ApiResponse<TodayReservationsResult>> {
  const { data } = await axiosInstance.get<ApiResponse<TodayReservationsResult>>(
    '/designers/reservations/daily',
    { params }
  );
  return data;
}

/**
 * 신규 예약 신청 목록 조회
 * GET /designers/reservations/pending
 */
export async function getPendingReservations(): Promise<ApiResponse<PendingReservationsResult>> {
  const { data } = await axiosInstance.get<ApiResponse<PendingReservationsResult>>(
    '/designers/reservations/pending'
  );
  return data;
}

/**
 * 예약 목록 조회 (무한 스크롤)
 * GET /designers/reservations
 */
export async function getDesignerReservations(
  params: GetDesignerReservationListParams
): Promise<ApiResponse<ReservationScrollResult<DesignerReservationListItem>>> {
  const { data } = await axiosInstance.get<ApiResponse<ReservationScrollResult<DesignerReservationListItem>>>(
    '/designers/reservations',
    { params }
  );
  return data;
}

/**
 * 예약 상세 조회
 * GET /designers/reservations/{reservationId}
 */
export async function getReservationDetail(
  reservationId: number
): Promise<ApiResponse<ReservationDetailResult>> {
  const { data } = await axiosInstance.get<ApiResponse<ReservationDetailResult>>(
    `/designers/reservations/${reservationId}`
  );
  return data;
}

/**
 * 예약 확정
 * POST /designers/reservations/{reservationId}/confirm
 */
export async function confirmReservation(reservationId: number): Promise<ApiResponse<void>> {
  const { data } = await axiosInstance.post<ApiResponse<void>>(
    `/designers/reservations/${reservationId}/confirm`
  );
  return data;
}

/**
 * 예약 거절
 * POST /designers/reservations/{reservationId}/reject
 */
export async function rejectReservation(reservationId: number): Promise<ApiResponse<void>> {
  const { data } = await axiosInstance.post<ApiResponse<void>>(
    `/designers/reservations/${reservationId}/reject`
  );
  return data;
}
