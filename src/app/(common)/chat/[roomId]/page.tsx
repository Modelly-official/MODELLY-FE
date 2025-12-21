'use client';

import { useParams } from 'next/navigation';
import ChatHeader from '@/src/components/chat/chatroom/ChatHeader';
import MessageItem from '@/src/components/chat/chatroom/MessageItem';
import ChatInput from '@/src/components/chat/chatroom/ChatInput';
import useChatRoom from '@/src/hooks/chat/useChatRoom';
import { useEffect, useRef } from 'react';

export default function ChatRoom() {
  const routeParams = useParams();
  const roomIdParam = routeParams?.roomId;
  const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;

  const { messages, input, setInput, sendMessage } = useChatRoom(roomId);
  const title = roomId ? `채팅방 ${roomId}` : '채팅';

  const containerRef = useRef<HTMLElement | null>(null);
  const isInitialScroll = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const last = messages[messages.length - 1];

    // 초기 스크롤 또는 새 메시지 도착 시 스크롤 처리
    if (isInitialScroll.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
      isInitialScroll.current = false;
      return;
    }
    const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    const atBottom = distanceFromBottom < 150; // threshold in px
    if (last?.fromMe || atBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages.length, messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <ChatHeader title={title} />
      <main ref={containerRef} className="flex-1 overflow-auto px-4 py-3">
        <ul className="space-y-3">
          {messages.map((m, idx) => {
            const next = messages[idx + 1];
            const showTime = !next || next.time !== m.time;
            return <MessageItem key={m.id} message={m} showTime={showTime} />;
          })}
        </ul>
      </main>
      <ChatInput value={input} onChange={setInput} onSend={sendMessage} />
    </div>
  );
}
