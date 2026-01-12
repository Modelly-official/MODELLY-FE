import type {
  ChatMessageResponse,
  Message,
  ReservationEventType,
  ReservationMessagePayload,
  StompIncomingChatPayload,
} from '@/src/types/chat';

const RESERVATION_EVENT_TYPES: ReservationEventType[] = [
  'CHANGE_REQUEST',
  'CHANGE_REJECTED',
  'CHANGE_PROCEED',
  'CHANGE_CANCEL',
  'RESERVATION_CANCEL',
];

const isReservationPayload = (value: unknown): value is ReservationMessagePayload => {
  if (!value || typeof value !== 'object') return false;
  const payload = value as { eventType?: string };
  return !!payload.eventType && RESERVATION_EVENT_TYPES.includes(payload.eventType as ReservationEventType);
};

const parseReservationPayload = (value?: string | null): ReservationMessagePayload | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return isReservationPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const formatMessageTime = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * 채팅 목록용 시간 포맷팅
 * - 오늘: "18:00"
 * - 어제: "어제"
 * - 올해: "12/25"
 * - 그 외: "2024.12.25"
 */
export const formatChatListTime = (isoString?: string): string => {
  if (!isoString) return '';

  const date = new Date(isoString);
  const now = new Date();

  // 날짜 비교를 위해 시간 제거
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayOnly = new Date(todayOnly);
  yesterdayOnly.setDate(yesterdayOnly.getDate() - 1);

  // 오늘
  if (dateOnly.getTime() === todayOnly.getTime()) {
    return formatMessageTime(isoString);
  }

  // 어제
  if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return '어제';
  }

  // 올해
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  // 그 외
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

export const mapApiMessage = (msg: ChatMessageResponse, currentUserId?: number | null): Message => {
  const fromMe = currentUserId != null ? msg.senderUserId === currentUserId : false;

  if (msg.messageType === 'RESERVATION') {
    const reservation = parseReservationPayload(msg.message);
    if (!reservation) {
      return {
        id: msg.messageId,
        fromMe,
        messageType: 'TEXT',
        text: msg.message ?? '',
        time: msg.createdAt ? formatMessageTime(msg.createdAt) : undefined,
      };
    }
    return {
      id: msg.messageId,
      fromMe,
      messageType: 'RESERVATION',
      reservation,
      time: msg.createdAt ? formatMessageTime(msg.createdAt) : undefined,
    };
  }

  return {
    id: msg.messageId,
    fromMe,
    messageType: msg.messageType,
    text: msg.messageType === 'IMAGE' ? '' : (msg.message ?? ''),
    time: msg.createdAt ? formatMessageTime(msg.createdAt) : undefined,
    imageUrls: msg.imageUrls,
  };
};

export const mapStompMessage = (payload: StompIncomingChatPayload, currentUserId?: number | null): Message | null => {
  if (payload.messageType === 'READ') return null;

  const senderId = payload.senderUserId ?? payload.senderId;
  const fromMe = currentUserId != null ? senderId === currentUserId : false;

  if (payload.messageType === 'RESERVATION') {
    const reservation = parseReservationPayload(payload.message);
    if (!reservation) {
      return {
        id: payload.messageId,
        fromMe,
        messageType: 'TEXT',
        text: payload.message ?? '',
        time: payload.createdAt ? formatMessageTime(payload.createdAt) : undefined,
      };
    }
    return {
      id: payload.messageId,
      fromMe,
      messageType: 'RESERVATION',
      reservation,
      time: payload.createdAt ? formatMessageTime(payload.createdAt) : undefined,
    };
  }

  return {
    id: payload.messageId,
    fromMe,
    messageType: payload.messageType,
    text: payload.messageType === 'IMAGE' ? '' : (payload.message ?? ''),
    time: payload.createdAt ? formatMessageTime(payload.createdAt) : undefined,
    imageUrls: payload.imageUrls,
  };
};

const convert = {
  mapApiMessage,
  mapStompMessage,
};

export default convert;
