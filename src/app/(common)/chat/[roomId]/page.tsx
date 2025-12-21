'use client';

import { useParams } from 'next/navigation';
import ChatHeader from '@/src/components/chat/chatroom/ChatHeader';
import MessageItem from '@/src/components/chat/chatroom/MessageItem';
import ChatInput from '@/src/components/chat/chatroom/ChatInput';
import useChatRoom from '@/src/hooks/chat/useChatRoom';
import { useLayoutEffect, useRef } from 'react';

export default function ChatRoom() {
  const routeParams = useParams();
  const roomIdParam = routeParams?.roomId;
  const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;

  const { messages, opponent, input, setInput, sendMessage, sendImage } = useChatRoom(roomId);
  const headerTitle = opponent?.name ?? '';

  const containerRef = useRef<HTMLElement | null>(null);
  const isInitialScroll = useRef(true);

  // 초기 스크롤 또는 새 메시지 도착 시 스크롤 처리
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const last = messages[messages.length - 1];

    if (isInitialScroll.current) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        isInitialScroll.current = false;
      });
      return;
    }

    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    const atBottom = distanceFromBottom < 150;
    if (last?.fromMe || atBottom) {
      requestAnimationFrame(() => container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' }));
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <ChatHeader title={headerTitle} />
      <main ref={containerRef} className="flex-1 overflow-auto px-4 py-3">
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
