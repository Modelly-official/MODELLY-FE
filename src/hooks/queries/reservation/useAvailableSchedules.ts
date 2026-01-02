import { useQuery } from '@tanstack/react-query';
import { getAvailableSchedules } from '@/src/apis';
import type { ApiResponse, AvailableSchedulesResult } from '@/src/types';

// Query Keys
export const reservationKeys = {
  all: ['reservation'] as const,
  availableSchedules: (recruitmentId: number, month?: string) =>
    [...reservationKeys.all, 'availableSchedules', recruitmentId, month] as const,
};

interface UseAvailableSchedulesParams {
  recruitmentId: number;
  month?: string; // yyyy-MM
}

interface UseAvailableSchedulesOptions {
  enabled?: boolean;
}

/**
 * 예약 가능한 시간대 조회 Hook
 */
export function useAvailableSchedules(
  params: UseAvailableSchedulesParams,
  options: UseAvailableSchedulesOptions = {}
) {
  const { recruitmentId, month } = params;
  const { enabled = true } = options;

  return useQuery<ApiResponse<AvailableSchedulesResult>, Error>({
    queryKey: reservationKeys.availableSchedules(recruitmentId, month),
    queryFn: () => getAvailableSchedules({ recruitmentId, month }),
    enabled: enabled && recruitmentId > 0,
    staleTime: 1000 * 60 * 2, // 2분 (예약 가능 시간은 자주 변경될 수 있음)
  });
}
