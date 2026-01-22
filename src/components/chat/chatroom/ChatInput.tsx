'use client';

import React, { useState } from 'react';
import SendIcon from '@/public/icons/chat/send.svg';
import CameraIcon from '@/public/icons/chat/camera.svg';
import { useRef } from 'react';

export default function ChatInput({
  value,
  onChange,
  onSend,
  onImageSelect,
  placeholder = '채팅을 입력하세요',
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onImageSelect?: (file: File) => void;
  placeholder?: string;
}) {
  const [isComposing, setIsComposing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
    // 동일 파일 선택 시 change 이벤트가 안 뜰 수 있어 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-transparent px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="사진 첨부"
          onClick={handleImageClick}
          className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white"
        >
          <CameraIcon />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <div className="relative min-w-0 flex-1">
          <div className="flex h-12 items-center rounded-xl border border-gray-300 bg-white px-4 pr-12">
            <input
              className="text-body-2-medium min-w-0 flex-1 bg-transparent text-black placeholder-gray-600 outline-none"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isComposing) onSend();
              }}
            />
          </div>
          <button
            type="button"
            aria-label="전송"
            onClick={onSend}
            className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 transform cursor-pointer items-center justify-center"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
