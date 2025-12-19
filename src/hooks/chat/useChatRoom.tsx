"use client";

import { useState } from 'react';
import { Message } from '@/src/types/chat';
import defaultMessages from '@/src/constants/messages';

export default function useChatRoom(initial?: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initial ?? defaultMessages);
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

  return {
    messages,
    setMessages,
    input,
    setInput,
    sendMessage,
  } as const;
}
