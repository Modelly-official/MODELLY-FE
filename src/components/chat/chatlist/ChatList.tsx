'use client';

import { useEffect, useRef } from 'react';
import ChatListItem from './ChatListItem';
import type { ChatRoomSummary } from '@/src/types/chat';

type Props = {
  chats?: ChatRoomSummary[];
  isLoading?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};

function ChatListSkeleton() {
  return (
    <div className="animate-skeleton">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="h-[52px] w-[52px] shrink-0 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-3 w-10 rounded bg-gray-200" />
            </div>
            <div className="mt-2 h-4 w-48 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingMore() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-purple-500" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-body-1-medium text-gray-600">채팅 내역이 없습니다</p>
    </div>
  );
}

export default function ChatList({ chats, isLoading, hasNextPage, isFetchingNextPage, onLoadMore }: Props) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver로 스크롤 감지
  useEffect(() => {
    if (!hasNextPage || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    const target = loadMoreRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (isLoading) {
    return <ChatListSkeleton />;
  }

  const items = chats ?? [];

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <ul>
        {items.map((chat) => (
          <ChatListItem key={chat.roomId} chat={chat} />
        ))}
      </ul>
      {/* 무한 스크롤 트리거 영역 */}
      <div ref={loadMoreRef} className="h-1" />
      {isFetchingNextPage && <LoadingMore />}
    </>
  );
}
