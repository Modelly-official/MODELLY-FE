"use client";

import React from "react";
import SendIcon from "@/public/icons/chat/send.svg";
import CameraIcon from "@/public/icons/chat/camera.svg";

export default function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "채팅을 입력하세요",
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder?: string;
}) {
  return (
    <div className="px-4 py-3 mb-6 bg-transparent">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="사진 첨부"
          className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-300"
        >
          <CameraIcon />
        </button>

        <div className="flex-1 relative">
          <div className="bg-white rounded-xl h-12 flex items-center px-4 pr-12 border border-gray-300">
            <input
              className="flex-1 bg-transparent outline-none text-body-2-medium text-gray-700 placeholder-gray-600"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend();
              }}
            />
          </div>
          <button
            type="button"
            aria-label="전송"
            onClick={onSend}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
