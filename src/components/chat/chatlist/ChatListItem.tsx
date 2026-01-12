'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import type { ChatRoomSummary } from '@/src/types/chat';
import { formatChatListTime } from '@/src/utils/chat';

const getReservationPreview = (raw: string) => {
  try {
    const payload = JSON.parse(raw) as { eventType?: string };
    switch (payload.eventType) {
      case 'CHANGE_REQUEST':
        return '예약 일정 변경 요청드립니다 :)';
      case 'CHANGE_REJECTED':
        return '예약 변경 요청이 거절되었습니다.';
      case 'CHANGE_PROCEED':
        return '변경 없이 기존 예약 일정으로 진행합니다.';
      case 'CHANGE_CANCEL':
        return '예약 변경 요청이 취소되었습니다.';
      case 'RESERVATION_CANCEL':
        return '예약이 취소되었습니다.';
      default:
        return '예약 관련 알림이 왔습니다.';
    }
  } catch {
    return '예약 관련 알림이 왔습니다.';
  }
};

interface ChatListItemProps {
  chat: ChatRoomSummary;
}

export default function ChatListItem({ chat }: ChatListItemProps) {
  const [imageError, setImageError] = useState(false);
  const hasUnread = chat.unreadMessages > 0;
  const displayCount = chat.unreadMessages > 99 ? '99+' : chat.unreadMessages;
  const previewMessage =
    chat.messageType === 'RESERVATION' ? getReservationPreview(chat.lastMessage) : chat.lastMessage;

  return (
    <li>
      <Link
        href={`/chat/${chat.roomId}`}
        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-100"
      >
        {/* 프로필 이미지 52x52 */}
        <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full bg-gray-300">
          {chat.profileImageUrl && !imageError ? (
            <Image
              src={chat.profileImageUrl}
              alt={chat.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
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
            <span className="text-body-1-medium max-w-56 truncate text-gray-900">{chat.name}</span>
            <span className="text-caption-1-medium ml-2 whitespace-nowrap text-gray-600">
              {formatChatListTime(chat.lastMessageTime)}
            </span>
          </div>

          {/* 마지막 메시지 + 읽지 않은 수 */}
          <div className="mt-0.5 flex items-center justify-between">
            <span
              className={`max-w-56 truncate ${hasUnread ? 'text-body-2-medium text-gray-900' : 'text-body-2-regular text-gray-700'}`}
            >
              {previewMessage}
            </span>
            {hasUnread && (
              <span className="text-caption-1-medium ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-500 px-1.5 text-white">
                {displayCount}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
