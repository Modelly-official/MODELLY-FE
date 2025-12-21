'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StompSubscription } from '@stomp/stompjs';
import { getChatMessages } from '@/src/apis/chat/chat';
import { publishMessage, publishRead, subscribeRoom } from '@/src/lib/chat';
import useStompClient from '@/src/hooks/chat/useStompClient';
import useChatImage from '@/src/hooks/chat/useChatImage';
import { getAccessToken, useAuthStore } from '@/src/stores';
import { mapApiMessage, mapStompMessage, formatTime } from '@/src/utils/chat/convert';
import { parseUserIdFromToken } from '@/src/utils/auth/token';
import type { ChatOpponent, Message, SendChatMessagePayload, StompIncomingChatPayload } from '@/src/types/chat';

// 채팅방 관련 훅
// 서버에서 초기 메시지 로드, STOMP를 통해 실시간 메시지 구독/수신
// 텍스트/이미지 전송(낙관적 UI 포함) 및 읽음(READ) 처리
export default function useChatRoom(roomId?: string | number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<ChatOpponent | null>(null);

  const currentUserId = useAuthStore((state) => state.user?.userId);
  const token = getAccessToken();
  const fallbackUserId = useMemo(() => parseUserIdFromToken(token), [token]);
  const effectiveUserId = currentUserId ?? fallbackUserId;
  const { clientRef, connected: stompConnected } = useStompClient();
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const lastMessageIdRef = useRef<string | number | null>(null);

  const { sendImage: sendImageInternal, sendingImage } = useChatImage({
    roomId,
    clientRef,
    stompConnected,
  });

  // 초기 메시지 로드
  // 컴포넌트(또는 방 변경) 시 서버에서 최근 메시지를 가져와 messages를 초기화
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
        setOpponent(res.result.opponent ?? null);

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
  // 마지막 메시지 id는 방 입장/재연결 시 서버에 읽음 위치를 알리기 위해 사용
  useEffect(() => {
    const last = messages[messages.length - 1];
    lastMessageIdRef.current = last ? last.id : null;
  }, [messages]);

  // STOMP 연결 및 구독
  // STOMP 클라이언트의 onConnect에서 방을 구독하고, 수신되는 메시지를 messages에 반영
  useEffect(() => {
    if (!roomId) return undefined;
    const client = clientRef?.current;
    if (!client) return undefined;

    const baseOnConnect = client.onConnect;
    client.onConnect = (frame) => {
      baseOnConnect?.(frame);
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = subscribeRoom<StompIncomingChatPayload>(client, roomId, (payload) => {
        const mapped = mapStompMessage(payload, effectiveUserId);
        if (!mapped) return;
        setMessages((prev) => {
          // 서버 에코로 동일 id가 올 때 중복 추가 방지
          if (prev.some((m) => m.id === mapped.id)) return prev;

          const next = [...prev];
          // 내가 보낸 메시지면 낙관적 temp 메시지를 치환
          // 텍스트 메시지는 텍스트로 매칭, 이미지 메시지는 임시 blob URL을 가진 temp 항목과 매칭하여 자리 교체
          if (mapped.fromMe) {
            const tempIdx = next.findIndex((m) => {
              if (!String(m.id).startsWith('temp-') || !m.fromMe) return false;
              const mHasImages = (m.imageUrls?.length ?? 0) > 0;
              const mappedHasImages = (mapped.imageUrls?.length ?? 0) > 0;
              if (mHasImages && mappedHasImages) return true;
              if (!mHasImages && !mappedHasImages) return m.text === mapped.text;
              return false;
            });
            if (tempIdx >= 0) {
              const temp = next[tempIdx];
              const url = temp.imageUrls?.[0];
              // blob URL이면 해제하여 리소스 해제
              if (url && url.startsWith('blob:')) {
                try {
                  URL.revokeObjectURL(url);
                } catch {}
              }
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

    client.onDisconnect = () => {};

    client.onStompError = () => {};

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [roomId, effectiveUserId, stompConnected, clientRef]);

  const sendMessage = useCallback(() => {
    if (!roomId) return;
    const text = input.trim();
    if (!text) return;

    const client = clientRef.current;
    if (!client || !stompConnected) {
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
  }, [input, roomId, stompConnected, clientRef]);

  const sendImage = useCallback(
    async (file: File) => {
      if (!roomId) return;
      const now = new Date().toISOString();
      const tempId = `temp-${Date.now()}`;
      const objectUrl = URL.createObjectURL(file);
      const optimistic: Message = {
        id: tempId,
        fromMe: true,
        text: '',
        time: formatTime(now),
        imageUrls: [objectUrl],
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        await sendImageInternal(file);
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
        console.error('send image error', err);
        setError('이미지 전송에 실패했습니다.');
      }
    },
    [roomId, sendImageInternal],
  );

  return {
    messages,
    opponent,
    input,
    setInput,
    sendMessage,
    sendImage,
    loading,
    error,
    sendingImage,
  } as const;
}
