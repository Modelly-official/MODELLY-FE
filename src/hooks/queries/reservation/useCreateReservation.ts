import { useMutation } from '@tanstack/react-query';
import { createReservation } from '@/src/apis';
import { useToast } from '@/src/hooks/common/useToast';
import type {
  ApiResponse,
  ReservationCreateRequest,
  ReservationCreateResult,
} from '@/src/types';

/**
 * 예약 생성 Mutation Hook
 */
export function useCreateReservation() {
  const { showToast } = useToast();

  return useMutation<
    ApiResponse<ReservationCreateResult>,
    Error,
    ReservationCreateRequest
  >({
    mutationFn: (request: ReservationCreateRequest) => {
      return createReservation(request);
    },
    onError: () => {
      showToast('예약에 실패했습니다. 다시 시도해주세요.');
    },
  });
}
