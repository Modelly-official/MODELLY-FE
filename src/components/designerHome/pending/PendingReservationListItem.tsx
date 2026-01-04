'use client';

import Link from 'next/link';
import CalendarIcon from '@/public/icons/designer-home/calendar.svg';
import RightArrowIcon from '@/public/icons/designer-home/right-arrow.svg';
import { formatTimeWithPeriod } from '@/src/utils/common';
import type { PendingReservationItem } from '@/src/types/designerHome';

// ===== 날짜 파싱 함수 =====
function parseDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { month, day };
}

interface PendingReservationListItemProps {
  item: PendingReservationItem;
}

export function PendingReservationListItem({ item }: PendingReservationListItemProps) {
  const { month, day } = parseDate(item.date);

  return (
    <Link
      href={`/reservations/${item.reservationId}`}
      className="flex flex-col gap-1 rounded-[12px] bg-white py-4 pl-5 pr-4"
    >
      {/* 월 + 화살표 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <CalendarIcon className="size-4 text-gray-700" />
          <span className="text-body-2-medium text-gray-700">{month}월</span>
        </div>
        <RightArrowIcon className="h-4 w-[9px] shrink-0 text-gray-700" />
      </div>

      {/* 일 + 시간, 카테고리 + 모델명 */}
      <div className="flex flex-col gap-0.5">
        <p className="text-head-4-medium text-gray-900">
          {day}일 {formatTimeWithPeriod(item.time)}
        </p>
        <div className="flex items-center gap-2 text-body-2-medium text-gray-700">
          <span>{item.subCategories?.[0] ?? '기타'}</span>
          <span>·</span>
          <span>{item.modelName} 님</span>
        </div>
      </div>
    </Link>
  );
}
