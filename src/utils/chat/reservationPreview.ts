import { RESERVATION_TEXT } from '@/src/constants/chat';
import type { ReservationEventType } from '@/src/types/chat';

const DEFAULT_PREVIEW_TEXT = '예약 관련 알림이 왔습니다.';

const RESERVATION_PREVIEW_TEXT: Record<ReservationEventType, string> = {
  CHANGE_REQUEST: RESERVATION_TEXT.changeRequestTitle,
  CHANGE_REJECTED: '예약 변경 요청이 거절되었습니다.',
  CHANGE_PROCEED: '변경 없이 기존 예약 일정으로 진행합니다.',
  CHANGE_CANCEL: '예약 변경 요청이 취소되었습니다.',
  RESERVATION_CANCEL: '예약이 취소되었습니다.',
};

export const getReservationPreviewText = (raw?: string | null): string => {
  if (!raw) return DEFAULT_PREVIEW_TEXT;

  try {
    const payload = JSON.parse(raw) as { eventType?: string };
    const eventType = payload?.eventType as ReservationEventType | undefined;
    if (!eventType) return DEFAULT_PREVIEW_TEXT;
    return RESERVATION_PREVIEW_TEXT[eventType] ?? DEFAULT_PREVIEW_TEXT;
  } catch {
    return DEFAULT_PREVIEW_TEXT;
  }
};
