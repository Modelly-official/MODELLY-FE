"use client";

import React from 'react';
import Image from 'next/image';
import ProfileIcon from '@/public/icons/chat/profile.svg';
import { Message } from '@/src/types/chat';

export default function MessageItem({
  message,
  showTime = true,
  onClick,
  sharpCorner,
}: {
  message: Message;
  showTime?: boolean;
  onClick?: (id: number | string) => void;
  sharpCorner?: 'left' | 'right';
}) {
  if (!message || (!message.text && !(message.imageUrls?.length))) return null;
  const defaultSharp = message.fromMe ? 'right' : 'left';
  const effectiveSharp = sharpCorner ?? defaultSharp;
  const cornerClass = effectiveSharp === 'right' ? 'rounded-br-none' : 'rounded-bl-none';
  const hasImages = (message.imageUrls?.length ?? 0) > 0;

  return (
    <li
      onClick={() => onClick?.(message.id)}
      className={`flex items-end ${message.fromMe ? 'justify-end' : 'justify-start'}`}
    >
      {!message.fromMe && (
        <div className="mr-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-300">
              <ProfileIcon className="w-[26.15px] h-[26.15px] text-gray-400" />
          </div>
        </div>
      )}

      <div className={`min-h-[45px] flex flex-col ${message.fromMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {hasImages && (
          <div className="flex flex-wrap gap-2 mb-1">
            {message.imageUrls?.map((url, idx) => (
              <div
                key={`${message.id}-${idx}`}
                className={`relative w-[180px] h-[180px] rounded-2xl overflow-hidden border ${
                  message.fromMe ? 'border-blue-200' : 'border-gray-200'
                }`}
              >
                <Image
                  src={url}
                  alt="보낸 이미지"
                  fill
                  sizes="180px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
        {message.text && (
          <div
            className={`inline-block px-4 py-3 text-body-2-medium rounded-2xl ${cornerClass} ${
              message.fromMe ? 'bg-blue-300 text-blue-700' : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            {message.text}
          </div>
        )}
        {showTime && (
          <div className="text-caption-1-medium text-gray-600 mt-0.5">
            {message.time}
          </div>
        )}
      </div>
    </li>
  );
}
