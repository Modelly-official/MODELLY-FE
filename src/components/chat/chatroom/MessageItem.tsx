'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import { Message } from '@/src/types/chat';

export default function MessageItem({
  message,
  showTime = true,
  sharpCorner,
  avatarUrl,
  avatarName,
}: {
  message: Message;
  showTime?: boolean;
  sharpCorner?: 'left' | 'right';
  avatarUrl?: string | null;
  avatarName?: string;
}) {
  const [avatarError, setAvatarError] = useState(false);
  if (!message || (message.messageType === 'RESERVATION' && !message.text)) return null;
  if (!message.text && !message.imageUrls?.length) return null;
  const defaultSharp = message.fromMe ? 'right' : 'left';
  const isReservationNotice =
    message.messageType === 'TEXT' && message.text?.includes('예약 일정 변경 요청이 수락되었습니다');
  const isReservationNoticeFromMe = isReservationNotice && message.fromMe;
  const effectiveSharp = sharpCorner ?? defaultSharp;
  const cornerClass = effectiveSharp
    ? effectiveSharp === 'right'
      ? 'rounded-br-none'
      : 'rounded-bl-none'
    : '';
  const hasImages = (message.imageUrls?.length ?? 0) > 0;
  const isPending = message.pending || message.failed;
  const status = isPending ? '전송 중...' : null;
  const statusClass = 'text-gray-600';
  const showUnread = showTime && message.fromMe && message.read === false;
  const shouldShowAvatar = !message.fromMe;
  const showAvatarImage = !!avatarUrl && !avatarError;
  const bubbleTone = isReservationNotice
    ? isReservationNoticeFromMe
      ? 'bg-purple-300 text-purple-700'
      : 'border border-gray-300 bg-white text-gray-900'
    : message.fromMe
      ? 'bg-purple-300 text-purple-700'
      : 'border border-gray-300 bg-white text-gray-900';

  return (
    <li className={`flex items-end ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
      {shouldShowAvatar && (
        <div className="mr-2">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-white">
            {showAvatarImage ? (
              <Image
                src={avatarUrl}
                alt={avatarName ?? '프로필 이미지'}
                fill
                sizes="40px"
                className="object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <ProfileIcon className="h-[26.15px] w-[26.15px] text-gray-400" />
            )}
          </div>
        </div>
      )}

      <div className={`flex min-h-[45px] flex-col ${message.fromMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {hasImages && (
          <div className="mb-1 flex flex-wrap gap-2">
            {message.imageUrls?.map((url, idx) => (
              <div
                key={`${message.id}-${idx}`}
                className={`relative h-[180px] w-[180px] overflow-hidden rounded-2xl border ${
                  message.fromMe ? 'border-purple-200' : 'border-gray-200'
                }`}
              >
                <Image src={url} alt="보낸 이미지" fill sizes="180px" className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        )}
        {message.text && (
          <div className="flex items-end gap-2">
            {status && message.fromMe && (
              <span className={`${statusClass} text-caption-1-medium translate-y-0.5`}>{status}</span>
            )}
            <div
              className={`text-body-2-medium inline-block rounded-2xl px-4 py-3 ${cornerClass} ${bubbleTone} ${
                isReservationNotice ? 'w-[220px]' : ''
              }`}
            >
              {message.text}
            </div>
            {status && !message.fromMe && (
              <span className={`${statusClass} text-caption-1-medium translate-y-0.5`}>{status}</span>
            )}
          </div>
        )}
        {(showTime || status) && (
          <div className="text-caption-1-medium mt-0.5 flex items-center gap-2 text-gray-600">
            {showUnread && <span className="text-purple-600">안읽음</span>}
            {showTime && <span>{message.time}</span>}
          </div>
        )}
      </div>
    </li>
  );
}
