'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import ChatList from '@/src/components/chat/chatlist/ChatList';
import ChatSearch from '@/src/components/chat/chatlist/ChatSearch';
import { useChatRooms } from '@/src/hooks/queries/chat';
import { useToast } from '@/src/hooks/common/useToast';
import { getAccessToken } from '@/src/stores';
import LoginRequiredModal from '@/src/components/common/LoginRequiredModal';
import BottomNav from '@/src/components/common/BottomNav';

// 클라이언트에서만 인증 상태 확인 (hydration mismatch 방지)
const subscribeToAuth = () => () => {};
const getAuthSnapshot = () => !!getAccessToken();
const getServerSnapshot = () => false;

export default function ChatPage() {
  const { showToast } = useToast();
  const isAuthenticated = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerSnapshot);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [modalDismissed, setModalDismissed] = useState(false);

  // 비로그인 상태이고 모달을 닫지 않은 경우 표시
  const showLoginModal = !isAuthenticated && !modalDismissed;

  // 인증된 경우에만 API 호출
  const { data, isLoading, error } = useChatRooms({ enabled: isAuthenticated });

  // 검색 필터링
  const filteredChats = useMemo(() => {
    const chatList = data?.result ?? [];
    if (!searchKeyword) return chatList;
    return chatList.filter((chat) => chat.name.toLowerCase().includes(searchKeyword.toLowerCase()));
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
      <BottomNav />
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setModalDismissed(true)}
        callbackUrl="/chat"
      />
    </div>
  );
}
