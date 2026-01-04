import { axiosInstance } from '../axios';
import type { ApiResponse } from '@/src/types';
import type {
  GetReservationDotsParams,
  GetCalendarReservationsParams,
  ReservationDotsResult,
  CalendarReservationsResult,
} from '@/src/types/calendar';

/**
 * 월간 예약 도트 조회
 * GET /designers/calendar/reservation-dots
 * 해당 월의 각 날짜별로 예약이 존재하는지 여부를 반환
 */
export async function getReservationDots(
  params: GetReservationDotsParams
): Promise<ApiResponse<ReservationDotsResult>> {
  const { data } = await axiosInstance.get<ApiResponse<ReservationDotsResult>>(
    '/designers/calendar/reservation-dots',
    { params }
  );
  return data;
}

/**
 * 캘린더 예약 목록 조회
 * GET /designers/calendar/reservations
 * 월별 예약 목록 조회 (날짜 필터 가능)
 */
export async function getCalendarReservations(
  params: GetCalendarReservationsParams
): Promise<ApiResponse<CalendarReservationsResult>> {
  const { data } = await axiosInstance.get<ApiResponse<CalendarReservationsResult>>(
    '/designers/calendar/reservations',
    { params }
  );
  return data;
}
