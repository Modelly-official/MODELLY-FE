import { useQuery } from '@tanstack/react-query';
import { getDesignerReservations, getModelReservations } from '@/src/apis';
import type {
  ApiResponse,
  DesignerReservationListItem,
  ModelReservationListItem,
  ReservationInfo,
  ReservationScrollResult,
} from '@/src/types';

type UserRole = 'designer' | 'model';

interface UseChatReservationSummaryParams {
  role?: UserRole | null;
  opponentUserId?: number | null;
  opponentName?: string;
  enabled?: boolean;
}

const compareReservationOrder = (
  a: { status: string; date: string; startTime: string },
  b: { status: string; date: string; startTime: string },
) => {
  const statusPriority: Record<string, number> = {
    RESERVATION_CONFIRMED: 0,
    RESERVATION_PENDING: 1,
    RESERVATION_CANCELLED: 2,
  };
  const statusDiff = (statusPriority[a.status] ?? 9) - (statusPriority[b.status] ?? 9);
  if (statusDiff !== 0) return statusDiff;

  const aDate = new Date(`${a.date}T${a.startTime}:00`).getTime();
  const bDate = new Date(`${b.date}T${b.startTime}:00`).getTime();
  return aDate - bDate;
};

const mapDesignerReservationInfo = (
  item: DesignerReservationListItem,
  opponentUserId?: number | null,
): ReservationInfo => ({
  reservationId: item.reservationId,
  recruitmentId: item.recruitmentId,
  recruitmentTitle: item.recruitmentTitle,
  modelUserId: item.modelUserId ?? opponentUserId ?? 0,
  modelName: item.modelName,
  date: item.date,
  startTime: item.startTime,
  endTime: item.endTime,
  status: item.status,
});

const mapModelReservationInfo = (
  item: ModelReservationListItem,
  opponentUserId?: number | null,
  opponentName?: string,
): ReservationInfo => ({
  reservationId: item.reservationId,
  recruitmentId: item.recruitmentId,
  recruitmentTitle: item.recruitmentTitle,
  modelUserId: opponentUserId ?? 0,
  modelName: item.designerNickname || opponentName || '',
  date: item.date,
  startTime: item.startTime,
  endTime: item.endTime,
  status: item.status,
});

const getSummaryFromDesigner = (
  response: ApiResponse<ReservationScrollResult<DesignerReservationListItem>>,
  opponentUserId?: number | null,
) => {
  const items = response.result?.items ?? [];
  const filtered = opponentUserId
    ? items.filter((item) => item.modelUserId === opponentUserId && item.status === 'RESERVATION_CONFIRMED')
    : [];
  if (filtered.length === 0) return null;
  const sorted = [...filtered].sort(compareReservationOrder);
  return mapDesignerReservationInfo(sorted[0], opponentUserId);
};

const getSummaryFromModel = (
  response: ApiResponse<ReservationScrollResult<ModelReservationListItem>>,
  opponentUserId?: number | null,
  opponentName?: string,
) => {
  const items = response.result?.items ?? [];
  const filtered = opponentUserId
    ? items.filter((item) => item.designerUserId === opponentUserId && item.status === 'RESERVATION_CONFIRMED')
    : [];
  if (filtered.length === 0) return null;
  const sorted = [...filtered].sort(compareReservationOrder);
  return mapModelReservationInfo(sorted[0], opponentUserId, opponentName);
};

export function useChatReservationSummary({
  role,
  opponentUserId,
  opponentName,
  enabled = true,
}: UseChatReservationSummaryParams) {
  return useQuery<ReservationInfo | null, Error>({
    queryKey: ['reservation', 'chatSummary', role, opponentUserId],
    enabled: enabled && !!role && !!opponentUserId,
    refetchOnMount: 'always',
    queryFn: async () => {
      if (!role || !opponentUserId) return null;
      if (role === 'designer') {
        const response = await getDesignerReservations({ type: 'UPCOMING', size: 50 });
        return getSummaryFromDesigner(response, opponentUserId);
      }
      const response = await getModelReservations({ type: 'UPCOMING', size: 50 });
      return getSummaryFromModel(response, opponentUserId, opponentName);
    },
    staleTime: 1000 * 30,
  });
}
