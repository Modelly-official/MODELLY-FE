import { useQuery } from '@tanstack/react-query';
import { getChatRoomReservationSummary, getDesignerMyReservations, getModelMyReservations } from '@/src/apis';
import type { ReservationInfo } from '@/src/types';

type UserRole = 'designer' | 'model';

interface UseChatReservationSummaryParams {
  roomId?: number | null;
  role?: UserRole | null;
  enabled?: boolean;
}

export function useChatReservationSummary({
  roomId,
  role,
  enabled = true,
}: UseChatReservationSummaryParams) {
  return useQuery<ReservationInfo | null, Error>({
    queryKey: ['reservation', 'chatSummary', roomId, role ?? null],
    enabled: enabled && !!roomId,
    refetchOnMount: 'always',
    queryFn: async () => {
      if (!roomId) return null;
      const response = await getChatRoomReservationSummary(roomId);
      const result = response.result;
      const summary = result?.reservation ?? null;
      if (!response.isSuccess || !result?.hasReservation || !summary) return null;
      let reservationId = summary.reservationId;
      let recruitmentId = summary.recruitmentId ?? null;
      let recruitmentTitle = summary.recruitmentTitle ?? undefined;

      if (!reservationId && role) {
        if (role === 'designer') {
          const listResponse = await getDesignerMyReservations({ type: 'UPCOMING', size: 50 });
          const items = listResponse.result?.items ?? [];
          const match = items.find(
            (item) =>
              item.modelUserId === summary.opponentUserId &&
              item.date === summary.date &&
              item.startTime === summary.startTime,
          );
          if (match) {
            reservationId = match.reservationId;
            recruitmentId = match.recruitmentId ?? recruitmentId;
            recruitmentTitle = match.recruitmentTitle ?? recruitmentTitle;
          }
        } else {
          const listResponse = await getModelMyReservations({ type: 'UPCOMING', size: 50 });
          const items = listResponse.result?.items ?? [];
          const match = items.find(
            (item) =>
              item.designerUserId === summary.opponentUserId &&
              item.date === summary.date &&
              item.startTime === summary.startTime,
          );
          if (match) {
            reservationId = match.reservationId;
            recruitmentId = match.recruitmentId ?? recruitmentId;
            recruitmentTitle = match.recruitmentTitle ?? recruitmentTitle;
          }
        }
      }

      if (!reservationId) return null;
      return {
        reservationId,
        recruitmentId,
        recruitmentTitle,
        modelUserId: summary.opponentUserId,
        modelName: summary.opponentName,
        date: summary.date,
        startTime: summary.startTime,
        endTime: summary.endTime,
      };
    },
    staleTime: 1000 * 30,
  });
}
