'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import ChatList from '@/src/components/chat/chatlist/ChatList';
import { useChatRooms } from '@/src/hooks/queries/chat';
import { useToast } from '@/src/hooks/common/useToast';
import { getAccessToken, getUserRole, useAuthStore } from '@/src/stores';
import { LoginRequiredModal } from '@/src/components/common';
import BottomNav from '@/src/components/common/BottomNav';

// 클라이언트에서만 인증 상태 확인 (hydration mismatch 방지)
const subscribeToAuth = () => () => {};
const getAuthSnapshot = () => !!getAccessToken();
const getServerSnapshot = () => false;

export default function ChatPage() {
  const { showToast } = useToast();
  const isAuthenticated = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerSnapshot);
  const roleFromStore = useAuthStore((state) => state.user?.role);
  const roleFromCookie = getUserRole();
  const userRole = roleFromStore ?? roleFromCookie;
  const isModelUser = userRole === 'model';
  const [modalDismissed, setModalDismissed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const requestCategory = selectedCategory === 'ALL' ? undefined : selectedCategory;

  // 비로그인 상태이고 모달을 닫지 않은 경우 표시
  const showLoginModal = !isAuthenticated && !modalDismissed;

  // 인증된 경우에만 API 호출 (무한 스크롤)
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatRooms({
    enabled: isAuthenticated,
    category: isModelUser ? requestCategory : undefined,
  });

  // 모든 페이지의 채팅방을 하나의 배열로 합침
  const allChats = useMemo(() => {
    return data?.pages.flatMap((page) => page.result ?? []) ?? [];
  }, [data?.pages]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      showToast('채팅 목록을 불러오지 못했습니다.');
    }
  }, [error, showToast]);

  return (
    <div className="min-h-screen bg-white pt-[env(safe-area-inset-top)] pb-20">
      <h1 className="text-head-3-semibold px-5 py-3">채팅</h1>
      {isModelUser && (
        <div className="scrollbar-hide flex gap-1.5 overflow-x-auto px-4 py-2">
          {[
            { code: 'ALL', label: '전체' },
            { code: 'HAIR', label: '헤어' },
            { code: 'NAIL', label: '네일' },
            { code: 'TATTOO', label: '타투' },
            { code: 'EYELASH', label: '속눈썹' },
          ].map((chip) => {
            const isActive = selectedCategory === chip.code;
            return (
              <button
                key={chip.code}
                type="button"
                onClick={() => setSelectedCategory(chip.code)}
                className={`text-body-2-medium shrink-0 cursor-pointer rounded-[99px] px-3.5 py-1.5 ${
                  isActive ? 'bg-gray-900 text-white' : 'border border-gray-400 text-gray-700'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      )}
      <ChatList
        chats={allChats}
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
