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

export const formatChatRoomTime = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinute = String(minutes).padStart(2, '0');
  return `${period} ${displayHour}:${displayMinute}`;
};

export const formatMessageDateKey = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatChatDateLabel = (value?: string): string => {
  if (!value) return '';

  let date: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return '';
    date = new Date(year, month - 1, day);
  } else {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';
    date = parsed;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()] ?? '';

  return `${year}. ${month}. ${day} (${weekday})`;
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
  const dateKey = msg.createdAt ? formatMessageDateKey(msg.createdAt) : undefined;
  const read = msg.isRead ?? msg.read ?? false;

  if (msg.messageType === 'RESERVATION') {
    const reservation = parseReservationPayload(msg.message);
    if (!reservation) {
      return {
        id: msg.messageId,
        fromMe,
        messageType: 'TEXT',
        text: msg.message ?? '',
        time: msg.createdAt ? formatChatRoomTime(msg.createdAt) : undefined,
        dateKey,
        read,
      };
    }
    return {
      id: msg.messageId,
      fromMe,
      messageType: 'RESERVATION',
      reservation,
      time: msg.createdAt ? formatChatRoomTime(msg.createdAt) : undefined,
      dateKey,
      read,
    };
  }

  return {
    id: msg.messageId,
    fromMe,
    messageType: msg.messageType,
    text: msg.messageType === 'IMAGE' ? '' : (msg.message ?? ''),
    time: msg.createdAt ? formatChatRoomTime(msg.createdAt) : undefined,
    dateKey,
    read,
    imageUrls: msg.imageUrls,
  };
};

export const mapStompMessage = (payload: StompIncomingChatPayload, currentUserId?: number | null): Message | null => {
  if (payload.messageType === 'READ') return null;

  const senderId = payload.senderId;
  const fromMe = currentUserId != null ? senderId === currentUserId : false;
  const dateKey = payload.createdAt ? formatMessageDateKey(payload.createdAt) : undefined;
  const read = payload.isRead ?? payload.read ?? false;
  const resolvedRead = fromMe ? false : read;

  if (payload.messageType === 'RESERVATION') {
    const reservation = parseReservationPayload(payload.message);
    if (!reservation) {
      return {
        id: payload.messageId,
        fromMe,
        messageType: 'TEXT',
        text: payload.message ?? '',
        time: payload.createdAt ? formatChatRoomTime(payload.createdAt) : undefined,
        dateKey,
        read: resolvedRead,
      };
    }
    return {
      id: payload.messageId,
      fromMe,
      messageType: 'RESERVATION',
      reservation,
      time: payload.createdAt ? formatChatRoomTime(payload.createdAt) : undefined,
      dateKey,
      read: resolvedRead,
    };
  }

  return {
    id: payload.messageId,
    fromMe,
    messageType: payload.messageType,
    text: payload.messageType === 'IMAGE' ? '' : (payload.message ?? ''),
    time: payload.createdAt ? formatChatRoomTime(payload.createdAt) : undefined,
    dateKey,
    read: resolvedRead,
    imageUrls: payload.imageUrls,
  };
};

const convert = {
  mapApiMessage,
  mapStompMessage,
};

export default convert;
