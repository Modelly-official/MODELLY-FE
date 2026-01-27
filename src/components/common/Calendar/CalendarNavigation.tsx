import Image from 'next/image';

interface CalendarNavigationProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
}

export const CalendarNavigation = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  className = '',
}: CalendarNavigationProps) => {
  const formattedMonth = String(month).padStart(2, '0');

  return (
    <div className={`flex items-center justify-center gap-1 py-4 ${className}`}>
      <button
        type="button"
        onClick={onPrevMonth}
        className="flex size-6 items-center justify-center cursor-pointer"
        aria-label="이전 달"
      >
        <Image
          src="/icons/calendarHeader/chevron-left.svg"
          alt=""
          width={24}
          height={24}
        />
      </button>
      <span className="min-w-[90px] text-center text-calendar-month">
        {year}.{formattedMonth}
      </span>
      <button
        type="button"
        onClick={onNextMonth}
        className="flex size-6 items-center justify-center cursor-pointer"
        aria-label="다음 달"
      >
        <Image
          src="/icons/calendarHeader/chevron-right.svg"
          alt=""
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};
