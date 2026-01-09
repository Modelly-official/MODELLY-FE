import { useInfiniteQuery } from '@tanstack/react-query';
import { getModelReservations, getDesignerReservations } from '@/src/apis';
import type {
  ApiResponse,
  ReservationListType,
  ReservationsResponse,
  ModelReservationItem,
  DesignerReservationItem,
} from '@/src/types';

// 커서 타입
interface ReservationCursor {
  cursorId?: number;
  cursorDate?: string;
  cursorTime?: string;
}

// Query Keys
export const myReservationKeys = {
  all: ['myReservations'] as const,
  model: (type: ReservationListType) => [...myReservationKeys.all, 'model', type] as const,
  designer: (type: ReservationListType) => [...myReservationKeys.all, 'designer', type] as const,
};

interface UseMyReservationsOptions {
  enabled?: boolean;
}

/**
 * 모델 예약 목록 조회 Hook (무한 스크롤)
 */
export function useModelReservations(
  type: ReservationListType,
  options: UseMyReservationsOptions = {}
) {
  const { enabled = true } = options;

  return useInfiniteQuery<
    ApiResponse<ReservationsResponse<ModelReservationItem>>,
    Error,
    { pages: ApiResponse<ReservationsResponse<ModelReservationItem>>[]; pageParams: ReservationCursor[] },
    ReturnType<typeof myReservationKeys.model>,
    ReservationCursor
  >({
    queryKey: myReservationKeys.model(type),
    queryFn: async ({ pageParam }) => {
      return getModelReservations({
        type,
        cursorId: pageParam?.cursorId,
        cursorDate: pageParam?.cursorDate,
        cursorTime: pageParam?.cursorTime,
      });
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) return undefined;
      return {
        cursorId: lastPage.result.nextCursorId,
        cursorDate: lastPage.result.nextCursorDate,
        cursorTime: lastPage.result.nextCursorTime,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * 디자이너 예약 목록 조회 Hook (무한 스크롤)
 */
export function useDesignerMyReservations(
  type: ReservationListType,
  options: UseMyReservationsOptions = {}
) {
  const { enabled = true } = options;

  return useInfiniteQuery<
    ApiResponse<ReservationsResponse<DesignerReservationItem>>,
    Error,
    { pages: ApiResponse<ReservationsResponse<DesignerReservationItem>>[]; pageParams: ReservationCursor[] },
    ReturnType<typeof myReservationKeys.designer>,
    ReservationCursor
  >({
    queryKey: myReservationKeys.designer(type),
    queryFn: async ({ pageParam }) => {
      return getDesignerReservations({
        type,
        cursorId: pageParam?.cursorId,
        cursorDate: pageParam?.cursorDate,
        cursorTime: pageParam?.cursorTime,
      });
    },
    initialPageParam: {},
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) return undefined;
      return {
        cursorId: lastPage.result.nextCursorId,
        cursorDate: lastPage.result.nextCursorDate,
        cursorTime: lastPage.result.nextCursorTime,
      };
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2분
  });
}
