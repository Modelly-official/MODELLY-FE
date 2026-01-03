import { useQuery } from '@tanstack/react-query';
import { getReservationDots, getCalendarReservations } from '@/src/apis/designer';
import type { ApiResponse } from '@/src/types';
import type { ReservationDotsResult, CalendarReservationsResult } from '@/src/types/calendar';

// Query Keys
export const calendarKeys = {
  all: ['calendar'] as const,
  reservationDots: (month: string, includePending?: boolean) =>
    [...calendarKeys.all, 'dots', month, includePending] as const,
  reservations: (month: string, date?: string) =>
    [...calendarKeys.all, 'reservations', month, date] as const,
};

interface UseReservationDotsParams {
  month: string; // yyyy-MM
  includePending?: boolean;
}

interface UseCalendarReservationsParams {
  month: string; // yyyy-MM
  date?: string; // yyyy-MM-dd (특정 날짜 필터)
}

interface UseQueryOptions {
  enabled?: boolean;
}

/**
 * 월간 예약 도트 조회 Hook
 * 캘린더에서 예약이 있는 날짜에 도트를 표시하기 위한 데이터 조회
 */
export function useReservationDots(
  params: UseReservationDotsParams,
  options: UseQueryOptions = {}
) {
  const { month, includePending } = params;
  const { enabled = true } = options;

  return useQuery<ApiResponse<ReservationDotsResult>, Error>({
    queryKey: calendarKeys.reservationDots(month, includePending),
    queryFn: () => getReservationDots({ month, includePending }),
    enabled: enabled && !!month,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 캘린더 예약 목록 조회 Hook
 * 월별 또는 특정 날짜의 예약 목록 조회
 */
export function useCalendarReservations(
  params: UseCalendarReservationsParams,
  options: UseQueryOptions = {}
) {
  const { month, date } = params;
  const { enabled = true } = options;

  return useQuery<ApiResponse<CalendarReservationsResult>, Error>({
    queryKey: calendarKeys.reservations(month, date),
    queryFn: () => getCalendarReservations({ month, date }),
    enabled: enabled && !!month,
    staleTime: 1000 * 60 * 2, // 2분 (예약 데이터는 자주 변경될 수 있음)
  });
}
