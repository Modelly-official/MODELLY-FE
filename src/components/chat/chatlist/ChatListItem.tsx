import Link from 'next/link';
import ProfileIcon from "@/public/icons/chat/profile.svg";
import { Chat } from '@/src/types/chat';

interface ChatListItemProps {
  chat: Chat;
}

export default function ChatListItem({ chat }: ChatListItemProps) {
  return (
    <li>
      <Link href={`/chat/${chat.id}`} className="flex items-center py-3 px-4 hover:bg-gray-50 cursor-pointer">
      <div className="w-13 h-13 rounded-full bg-gray-300 flex items-center justify-center">
      <ProfileIcon className="w-[34px] h-[34px] text-gray-500" />
    </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="h-6 flex justify-between items-center mb-0.5">
          <span className="max-w-56 text-body-1-medium text-gray-900 truncate">{chat.name}</span>
          <span className="text-xs text-gray-600 ml-2 whitespace-nowrap">{chat.lastTime}</span>
        </div>
        <div className="h-[21px] flex justify-between items-center">
          <span
            className={`max-w-56 text-body-2-medium truncate ${(chat.unread ?? 0) > 0 ? 'text-gray-900' : 'text-gray-700'}`}
          >
            {chat.lastMessage}
          </span>
          {(chat.unread ?? 0) > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-caption-1-medium rounded-full px-2 py-0.5">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
      </Link>
    </li>
  );
}
