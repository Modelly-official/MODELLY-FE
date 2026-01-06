'use client';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

// ===== 날짜 포맷 함수 =====
function formatDateWithDay(dateStr: string, startTime: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAY_NAMES[date.getDay()];
  const time = startTime.slice(0, 5); // "09:00" 형식

  return `${month}월 ${day}일(${dayOfWeek}) ${time}`;
}

interface ReservationInfoCardProps {
  date: string;
  startTime: string;
}

export function ReservationInfoCard({ date, startTime }: ReservationInfoCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] bg-white p-5">
      {/* 라벨 */}
      <span className="text-body-2-medium text-gray-700">신청 일시</span>

      {/* 날짜 + 시간 */}
      <p className="text-head-4-medium text-gray-900">{formatDateWithDay(date, startTime)}</p>
    </div>
  );
}
