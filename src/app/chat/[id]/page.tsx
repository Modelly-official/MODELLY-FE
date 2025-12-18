"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import ChatHeader from '@/src/components/chat/chatroom/ChatHeader';
import MessageItem from '@/src/components/chat/chatroom/MessageItem';
import ChatInput from '@/src/components/chat/chatroom/ChatInput';

interface Message {
  id: number;
  fromMe: boolean;
  text: string;
  time: string;
}

const mockChats = [
  { id: '1', name: '유민지' },
  { id: '2', name: '박예린' },
  { id: '3', name: '윤서진' },
];

export default function ChatRoom() {
  const routeParams = useParams();
  const id = routeParams?.id;
  const chat = mockChats.find((c) => c.id === id) ?? { id: id ?? '', name: '대화' };

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, fromMe: false, text: '안녕하세요!', time: '18:00' },
    { id: 2, fromMe: true, text: '안녕하세요, 예약 도와드릴게요.', time: '18:02' },
    { id: 3, fromMe: false, text: '네 감사합니다.', time: '18:05' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const next: Message = {
      id: Date.now(),
      fromMe: true,
      text,
      time,
    };
    setMessages((m) => [...m, next]);
    setInput('');
  };

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
