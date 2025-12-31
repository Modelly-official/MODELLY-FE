'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import ChatList from '@/src/components/chat/chatlist/ChatList';
import { SearchInput } from '@/src/components/common';
import { useChatRooms } from '@/src/hooks/queries/chat';
import { useToast } from '@/src/hooks/common/useToast';
import { getAccessToken } from '@/src/stores';
import { LoginRequiredModal } from '@/src/components/common';
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

  // 인증된 경우에만 API 호출 (무한 스크롤)
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatRooms({
    enabled: isAuthenticated,
  });

  // 모든 페이지의 채팅방을 하나의 배열로 합침
  const allChats = useMemo(() => {
    return data?.pages.flatMap((page) => page.result ?? []) ?? [];
  }, [data?.pages]);

  // 검색 필터링
  const filteredChats = useMemo(() => {
    if (!searchKeyword) return allChats;
    return allChats.filter((chat) => chat.name.toLowerCase().includes(searchKeyword.toLowerCase()));
  }, [allChats, searchKeyword]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      showToast('채팅 목록을 불러오지 못했습니다.');
    }
  }, [error, showToast]);

  return (
    <div className="min-h-screen bg-white pb-20 pt-[env(safe-area-inset-top)]">
      <h1 className="text-head-2-semibold px-5 py-3">채팅</h1>
      <SearchInput
        onSearch={setSearchKeyword}
        placeholder="검색하기"
        className="mx-4 mt-2 mb-4"
      />
      <ChatList
        chats={filteredChats}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
      <BottomNav />
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setModalDismissed(true)} callbackUrl="/chat" />
    </div>
  );
}
