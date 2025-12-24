import type { ChatMessageResponse, Message, StompIncomingChatPayload } from '@/src/types/chat';

export const formatTime = (value?: string) => {
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
    return formatTime(isoString);
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

export const mapApiMessage = (msg: ChatMessageResponse, currentUserId?: number | null): Message => ({
  id: msg.messageId,
  fromMe: currentUserId != null ? msg.senderUserId === currentUserId : false,
  text: msg.messageType === 'IMAGE' ? '' : (msg.message ?? ''),
  time: msg.createdAt ? formatTime(msg.createdAt) : undefined,
  imageUrls: msg.imageUrls,
});

export const mapStompMessage = (payload: StompIncomingChatPayload, currentUserId?: number | null): Message | null => {
  if (payload.messageType === 'READ') return null;

  const senderId = payload.senderUserId ?? payload.senderId;
  return {
    id: payload.messageId,
    fromMe: currentUserId != null ? senderId === currentUserId : false,
    text: payload.messageType === 'IMAGE' ? '' : (payload.message ?? ''),
    time: payload.createdAt ? formatTime(payload.createdAt) : undefined,
    imageUrls: payload.imageUrls,
  };
};

const convert = {
  mapApiMessage,
  mapStompMessage,
};

export default convert;
