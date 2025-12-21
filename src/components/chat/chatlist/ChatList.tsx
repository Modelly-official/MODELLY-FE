'use client';

import ChatListItem from './ChatListItem';
import ChatSearch from './ChatSearch';
import type { Chat } from '@/src/types/chat';

type Props = {
  chats?: Chat[];
  onSelect?: (chat: Chat) => void;
};

export default function ChatList({ chats, onSelect }: Props) {
  const items = chats ?? [];

  return (
    <>
      <ChatSearch />
      <ul>
        {items.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} onSelect={onSelect} />
        ))}
      </ul>
    </>
  );
}
