import type { ChatMessageResponse, Message, StompIncomingChatPayload } from '@/src/types/chat';

export const formatTime = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
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
