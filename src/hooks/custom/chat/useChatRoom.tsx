'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StompSubscription } from '@stomp/stompjs';
import { getChatMessages } from '@/src/apis/chat/chat';
import { publishMessage, publishRead, subscribeRoom } from '@/src/utils/chat';
import useStompClient from '@/src/hooks/custom/chat/useStompClient';
import useChatImage from '@/src/hooks/custom/chat/useChatImage';
import { getAccessToken, useAuthStore } from '@/src/stores';
import {
  mapApiMessage,
  mapStompMessage,
  formatMessageDateKey,
  formatMessageTime,
} from '@/src/utils/chat/messageConverter';
import { parseUserIdFromToken } from '@/src/utils/auth/token';
import type { ChatOpponent, Message, SendChatMessagePayload, StompIncomingChatPayload } from '@/src/types/chat';

// 채팅방 관련 훅
// 서버에서 초기 메시지 로드, STOMP를 통해 실시간 메시지 구독/수신
// 텍스트/이미지 전송(낙관적 UI 포함) 및 읽음(READ) 처리
export default function useChatRoom(roomId?: string | number) {
  const SEND_TIMEOUT_MS = 3000;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<ChatOpponent | null>(null);
  // 무한 스크롤용 상태
  const [hasNext, setHasNext] = useState(true);
  const [nextCursorMessageId, setNextCursorMessageId] = useState<number | null>(null);

  const currentUserId = useAuthStore((state) => state.user?.userId);
  const token = getAccessToken();
  const fallbackUserId = useMemo(() => parseUserIdFromToken(token), [token]);
  const effectiveUserId = currentUserId ?? fallbackUserId;
  const { clientRef, connected: stompConnected } = useStompClient();
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const lastMessageIdRef = useRef<string | number | null>(null);
  const pendingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingQueueRef = useRef<{ id: string; payload: SendChatMessagePayload }[]>([]);

  const { sendImage: sendImageInternal, sendingImage } = useChatImage({
    roomId,
    clientRef,
    stompConnected,
  });

  const showError = useCallback((message: string) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    setError(message);
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
      errorTimeoutRef.current = null;
    }, 3000);
  }, []);

  const flushPendingSends = useCallback(() => {
    if (!roomId) return;
    const client = clientRef.current;
    if (!client || !stompConnected) return;

    while (pendingQueueRef.current.length > 0) {
      const { id, payload } = pendingQueueRef.current[0];
      try {
        publishMessage(client, roomId, payload);
      } catch (err) {
        console.error('flush send error', err);
        break;
      }
      const timeout = setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, pending: false, failed: true } : m)));
        pendingTimeoutsRef.current.delete(id);
      }, SEND_TIMEOUT_MS);
      pendingTimeoutsRef.current.set(id, timeout);
      pendingQueueRef.current.shift();
    }
  }, [clientRef, roomId, stompConnected]);

  // 초기 메시지 로드
  // 컴포넌트(또는 방 변경) 시 서버에서 최근 메시지를 가져와 messages를 초기화
  // 과거 메시지 불러오기 (무한 스크롤)
  const fetchPrevMessages = useCallback(async () => {
    if (!roomId || !hasNext || !nextCursorMessageId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getChatMessages(roomId, { cursorMessageId: nextCursorMessageId, size: 20 });
      if (!res.isSuccess || !res.result) {
        throw new Error(res.message || '이전 메시지를 불러오지 못했습니다.');
      }
      const mapped = res.result.messages?.map((m) => mapApiMessage(m, effectiveUserId)) ?? [];
      setMessages((prev) => [...mapped, ...prev]);
      setHasNext(res.result.hasNext ?? false);
      setNextCursorMessageId(res.result.nextCursorMessageId ?? null);
    } catch (err) {
      showError('이전 메시지를 불러오지 못했습니다.');
      console.error('fetchPrevMessages error', err);
    } finally {
      setLoading(false);
    }
  }, [roomId, hasNext, nextCursorMessageId, effectiveUserId, showError]);

  useEffect(() => {
    if (!roomId) return undefined;
    let active = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getChatMessages(roomId, { size: 20 });
        if (!active) return;

        if (!res.isSuccess || !res.result) {
          throw new Error(res.message || '채팅을 불러오지 못했습니다.');
        }

        const mapped = res.result.messages?.map((m) => mapApiMessage(m, effectiveUserId)) ?? [];
        setMessages(mapped);
        setOpponent(res.result.opponent ?? null);
        setHasNext(res.result.hasNext ?? false);
        setNextCursorMessageId(res.result.nextCursorMessageId ?? null);
        // 최초 진입 시 서버가 unread 읽음 처리
      } catch (err) {
        if (!active) return;
        showError('메시지를 불러오지 못했습니다.');
        console.error('load chat messages error', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [roomId, effectiveUserId, showError]);

  // 마지막 메시지 id 추적 (READ 처리용)
  // 마지막 메시지 id는 방 입장/재연결 시 서버에 읽음 위치를 알리기 위해 사용
  useEffect(() => {
    const last = messages[messages.length - 1];
    lastMessageIdRef.current = last ? last.id : null;
  }, [messages]);

  useEffect(() => {
    if (stompConnected) {
      flushPendingSends();
    }
  }, [stompConnected, flushPendingSends]);

  // STOMP 연결 및 구독: 핸들러 직접 덮어쓰기 없이 stompConnected 상태 기반으로 구독/해제만 담당
  useEffect(() => {
    if (!roomId) return undefined;
    const client = clientRef?.current;
    if (!client || !stompConnected) return undefined;

    // 연결되어 있으면 바로 구독
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
            // 타임아웃 정리
            const timeout = pendingTimeoutsRef.current.get(String(temp.id));
            if (timeout) {
              clearTimeout(timeout);
              pendingTimeoutsRef.current.delete(String(temp.id));
            }
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

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [roomId, effectiveUserId, stompConnected, clientRef]);

  useEffect(() => {
    const timeouts = pendingTimeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (!roomId) return;
    const text = input.trim();
    if (!text) return;

    const client = clientRef.current;
    const connected = !!client && stompConnected;

    const now = new Date().toISOString();
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      fromMe: true,
      messageType: 'TEXT',
      text,
      time: formatMessageTime(now),
      dateKey: formatMessageDateKey(now),
      pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput('');

    const payload: SendChatMessagePayload = {
      messageType: 'TEXT',
      message: text,
      imageUrls: null,
    };

    if (!connected) {
      pendingQueueRef.current.push({ id: String(optimistic.id), payload });
      return;
    }

    const timeout = setTimeout(() => {
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? { ...m, pending: false, failed: true } : m)));
      pendingTimeoutsRef.current.delete(String(optimistic.id));
    }, SEND_TIMEOUT_MS); // 제한 시간 내 서버 응답 없으면 실패로 간주
    pendingTimeoutsRef.current.set(String(optimistic.id), timeout);

    try {
      publishMessage(client, roomId, payload);
    } catch (err) {
      // 동기적 에러(연결 해제 등)만 잡힘
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
      clearTimeout(timeout);
      pendingTimeoutsRef.current.delete(String(optimistic.id));
      console.error('send message error', err);
      showError('메시지 전송에 실패했습니다.');
      return;
    }

    // 연결 유지 시 즉시 큐 비움 (동시에 호출해 중복 방지)
    flushPendingSends();
  }, [input, roomId, stompConnected, clientRef, showError, flushPendingSends]);

  const sendImage = useCallback(
    async (file: File) => {
      if (!roomId) return;
      const now = new Date().toISOString();
      const tempId = `temp-${Date.now()}`;
      const objectUrl = URL.createObjectURL(file);
      const optimistic: Message = {
        id: tempId,
        fromMe: true,
        messageType: 'IMAGE',
        text: '',
        time: formatMessageTime(now),
        dateKey: formatMessageDateKey(now),
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
        showError('이미지 전송에 실패했습니다.');
      }
    },
    [roomId, sendImageInternal, showError],
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
    fetchPrevMessages,
    hasNext,
    nextCursorMessageId,
  } as const;
}
