'use client';

import LikeButton from '@/src/components/explore/Cards/shared/LikeButton';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';

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
    <FixedBottomContainer>
      <div className="flex h-[56px] items-center gap-4">
        <LikeButton isLiked={isLiked} onClick={handleLikeClick} className="h-6 w-6" />
        <button
          type="button"
          onClick={onChat}
          className="text-body-1-semibold flex h-[56px] flex-1 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white"
        >
          채팅하기
        </button>
      </div>
    </FixedBottomContainer>
  );
}
