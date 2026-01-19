'use client';

import LikeButton from '@/src/components/explore/Cards/shared/LikeButton';

interface DesignerProfileActionBarProps {
  onChat?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
}

export default function DesignerProfileActionBar({ onChat, onLike, isLiked = false }: DesignerProfileActionBarProps) {
  const handleLikeClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onLike?.();
  };

  return (
    <div className="fixed bottom-0 left-1/2 z-50 h-[76px] w-full -translate-x-1/2 bg-white px-4 py-3 sm:w-[375px]">
      <div className="flex h-[52px] items-center gap-4">
        <LikeButton isLiked={isLiked} onClick={handleLikeClick} className="h-6 w-6" />
        <button
          type="button"
          onClick={onChat}
          className="text-body-1-semibold flex h-[52px] flex-1 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white"
        >
          채팅하기
        </button>
      </div>
    </div>
  );
}
