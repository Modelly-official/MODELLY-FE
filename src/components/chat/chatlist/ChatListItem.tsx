import Link from 'next/link';
import Image from 'next/image';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import type { ChatRoomSummary } from '@/src/types/chat';
import { formatChatListTime } from '@/src/utils/chat/convert';

interface ChatListItemProps {
  chat: ChatRoomSummary;
}

export default function ChatListItem({ chat }: ChatListItemProps) {
  const hasUnread = chat.unreadMessages > 0;

  return (
    <li>
      <Link href={`/chat/${chat.roomId}`} className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-100">
        {/* 프로필 이미지 52x52 */}
        <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-gray-300">
          {chat.profileImageUrl ? (
            <Image src={chat.profileImageUrl} alt={chat.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ProfileIcon className="h-[34px] w-[34px] text-gray-500" />
            </div>
          )}
        </div>

        {/* 채팅 정보 */}
        <div className="min-w-0 flex-1">
          {/* 이름 + 시간 */}
          <div className="flex items-center justify-between">
            <span className="text-body-1-medium max-w-[224px] truncate text-gray-900">{chat.name}</span>
            <span className="text-caption-1-medium ml-2 whitespace-nowrap text-gray-600">
              {formatChatListTime(chat.lastMessageTime)}
            </span>
          </div>

          {/* 마지막 메시지 + 읽지 않은 수 */}
          <div className="mt-[2px] flex items-center justify-between">
            <span
              className={`max-w-[224px] truncate ${hasUnread ? 'text-body-2-medium text-gray-900' : 'text-body-2-regular text-gray-700'}`}
            >
              {chat.lastMessage}
            </span>
            {hasUnread && (
              <span className="text-caption-1-medium ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
                {chat.unreadMessages}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
