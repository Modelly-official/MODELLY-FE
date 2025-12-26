'use client';

import ChatListItem from './ChatListItem';
import type { ChatRoomSummary } from '@/src/types/chat';

type Props = {
  chats?: ChatRoomSummary[];
  isLoading?: boolean;
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-body-1-medium text-gray-600">채팅 내역이 없습니다</p>
    </div>
  );
}

export default function ChatList({ chats, isLoading }: Props) {
  if (isLoading) {
    return <ChatListSkeleton />;
  }

  const items = chats ?? [];

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {items.map((chat) => (
        <ChatListItem key={chat.roomId} chat={chat} />
      ))}
    </ul>
  );
}
