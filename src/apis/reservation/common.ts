import { axiosInstance } from '@/src/apis/axios';
import type { ApiResponse, ReservationCancelRequest, ReservationChangeRequest, ReservationChangeResult } from '@/src/types';

// 예약 변경 요청
export async function requestReservationChange(
  reservationId: number,
  payload: ReservationChangeRequest,
  params?: { roomId?: number },
): Promise<ApiResponse<ReservationChangeResult>> {
  const { data } = await axiosInstance.post<ApiResponse<ReservationChangeResult>>(
    `/reservations/${reservationId}/changes`,
    payload,
    { params },
  );
  return data;
}

// 예약 취소
export async function cancelReservation(
  reservationId: number,
  payload: ReservationCancelRequest,
  params?: { roomId?: number; reservationChangeId?: number },
): Promise<ApiResponse<ReservationChangeResult>> {
  const { data } = await axiosInstance.post<ApiResponse<ReservationChangeResult>>(
    `/reservations/${reservationId}/cancel`,
    payload,
    { params },
  );
  return data;
}

// 예약 변경 요청 거절
export async function rejectReservationChange(reservationChangeId: number): Promise<ApiResponse<ReservationChangeResult>> {
  const { data } = await axiosInstance.post<ApiResponse<ReservationChangeResult>>(
    `/reservations/changes/${reservationChangeId}/reject`,
  );
  return data;
}

// 예약 변경 요청 수락
export async function acceptReservationChange(reservationChangeId: number): Promise<ApiResponse<ReservationChangeResult>> {
  const { data } = await axiosInstance.post<ApiResponse<ReservationChangeResult>>(
    `/reservations/changes/${reservationChangeId}/accept`,
  );
  return data;
}

// 예약 변경 요청 취소
export async function cancelReservationChange(reservationChangeId: number): Promise<ApiResponse<ReservationChangeResult>> {
  const { data } = await axiosInstance.post<ApiResponse<ReservationChangeResult>>(
    `/reservations/changes/${reservationChangeId}/cancel`,
  );
  return data;
}

// 기존대로 진행
export async function proceedReservationChange(reservationChangeId: number): Promise<ApiResponse<ReservationChangeResult>> {
  const { data } = await axiosInstance.post<ApiResponse<ReservationChangeResult>>(
    `/reservations/changes/${reservationChangeId}/proceed`,
  );
  return data;
}
