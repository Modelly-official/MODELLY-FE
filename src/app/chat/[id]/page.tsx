"use client";

import { useParams } from 'next/navigation';
import ChatHeader from '@/src/components/chat/chatroom/ChatHeader';
import MessageItem from '@/src/components/chat/chatroom/MessageItem';
import ChatInput from '@/src/components/chat/chatroom/ChatInput';
import useChatRoom from '@/src/hooks/chat/useChatRoom';
import { mockChats } from '@/src/constants/chat';

export default function ChatRoom() {
  const routeParams = useParams();
  const id = routeParams?.id;
  const chat = mockChats.find((c) => String(c.id) === String(id)) ?? { id: id ?? '', name: '대화' };

  const { messages, input, setInput, sendMessage } = useChatRoom();

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      <ChatHeader title={chat.name} />
      <main className="flex-1 overflow-auto px-4 py-3">
        <ul className="space-y-3">
          {messages.map((m, idx) => {
            const next = messages[idx + 1];
            const showTime = !next || next.time !== m.time;
            return (
              <MessageItem key={m.id} message={m} showTime={showTime} />
            );
          })}
        </ul>
      </main>
      <ChatInput value={input} onChange={setInput} onSend={sendMessage} />
    </div>
  );
}
