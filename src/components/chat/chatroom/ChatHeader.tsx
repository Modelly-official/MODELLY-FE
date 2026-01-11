'use client';

import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/common/left-arrow.svg';
import DropDownArrowIcon from '@/public/icons/common/arrow-down.svg';

type Props = {
  title: string;
  rightLabel?: string;
  showReservation?: boolean;
  isReservationOpen?: boolean;
  onReservationClick?: () => void;
};

export default function ChatHeader({
  title,
  rightLabel = '예약 내역',
  showReservation = false,
  isReservationOpen = false,
  onReservationClick,
}: Props) {
  const router = useRouter();

  return (
    <header className="safe-area-top relative flex h-[51px] items-center px-4 py-3">
      <button
        type="button"
        onClick={() => router.push('/chat')}
        className="absolute left-4 mx-[8.5px] flex cursor-pointer items-center justify-center"
        aria-label="채팅 목록으로 돌아가기"
      >
        <LeftArrowIcon />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 transform text-center">
        <div className="text-head-4-medium text-gray-950">{title}</div>
      </div>

      {showReservation && (
        <button
          type="button"
          onClick={onReservationClick}
          aria-expanded={isReservationOpen}
          className="text-body-2-medium absolute right-4 flex cursor-pointer items-center gap-2 text-gray-800"
        >
          <span>{rightLabel}</span>
          <DropDownArrowIcon
            className={`h-[9px] w-4 shrink-0 origin-center scale-[0.9] text-gray-800 transition-transform ${
              isReservationOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}
    </header>
  );
}
