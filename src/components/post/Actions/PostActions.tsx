'use client';

import { useRouter } from 'next/navigation';

interface PostActionsProps {
  recruitmentId: number;
  designerId: number;
}

export default function PostActions({ recruitmentId, designerId }: PostActionsProps) {
  const router = useRouter();

  const handleChat = () => {
    // TODO: 채팅 페이지로 이동 (추후 구현)
    router.push(`/chat/${designerId}`);
  };

  const handleReservation = () => {
    // TODO: 예약 페이지로 이동 (추후 구현)
    router.push(`/reservation/${recruitmentId}`);
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[600px] -translate-x-1/2 border-t border-gray-100 bg-white px-4 pb-2 pt-3 sm:w-[375px]">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleChat}
          className="flex-1 rounded-full border border-gray-400 py-4 text-body-1-semibold text-gray-900"
        >
          채팅하기
        </button>
        <button
          type="button"
          onClick={handleReservation}
          className="flex-1 rounded-full bg-gray-900 py-4 text-body-1-semibold text-white"
        >
          예약하기
        </button>
      </div>
    </div>
  );
}

