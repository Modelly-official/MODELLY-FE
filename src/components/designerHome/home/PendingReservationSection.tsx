'use client';

import Link from 'next/link';
import CalendarIcon from '@/public/icons/designer-home/calendar.svg';
import RightArrowIcon from '@/public/icons/designer-home/right-arrow.svg';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import type { PendingReservationItem, PendingReservationsResult } from '@/src/types/designerHome';

// ===== 날짜 포맷 함수 =====
function formatReservationDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

// ===== 시간 포맷 함수 =====
function formatTime(timeStr: string) {
  const [hour] = timeStr.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'pm' : 'am';
  return `${timeStr} ${period}`;
}

// ===== 신규 예약 카드 =====
function PendingReservationCard({ item }: { item: PendingReservationItem }) {
  return (
    <Link
      href={`/reservations/${item.reservationId}`}
      className="flex w-[150px] shrink-0 flex-col rounded-[12px] bg-white p-4"
    >
      {/* 카테고리 배지 */}
      <div className="flex">
        <CategoryBadge label={item.subCategories[0]} />
      </div>

      {/* 시간 */}
      <p className="text-body-1-medium mt-2 text-gray-900">{formatTime(item.time)}</p>

      {/* 날짜 */}
      <div className="mt-0.5 flex items-center gap-1">
        <CalendarIcon className="size-4 text-gray-700" />
        <span className="text-body-2-medium text-gray-700">{formatReservationDate(item.date)}</span>
      </div>
    </Link>
  );
}

interface PendingReservationSectionProps {
  data: PendingReservationsResult;
  isLoading?: boolean;
}

// ===== 신규 예약 신청 섹션 =====
export function PendingReservationSection({ data, isLoading }: PendingReservationSectionProps) {
  return (
    <section className="mt-6">
      {/* 헤더 */}
      <Link href="/reservations/pending" className="flex items-center justify-between px-4">
        <div className="flex items-center gap-1.5">
          <span className="text-body-1-medium text-gray-900">새로운 예약 신청</span>
          <span className="text-body-1-medium text-purple-700">{data.totalCount ?? 0}</span>
        </div>
        <div className="flex items-center justify-center text-gray-700">
          <RightArrowIcon className="size-3 text-gray-700" />
        </div>
      </Link>

      {/* 가로 스크롤 카드 리스트 */}
      {isLoading ? (
        <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto px-4">
          <div className="animate-skeleton h-[100px] w-[150px] shrink-0 rounded-[12px] bg-gray-300" />
          <div className="animate-skeleton h-[100px] w-[150px] shrink-0 rounded-[12px] bg-gray-300" />
        </div>
      ) : data.reservations && data.reservations.length > 0 ? (
        <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto px-4">
          {data.reservations.map((item) => (
            <PendingReservationCard key={item.reservationId} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-body-2-medium mt-3 px-4 text-gray-700">새로운 예약 신청이 없습니다</p>
      )}
    </section>
  );
}
