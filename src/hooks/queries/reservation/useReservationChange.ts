import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  acceptReservationChange,
  cancelReservation,
  cancelReservationChange,
  proceedReservationChange,
  rejectReservationChange,
  requestReservationChange,
} from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import { calendarKeys } from '@/src/hooks/queries/calendar';
import { myReservationKeys } from './useMyReservations';
import type { ApiResponse, ReservationCancelRequest, ReservationChangeRequest, ReservationChangeResult } from '@/src/types';

type RequestReservationChangeVariables = {
  reservationId: number;
  payload: ReservationChangeRequest;
  roomId?: number;
};

type CancelReservationVariables = {
  reservationId: number;
  payload: ReservationCancelRequest;
  roomId?: number;
  reservationChangeId?: number;
};

export function useRequestReservationChange() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<ReservationChangeResult>, Error, RequestReservationChangeVariables>({
    mutationFn: ({ reservationId, payload, roomId }) => requestReservationChange(reservationId, payload, { roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      queryClient.invalidateQueries({ queryKey: myReservationKeys.all });
    },
    onError: () => {
      showToast('예약 변경 요청에 실패했습니다.');
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<ReservationChangeResult>, Error, CancelReservationVariables>({
    mutationFn: ({ reservationId, payload, roomId, reservationChangeId }) =>
      cancelReservation(reservationId, payload, { roomId, reservationChangeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
      queryClient.invalidateQueries({ queryKey: myReservationKeys.all });
    },
    onError: () => {
      showToast('예약 취소에 실패했습니다.');
    },
  });
}

export function useRejectReservationChange() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<ReservationChangeResult>, Error, number>({
    mutationFn: (reservationChangeId) => rejectReservationChange(reservationChangeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
    onError: () => {
      showToast('예약 변경 거절에 실패했습니다.');
    },
  });
}

export function useAcceptReservationChange() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<ReservationChangeResult>, Error, number>({
    mutationFn: (reservationChangeId) => acceptReservationChange(reservationChangeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
    onError: () => {
      showToast('예약 변경 수락에 실패했습니다.');
    },
  });
}

export function useCancelReservationChange() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<ReservationChangeResult>, Error, number>({
    mutationFn: (reservationChangeId) => cancelReservationChange(reservationChangeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
    onError: () => {
      showToast('예약 변경 요청 취소에 실패했습니다.');
    },
  });
}

export function useProceedReservationChange() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation<ApiResponse<ReservationChangeResult>, Error, number>({
    mutationFn: (reservationChangeId) => proceedReservationChange(reservationChangeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
    onError: () => {
      showToast('기존 일정 진행 확정에 실패했습니다.');
    },
  });
}
