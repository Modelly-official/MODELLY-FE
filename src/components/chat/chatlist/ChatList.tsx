"use client";

import { useState } from 'react';
import ChatListItem from "./ChatListItem";
import ChatSearch from "./ChatSearch";
import { mockChats as initialChats } from '@/src/constants/chat';

export default function ChatList() {
  // 클라이언트 상태로 관리해서 새 메시지 수신 시 UI를 즉시 업데이트할 수 있도록
  const [chats, setChats] = useState(initialChats);

  // 테스트용: 특정 채팅에 새 메시지가 왔을 때 동작 시뮬레이션
  const simulateIncomingMessage = (chatId: number) => {
    setChats((prev) => {
      const idx = prev.findIndex((c) => c.id === chatId);
      if (idx === -1) return prev;
      const target = prev[idx];
      const updated = {
        ...target,
        unread: (target.unread ?? 0) + 1,
        lastMessage: '새로운 메시지가 도착했습니다',
        lastTime: '지금',
      };
      // 새 메시지가 오면 대화를 목록 맨 위로 올림
      return [updated, ...prev.filter((c) => c.id !== chatId)];
    });
  };

  return (
    <>
      <ChatSearch />
      {/* 테스트 버튼: 실제 API/WebSocket 연동 전 동작 확인용 */}
      <div className="px-4 py-2">
        <button
          type="button"
          className="text-sm text-blue-600"
          onClick={() => simulateIncomingMessage(3)}
        >
          id=3에 새 메시지 도착
        </button>
      </div>
      <ul>
        {chats.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} />
        ))}
      </ul>
    </>
  );
}
