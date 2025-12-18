"use client";

import { useState } from 'react';
import ChatListItem from "./ChatListItem";
import ChatSearch from "./ChatSearch";

// 목업 데이터 (추후 삭제 예정)
const mockChats = [
  {
    id: 1,
    name: "유민지",
    profileImage: "",
    lastMessage: "안녕하세요! 예약 가능할까요? 블라블라 어쩌구 저쩌구",
    lastTime: "18:30",
    unread: 2,
  },
  {
    id: 2,
    name: "박예린",
    profileImage: "",
    lastMessage: "네! 가능합니다 :)",
    lastTime: "18:10",
    unread: 0,
  },
  {
    id: 3,
    name: "윤서진",
    profileImage: "",
    lastMessage: "내일 뵐게요~",
    lastTime: "어제",
    unread: 1,
  },
];

export default function ChatList() {
  // 클라이언트 상태로 관리해서 새 메시지 수신 시 UI를 즉시 업데이트할 수 있도록
  const [chats, setChats] = useState(mockChats);

  // 테스트용: 특정 채팅에 새 메시지가 왔을 때 동작 시뮬레이션
  const simulateIncomingMessage = (chatId: number) => {
    setChats((prev) => {
      const idx = prev.findIndex((c) => c.id === chatId);
      if (idx === -1) return prev;
      const target = prev[idx];
      const updated = {
        ...target,
        unread: target.unread + 1,
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
