'use client';

import Image from 'next/image';
import HeartIcon from '@/public/icons/myRecruitment/heart.svg';

type LikeButtonVariant = 'overlay' | 'inline';

interface LikeButtonProps {
  isLiked: boolean;
  onClick: (e: React.MouseEvent) => void;
  variant?: LikeButtonVariant;
  className?: string;
}

/**
 * 재사용 가능한 찜하기 버튼 컴포넌트
 * - overlay: 카드 이미지 위에 오버레이되는 스타일 (RecruitmentCard)
 * - inline: 인라인 배치 스타일 (DesignerCard)
 */
export default function LikeButton({ isLiked, onClick, variant = 'inline', className = '' }: LikeButtonProps) {
  if (variant === 'overlay') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`absolute right-4 bottom-4 flex size-6 cursor-pointer items-center justify-center ${className}`}
      >
        <HeartIcon className={isLiked ? 'text-white' : 'text-transparent'} />
      </button>
    );
  }

  // inline variant
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex size-5 shrink-0 cursor-pointer items-center justify-center ${className}`}
    >
      <Image
        src={isLiked ? '/icons/common/heart-active.svg' : '/icons/common/heart.svg'}
        alt="찜하기"
        width={20}
        height={20}
      />
    </button>
  );
}
