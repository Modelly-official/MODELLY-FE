'use client';

import ChatIcon from '@/public/icons/designer-home/chat.svg';

interface ApplicantInfoCardProps {
  modelName: string;
  onChatClick?: () => void;
}

export function ApplicantInfoCard({ modelName, onChatClick }: ApplicantInfoCardProps) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-white p-5">
      <div className="flex flex-col gap-1">
        {/* 라벨 */}
        <span className="text-body-2-medium text-gray-700">신청자 정보</span>

        {/* 이름 */}
        <div className="flex items-center gap-1">
          <span className="text-head-4-medium text-gray-900">{modelName}</span>
          <span className="text-body-1-medium text-gray-900">님</span>
        </div>
      </div>

      {/* 채팅 버튼 */}
      <button
        type="button"
        onClick={onChatClick}
        className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-gray-200"
        aria-label="채팅하기"
      >
        <ChatIcon className="size-5 text-gray-900" />
      </button>
    </div>
  );
}
