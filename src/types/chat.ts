export type ChatRole = 'DESIGNER' | 'MODEL';
export type ChatMessageType = 'TEXT' | 'IMAGE' | 'RESERVATION';
export type SendChatMessageType = Exclude<ChatMessageType, 'RESERVATION'>;

export type ReservationEventType =
  | 'CHANGE_REQUEST'
  | 'CHANGE_REJECTED'
  | 'CHANGE_PROCEED'
  | 'CHANGE_CANCEL'
  | 'RESERVATION_CANCEL';

export type ReservationMessagePayload =
  | {
      eventType: 'CHANGE_REQUEST';
      reservationChangeId: number;
      reservationId: number;
      oldDate: string;
      oldStartTime: string;
      oldEndTime: string;
      newDate: string;
      newStartTime: string;
      newEndTime: string;
      reason: string;
    }
  | {
      eventType: 'CHANGE_REJECTED';
      reservationChangeId: number;
      notice: string;
    }
  | {
      eventType: 'CHANGE_PROCEED';
      reservationChangeId: number;
      reservationId: number;
      date: string;
      startTime: string;
      endTime: string;
      notice: string;
    }
  | {
      eventType: 'CHANGE_CANCEL';
      reservationChangeId: number;
      reservationId: number;
      date: string;
      startTime: string;
      endTime: string;
      notice: string;
    }
  | {
      eventType: 'RESERVATION_CANCEL';
      reservationId: number;
      date: string;
      startTime: string;
      endTime: string;
      reason: string;
      notice: string;
    };

export type Message = {
  id: number | string;
  fromMe: boolean;
  messageType: ChatMessageType;
  text?: string;
  time?: string;
  dateKey?: string;
  read?: boolean;
  imageUrls?: string[];
  reservation?: ReservationMessagePayload | null;
  pending?: boolean; // 전송 대기 표시용(optimistic UI)
  failed?: boolean; // 전송 실패 표시용(optimistic UI)
};

export interface ChatRoomSummary {
  roomId: number;
  otherUserId: number;
  name: string;
  nickname?: string;
  profileImageUrl: string;
  category?: string;
  messageType: ChatMessageType;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
  role: ChatRole;
}

export type ChatRoomListResponse = ChatRoomSummary[];

export interface ChatOpponent {
  userId: number;
  name: string;
  profileImageUrl: string;
  role: ChatRole;
}

export interface ChatMessageResponse {
  messageId: number;
  senderUserId: number;
  messageType: ChatMessageType;
  message?: string | null;
  imageUrls?: string[];
  createdAt: string;
  read: boolean;
  isRead?: boolean;
}

export interface ChatRoomDetailResponse {
  roomId: number;
  opponent: ChatOpponent;
  messages: ChatMessageResponse[];
  nextCursorMessageId?: number;
  hasNext: boolean;
  lastReadMessageId?: number;
}

export interface ChatRoomReservationSummary {
  reservationId?: number; // fallback (현재 API 응답에 없음)
  recruitmentId: number | null;
  recruitmentTitle: string | null;
  date: string;
  startTime: string;
  endTime: string;
  opponentUserId: number;
  opponentName: string;
}

export interface ChatRoomReservationSummaryResponse {
  hasReservation: boolean;
  reservation: ChatRoomReservationSummary | null;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  imageUrl: string;
}

export interface CreateChatRoomResponse {
  chatRoomId: number;
}

export interface SendChatMessagePayload {
  messageType: SendChatMessageType;
  message?: string | null;
  imageUrls?: string[] | null;
}

export interface ReadChatPayload {
  lastMessageId: number;
}

// STOMP 수신 이벤트 타입 (TEXT/IMAGE 메시지, READ 이벤트)
export type StompIncomingChatPayload =
  | {
      messageType: ChatMessageType;
      messageId: number;
      chatRoomId: number;
      senderId?: number;
      message?: string;
      imageUrls?: string[];
      createdAt?: string;
      read?: boolean;
      isRead?: boolean;
    }
  | {
      messageType: 'READ';
      chatRoomId: number;
      readerUserId: number;
      lastReadMessageId: number;
    };
