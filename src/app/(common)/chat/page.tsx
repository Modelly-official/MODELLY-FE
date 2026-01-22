'use client';

import { useEffect, useMemo, useState } from 'react';
import ChatCategoryChips from '@/src/components/chat/chatlist/ChatCategoryChips';
import ChatList from '@/src/components/chat/chatlist/ChatList';
import { useChatRooms } from '@/src/hooks/queries/chat';
import { useToast } from '@/src/hooks/common/useToast';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { LoginRequiredModal } from '@/src/components/common';

export default function ChatPage() {
  const { showToast } = useToast();
  const { isLoggedIn, authReady, role } = useAuthReady();
  const userRole = role;
  const [modalDismissed, setModalDismissed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const requestCategory = selectedCategory === 'ALL' ? undefined : selectedCategory;

  // 비로그인 상태이고 모달을 닫지 않은 경우 표시
  const showLoginModal = authReady && !isLoggedIn && !modalDismissed;

  // 인증된 경우에만 API 호출 (무한 스크롤)
  const { data, isLoading, isFetching, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatRooms({
    enabled: isLoggedIn,
    category: requestCategory,
  });

  // 모든 페이지의 채팅방을 하나의 배열로 합침
  const allChats = useMemo(() => {
    return data?.pages.flatMap((page) => page.result ?? []) ?? [];
  }, [data?.pages]);
  const inferredRole = useMemo(() => {
    const hasDesignerOpponent = allChats.some((chat) => chat.role === 'DESIGNER');
    const hasModelOpponent = allChats.some((chat) => chat.role === 'MODEL');
    if (hasDesignerOpponent && !hasModelOpponent) return 'model';
    if (hasModelOpponent && !hasDesignerOpponent) return 'designer';
    return null;
  }, [allChats]);
  const resolvedRole = userRole ?? inferredRole;
  const isModelUser = resolvedRole === 'model';
  const isListLoading = !authReady || isLoading || (isFetching && allChats.length === 0);

  // 채팅방은 생성된 채로 메세지가 없는 경우, 채팅방 리스트에 뜨는 것을 방지
  const visibleChats = useMemo(() => {
    return allChats.filter(
      (chat) => chat.lastMessageTime != null && chat.lastMessage != null && chat.messageType != null,
    );
  }, [allChats]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      showToast('채팅 목록을 불러오지 못했습니다.');
    }
  }, [error, showToast]);

  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-head-3-semibold px-5 py-3">채팅</h1>
      {isModelUser && <ChatCategoryChips selectedCategory={selectedCategory} onChange={setSelectedCategory} />}
      <ChatList
        chats={visibleChats}
        isLoading={isListLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
      <LoginRequiredModal isOpen={showLoginModal} onClose={() => setModalDismissed(true)} callbackUrl="/chat" />
    </div>
  );
}
