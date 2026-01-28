import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodayReservations,
  getPendingReservations,
  getReservationDetail,
  confirmReservation,
  rejectReservation,
} from '@/src/apis/designer';
import { useToast } from '@/src/hooks/common/useToast';
import { calendarKeys } from '@/src/hooks/queries/calendar';
import { myRecruitmentKeys } from '@/src/hooks/queries/myRecruitment';
import type { ApiResponse } from '@/src/types';
import type {
  TodayReservationsResult,
  PendingReservationsResult,
  ReservationDetailResult,
} from '@/src/types/designerHome';

// Query Keys
export const designerReservationKeys = {
  all: ['designerReservations'] as const,
  today: (date: string) => [...designerReservationKeys.all, 'today', date] as const,
  pending: () => [...designerReservationKeys.all, 'pending'] as const,
  detail: (id: number) => [...designerReservationKeys.all, 'detail', id] as const,
};

interface UseQueryOptions {
  enabled?: boolean;
}

/**
 * 오늘의 예약 목록 조회 Hook
 */
export function useTodayReservations(date: string, options: UseQueryOptions = {}) {
  const { enabled = true } = options;

  return useQuery<ApiResponse<TodayReservationsResult>, Error>({
    queryKey: designerReservationKeys.today(date),
    queryFn: () => getTodayReservations({ date }),
    enabled: enabled && !!date,
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * 신규 예약 신청 목록 조회 Hook
 */
export function usePendingReservations(options: UseQueryOptions = {}) {
  const { enabled = true } = options;

  return useQuery<ApiResponse<PendingReservationsResult>, Error>({
    queryKey: designerReservationKeys.pending(),
    queryFn: () => getPendingReservations(),
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * 예약 상세 조회 Hook
 */
export function useReservationDetail(reservationId: number, options: UseQueryOptions = {}) {
  const { enabled = true } = options;

  return useQuery<ApiResponse<ReservationDetailResult>, Error>({
    queryKey: designerReservationKeys.detail(reservationId),
    queryFn: () => getReservationDetail(reservationId),
    enabled: enabled && !!reservationId,
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * 예약 확정 Mutation Hook
 */
export function useConfirmReservation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (reservationId: number) => confirmReservation(reservationId),
    onSuccess: (_, reservationId) => {
      // 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: designerReservationKeys.all });
      queryClient.invalidateQueries({ queryKey: designerReservationKeys.detail(reservationId) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      queryClient.invalidateQueries({ queryKey: myRecruitmentKeys.lists() });
    },
    onError: () => {
      showToast('예약 확정에 실패했습니다.');
    },
  });
}

/**
 * 예약 거절 Mutation Hook
 */
export function useRejectReservation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (reservationId: number) => rejectReservation(reservationId),
    onSuccess: (_, reservationId) => {
      // 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: designerReservationKeys.all });
      queryClient.invalidateQueries({ queryKey: designerReservationKeys.detail(reservationId) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      queryClient.invalidateQueries({ queryKey: myRecruitmentKeys.lists() });
      showToast('예약이 거절되었습니다.');
    },
    onError: () => {
      showToast('예약 거절에 실패했습니다.');
    },
  });
}
