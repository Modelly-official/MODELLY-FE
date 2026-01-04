'use client';

import CalendarIcon from '@/public/icons/designer-home/calendar.svg';

// ===== 시간 포맷 함수 =====
function formatTime(timeStr: string) {
  const [hour] = timeStr.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'pm' : 'am';
  return `${timeStr}${period}`;
}

// ===== 날짜 파싱 함수 =====
function parseDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { month, day };
}

interface ReservationInfoCardProps {
  date: string;
  startTime: string;
  category: string;
}

export function ReservationInfoCard({ date, startTime, category }: ReservationInfoCardProps) {
  const { month, day } = parseDate(date);

  return (
    <div className="flex flex-col items-center rounded-[12px] bg-white px-8 py-6">
      <div className="flex flex-col items-center gap-1">
        {/* 월 */}
        <div className="flex items-center gap-1">
          <CalendarIcon className="size-4 text-gray-700" />
          <span className="text-body-1-medium text-gray-700">{month}월</span>
        </div>

        {/* 날짜 + 시간 */}
        <p className="text-[24px] font-medium leading-[1.5] tracking-[-0.48px] text-gray-900">
          {day}일 {formatTime(startTime)}
        </p>

        {/* 카테고리 */}
        <p className="text-body-1-medium text-gray-700">{category}</p>
      </div>
    </div>
  );
}
