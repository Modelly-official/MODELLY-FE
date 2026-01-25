'use client';

import { useRouter } from 'next/navigation';
import { useCreateChatRoom } from '@/src/hooks/queries/chat';
import { useToast } from '@/src/hooks/common/useToast';

interface PostActionsProps {
  recruitmentId: number;
  designerUserId: number;
}

export default function PostActions({ recruitmentId, designerUserId }: PostActionsProps) {
  const router = useRouter();
  const createChatRoom = useCreateChatRoom();
  const { showToast } = useToast();

  const handleChat = () => {
    createChatRoom.mutate(designerUserId, {
      onSuccess: (response) => {
        router.push(`/chat/${response.result.chatRoomId}`);
      },
      onError: () => {
        showToast('채팅방 생성에 실패했습니다');
      },
    });
  };

  const handleReservation = () => {
    router.push(`/reservation/${recruitmentId}`);
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 border-t border-gray-100 bg-white px-4 pt-3 pb-[calc(4px+env(safe-area-inset-bottom))] sm:w-[375px]">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleChat}
          disabled={createChatRoom.isPending}
          className={`text-body-1-semibold flex-1 rounded-full border h-14 ${
            createChatRoom.isPending
              ? 'cursor-not-allowed border-gray-300 text-gray-400'
              : 'cursor-pointer border-gray-400 text-gray-900'
          }`}
        >
          {createChatRoom.isPending ? '연결 중...' : '채팅하기'}
        </button>
        <button
          type="button"
          onClick={handleReservation}
          className="text-body-1-semibold flex-1 cursor-pointer rounded-full bg-gray-900 h-14 text-white"
        >
          예약하기
        </button>
      </div>
    </div>
  );
}
