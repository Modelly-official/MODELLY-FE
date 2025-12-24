'use client';

import { useEffect, useMemo, useState } from 'react';
import ChatList from '@/src/components/chat/chatlist/ChatList';
import ChatSearch from '@/src/components/chat/chatlist/ChatSearch';
import { useChatRooms } from '@/src/hooks/queries/chat';
import { useToast } from '@/src/hooks/common/useToast';

export default function ChatPage() {
  const { showToast } = useToast();
  const { data, isLoading, error } = useChatRooms();
  const [searchKeyword, setSearchKeyword] = useState('');

  // 검색 필터링
  const filteredChats = useMemo(() => {
    const chatList = data?.result ?? [];
    if (!searchKeyword) return chatList;
    return chatList.filter((chat) =>
      chat.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [data?.result, searchKeyword]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      showToast('채팅 목록을 불러오지 못했습니다.');
    }
  }, [error, showToast]);

  return (
    <div className="min-h-screen bg-white pt-3">
      <h1 className="text-head-2-semibold px-5 py-3">채팅</h1>
      <ChatSearch onSearch={setSearchKeyword} />
      <ChatList chats={filteredChats} isLoading={isLoading} />
    </div>
  );
}
