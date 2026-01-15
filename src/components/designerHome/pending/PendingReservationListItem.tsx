'use client';

import Link from 'next/link';
import type { PendingReservationItem } from '@/src/types/designerHome';

// ===== 요일 배열 =====
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

// ===== 날짜 포맷팅 함수 (11월 15일(목) 형식) =====
function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAY_NAMES[date.getDay()];
  return `${month}월 ${day}일(${dayOfWeek})`;
}

// ===== 시간 포맷팅 함수 (18:00 pm 형식) =====
function formatTimeWithAmPm(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours.toString().padStart(2, '0');
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

interface PendingReservationListItemProps {
  item: PendingReservationItem;
}

export function PendingReservationListItem({ item }: PendingReservationListItemProps) {
  const category = item.subCategories?.[0] ?? '기타';
  const formattedDate = formatDateWithDay(item.date);
  const formattedTime = formatTimeWithAmPm(item.time);

  return (
    <Link
      href={`/reservations/${item.reservationId}`}
      className="flex flex-col gap-[14px] rounded-[12px] bg-white py-4 pl-5 pr-4"
    >
      {/* 카테고리 뱃지 + 공고 제목 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center">
          <span className="rounded-lg bg-purple-600 px-2 py-1 text-caption-1-medium text-white">
            {category}
          </span>
        </div>
        <p className="text-head-4-semibold text-gray-900">{item.recruitmentTitle}</p>
      </div>

      {/* 예약 정보 */}
      <div className="flex flex-col gap-1">
        {/* 예약자명 */}
        <div className="flex items-center gap-[14px] text-body-2-medium">
          <span className="text-gray-600">예약자명</span>
          <span className="text-gray-900">{item.modelName} 님</span>
        </div>
        {/* 예약일시 */}
        <div className="flex items-center gap-[14px] text-body-2-medium">
          <span className="text-gray-600">예약일시</span>
          <span className="text-gray-900">
            {formattedDate} {formattedTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
