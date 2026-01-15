'use client';

// ===== 요일 상수 =====
const WEEKDAY_NAMES_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] as const;

// ===== 날짜 유틸 함수 =====
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateDateRange(startDate: Date, days: number): Date[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// ===== DateButton 컴포넌트 =====
interface DateButtonProps {
  date: Date;
  isSelected: boolean;
  onClick: () => void;
}

function DateButton({ date, isSelected, onClick }: DateButtonProps) {
  const day = date.getDate();
  const weekday = WEEKDAY_NAMES_KO[date.getDay()];
  const isTodayDate = isToday(date);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer flex w-[63px] shrink-0 flex-col items-center justify-center rounded-[12px] px-4 py-3 shadow-[0px_0px_4px_0px_rgba(34,34,34,0.09)] ${
        isSelected ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <span
        className={`text-[16px] font-medium leading-[1.4] tracking-[-0.32px] ${
          isSelected ? 'text-white' : 'text-gray-900'
        }`}
      >
        {day}
      </span>
      <span
        className={`text-caption-1-medium ${
          isSelected ? 'text-gray-200' : 'text-gray-700'
        }`}
      >
        {isTodayDate ? '오늘' : weekday}
      </span>
    </button>
  );
}

// ===== DateSelectorBar 컴포넌트 =====
interface DateSelectorBarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function DateSelectorBar({ selectedDate, onDateSelect }: DateSelectorBarProps) {
  const today = new Date();
  const dates = generateDateRange(today, 5); // 오늘 + 4일

  return (
    <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide">
      {dates.map((date) => {
        const dateStr = formatDateString(date);
        return (
          <DateButton
            key={dateStr}
            date={date}
            isSelected={dateStr === selectedDate}
            onClick={() => onDateSelect(dateStr)}
          />
        );
      })}
    </div>
  );
}
