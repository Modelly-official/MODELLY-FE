'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Client, StompSubscription } from '@stomp/stompjs';
import { getChatMessages } from '@/src/apis';
import { createChatStompClient, publishMessage, publishRead, subscribeRoom } from '@/src/lib/chat/stompClient';
import { getAccessToken, useAuthStore } from '@/src/stores';
import type { ChatMessageResponse, Message, SendChatMessagePayload, StompIncomingChatPayload } from '@/src/types/chat';

const formatTime = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const mapApiMessage = (msg: ChatMessageResponse, currentUserId?: number | null): Message => ({
  id: msg.messageId,
  fromMe: currentUserId ? msg.senderUserId === currentUserId : false,
  text: msg.messageType === 'IMAGE' ? '이미지' : (msg.message ?? ''),
  time: msg.createdAt ? formatTime(msg.createdAt) : undefined,
});

const mapStompMessage = (payload: StompIncomingChatPayload, currentUserId?: number | null): Message | null => {
  if (payload.messageType === 'READ') return null;

  const senderId = payload.senderUserId ?? payload.senderId;
  return {
    id: payload.messageId,
    fromMe: currentUserId ? senderId === currentUserId : false,
    text: payload.messageType === 'IMAGE' ? '이미지' : (payload.message ?? ''),
    time: payload.createdAt ? formatTime(payload.createdAt) : undefined,
  };
};

// JWT payload에서 userId를 추출 (스토어에 없을 때 fallback)
const parseUserIdFromToken = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const id = payload.userId ?? payload.sub ?? payload.id;
    const num = typeof id === 'string' ? Number(id) : id;
    return Number.isFinite(num) ? num : null;
  } catch (err) {
    console.warn('token parse failed', err);
    return null;
  }
};

export default function useChatRoom(roomId?: string | number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const currentUserId = useAuthStore((state) => state.user?.userId);
  const token = getAccessToken();
  const fallbackUserId = useMemo(() => parseUserIdFromToken(token), [token]);
  const effectiveUserId = currentUserId ?? fallbackUserId;
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const lastMessageIdRef = useRef<string | number | null>(null);

  // 초기 메시지 로드
  useEffect(() => {
    if (!roomId) return undefined;
    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getChatMessages(roomId, { size: 30 });
        if (!active) return;

        if (!res.isSuccess || !res.result) {
          throw new Error(res.message || '채팅을 불러오지 못했습니다.');
        }

        const mapped = res.result.messages?.map((m) => mapApiMessage(m, effectiveUserId)) ?? [];
        setMessages(mapped);

        // 최초 진입 시 서버가 unread 읽음 처리
      } catch (err) {
        if (!active) return;
        setError('메시지를 불러오지 못했습니다.');
        console.error('load chat messages error', err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [roomId, effectiveUserId]);

  // 마지막 메시지 id 추적 (READ 처리용)
  useEffect(() => {
    const last = messages[messages.length - 1];
    lastMessageIdRef.current = last ? last.id : null;
  }, [messages]);

  // STOMP 연결 및 구독
  useEffect(() => {
    if (!roomId) return undefined;
    const token = getAccessToken();
    if (!token) return undefined;

    const client = createChatStompClient(token);
    if (!client) return undefined;

    clientRef.current = client;

    const baseOnConnect = client.onConnect;
    client.onConnect = (frame) => {
      baseOnConnect?.(frame);
      setConnected(true);
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = subscribeRoom<StompIncomingChatPayload>(client, roomId, (payload) => {
        const mapped = mapStompMessage(payload, effectiveUserId);
        if (!mapped) return;
        setMessages((prev) => {
          // 서버 에코로 동일 id가 올 때 중복 추가 방지
          if (prev.some((m) => m.id === mapped.id)) return prev;

          const next = [...prev];
          // 내가 보낸 메시지면 낙관적 temp 메시지를 치환
          if (mapped.fromMe) {
            const tempIdx = next.findIndex(
              (m) => String(m.id).startsWith('temp-') && m.fromMe && m.text === mapped.text,
            );
            if (tempIdx >= 0) {
              next.splice(tempIdx, 1);
            }
          }
          return [...next, mapped];
        });
      });

      // 방에 입장/재연결 시 현재 마지막 메시지까지 읽음 처리
      const lastMessageId = lastMessageIdRef.current;
      if (typeof lastMessageId === 'number') {
        publishRead(client, roomId, lastMessageId);
      }
    };

    client.onDisconnect = () => {
      setConnected(false);
    };

    client.onStompError = () => {
      setConnected(false);
    };

    client.activate();

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [roomId, effectiveUserId]);

  const sendMessage = useCallback(() => {
    if (!roomId) return;
    const text = input.trim();
    if (!text) return;

    const client = clientRef.current;
    if (!client || !connected) {
      setError('채팅 서버에 연결되지 않았습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const now = new Date().toISOString();
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      fromMe: true,
      text,
      time: formatTime(now),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput('');

    const payload: SendChatMessagePayload = {
      messageType: 'TEXT',
      message: text,
      imageUrls: null,
    };

    try {
      publishMessage(client, roomId, payload);
    } catch (err) {
      // 실패 시 낙관적 메시지 롤백
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
      console.error('send message error', err);
      setError('메시지 전송에 실패했습니다.');
    }
  }, [input, roomId, connected]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    loading,
    error,
  } as const;
}
