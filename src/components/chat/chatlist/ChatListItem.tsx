import Link from 'next/link';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import { Chat } from '@/src/types/chat';

interface ChatListItemProps {
  chat: Chat;
  onSelect?: (chat: Chat) => void;
}

export default function ChatListItem({ chat, onSelect }: ChatListItemProps) {
  const content = (
    <>
      <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gray-300">
        <ProfileIcon className="h-[34px] w-[34px] text-gray-500" />
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <div className="mb-0.5 flex h-6 items-center justify-between">
          <span className="text-body-1-medium max-w-56 truncate text-gray-900">{chat.name}</span>
          <span className="ml-2 text-xs whitespace-nowrap text-gray-600">{chat.lastTime}</span>
        </div>
        <div className="flex h-[21px] items-center justify-between">
          <span
            className={`text-body-2-medium max-w-56 truncate ${(chat.unread ?? 0) > 0 ? 'text-gray-900' : 'text-gray-700'}`}
          >
            {chat.lastMessage}
          </span>
          {(chat.unread ?? 0) > 0 && (
            <span className="text-caption-1-medium ml-2 rounded-full bg-purple-500 px-2 py-0.5 text-white">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onSelect(chat)}
          className="flex w-full cursor-pointer items-center px-4 py-3 text-left hover:bg-gray-50"
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li>
      <Link href={`/chat/${chat.id}`} className="flex cursor-pointer items-center px-4 py-3 hover:bg-gray-50">
        {content}
      </Link>
    </li>
  );
}
