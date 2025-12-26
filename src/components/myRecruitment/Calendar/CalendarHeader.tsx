'use client';

import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import ArrowRightIcon from '@/public/icons/common/arrow-right.svg';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({ year, month, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  // 월을 2자리로 포맷 (01, 02, ... 11, 12)
  const formattedMonth = month.toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        type="button"
        onClick={onPrevMonth}
        className="flex h-8 w-8 items-center justify-center"
        aria-label="이전 달"
      >
        <ArrowLeftIcon className="h-4 w-[9px] cursor-pointer" />
      </button>

      <span className="text-head-2-semibold text-gray-900">
        {year}.{formattedMonth}
      </span>

      <button
        type="button"
        onClick={onNextMonth}
        className="flex h-8 w-8 items-center justify-center"
        aria-label="다음 달"
      >
        <ArrowRightIcon className="h-4 w-[9px] cursor-pointer" />
      </button>
    </div>
  );
}
