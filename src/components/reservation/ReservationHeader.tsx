'use client';

import LeftArrowIcon from '@/public/icons/common/left-arrow.svg';

interface ReservationHeaderProps {
  onBack: () => void;
}

/**
 * 예약 플로우 공통 헤더
 * - 뒤로가기 버튼만 포함
 */
export default function ReservationHeader({ onBack }: ReservationHeaderProps) {
  return (
    <header className="flex h-[52px] items-center px-4 safe-area-top">
      {/* 뒤로가기 버튼 */}
      <button
        type="button"
        onClick={onBack}
        className="flex size-6 cursor-pointer items-center justify-center"
        aria-label="뒤로가기"
      >
        <LeftArrowIcon className="size-6" />
      </button>
    </header>
  );
}
