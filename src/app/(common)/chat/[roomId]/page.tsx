'use client';

import { useParams } from 'next/navigation';
import ChatHeader from '@/src/components/chat/chatroom/ChatHeader';
import MessageItem from '@/src/components/chat/chatroom/MessageItem';
import ChatInput from '@/src/components/chat/chatroom/ChatInput';
import useChatRoom from '@/src/hooks/custom/chat/useChatRoom';
import { useLayoutEffect, useRef } from 'react';

export default function ChatRoom() {
  const routeParams = useParams();
  const roomIdParam = routeParams?.roomId;
  const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;

  const { messages, opponent, input, setInput, sendMessage, sendImage, fetchPrevMessages, hasNext, loading } =
    useChatRoom(roomId);
  const headerTitle = opponent?.name ?? '';

  const containerRef = useRef<HTMLElement | null>(null);
  const isInitialScroll = useRef(true);
  const prevScrollHeightRef = useRef<number | null>(null);
  const prevScrollTopRef = useRef<number | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);

  // 초기 스크롤 또는 새 메시지 도착 시 스크롤 처리
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. 최초 진입: messages가 0에서 1 이상이 되는 순간에만 스크롤
    if (isInitialScroll.current && prevMessagesLengthRef.current === 0 && messages.length > 0) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
        isInitialScroll.current = false;
      }, 30);
      prevMessagesLengthRef.current = messages.length;
      return;
    }

    // 2. 무한 스크롤로 messages가 늘어난 경우 위치 보정
    if (
      prevScrollHeightRef.current !== null &&
      prevScrollTopRef.current !== null &&
      messages.length > prevMessagesLengthRef.current
    ) {
      const diff = container.scrollHeight - prevScrollHeightRef.current;
      requestAnimationFrame(() => {
        container.scrollTop = prevScrollTopRef.current! + diff;
      });
      prevScrollHeightRef.current = null;
      prevScrollTopRef.current = null;
      prevMessagesLengthRef.current = 0;
      return;
    }

    const last = messages[messages.length - 1];

    // 내가 보낸 메시지 or 스크롤이 아래쪽에 있을 때만 자동 스크롤
    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    const atBottom = distanceFromBottom < 150;
    if (last?.fromMe || atBottom) {
      requestAnimationFrame(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [messages]);

  // 무한 스크롤: 맨 위 도달 시 과거 메시지 불러오기
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container || loading || !hasNext) return;
    if (container.scrollTop <= 20) {
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;
      prevMessagesLengthRef.current = messages.length;
      fetchPrevMessages();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <ChatHeader title={headerTitle} />
      <main ref={containerRef} className="flex-1 overflow-auto px-4 py-3 scrollbar-hide" onScroll={handleScroll}>
        <ul className="space-y-3">
          {messages.map((m, idx) => {
            const next = messages[idx + 1];
            const showTime = !next || next.time !== m.time;
            return <MessageItem key={m.id} message={m} showTime={showTime} />;
          })}
        </ul>
      </main>
      <ChatInput value={input} onChange={setInput} onSend={sendMessage} onImageSelect={sendImage} />
    </div>
  );
}
