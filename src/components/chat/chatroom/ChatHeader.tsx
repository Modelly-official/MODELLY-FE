'use client';

import { useRouter } from 'next/navigation';
import LeftArrowIcon from '@/public/icons/common/left-arrow.svg';
import DropDownArrowIcon from '@/public/icons/common/down-arrow.svg';

type Props = {
  title: string;
  rightLabel?: string;
  showReservation?: boolean;
};

export default function ChatHeader({
  title,
  rightLabel = '예약내역',
  showReservation = false,
}: Props) {
  const router = useRouter();

  return (
    <header className="relative mt-11 flex h-[51px] items-center px-4 py-3">
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
        <div className="text-body-2-medium absolute right-4 flex items-center gap-1 text-gray-800">
          <span>{rightLabel}</span>
          <DropDownArrowIcon className="h-5 w-5 text-gray-800" />
        </div>
      )}
    </header>
  );
}
