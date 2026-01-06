'use client';

import ClockIcon from '@/public/icons/designer-home/clock.svg';
import RectangleIcon from '@/public/icons/designer-home/rectangle.svg';
import { formatTimeWithPeriod } from '@/src/utils/common';
import type { TodayReservationItem, TodayReservationsResult } from '@/src/types/designerHome';

// ===== 요일 상수 =====
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// ===== 날짜 포맷 함수 =====
function formatDateCard(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_NAMES[date.getDay()];
  return { month, day, weekday };
}

// ===== 오늘의 예약 아이템 =====
function TodayReservationItemRow({ item }: { item: TodayReservationItem }) {
  return (
    <div className="flex items-center gap-2 rounded-[12px] bg-purple-100 p-3">
      <ClockIcon className="size-4 text-purple-700" />
      <span className="text-body-1-medium text-purple-700">{formatTimeWithPeriod(item.time)}</span>
      <span className="text-body-1-medium text-purple-700">·</span>
      <span className="text-body-1-medium text-purple-700">{item.modelName} 님</span>
      <span className="text-body-1-medium text-purple-700">·</span>
      <span className="text-body-1-medium text-purple-700">{item.subCategories?.[0] ?? '기타'}</span>
    </div>
  );
}

interface TodayReservationSectionProps {
  data: TodayReservationsResult;
  isLoading?: boolean;
}

// ===== 오늘의 예약 섹션 =====
export function TodayReservationSection({ data, isLoading }: TodayReservationSectionProps) {
  const { month, day, weekday } = formatDateCard(data.date);

  return (
    <section className="mx-4">
      <div className="relative">
        {/* 좌측 스크롤 인디케이터 */}
        <div className="absolute -top-3 left-16">
          <RectangleIcon className="h-6 w-4" />
        </div>

        {/* 우측 스크롤 인디케이터 */}
        <div className="absolute -top-3 right-16">
          <RectangleIcon className="h-6 w-4" />
        </div>

        {/* 카드 */}
        <div className="rounded-[20px] border border-gray-300 bg-white px-5 pb-5 pt-8">
          {/* 날짜 */}
          <div className="flex items-end gap-2 text-gray-900">
            <span className="text-[38px] font-medium leading-[1.2] tracking-[-0.76px]">
              {month}/{day}
            </span>
            <span className="text-[23px] font-medium leading-[1.5] tracking-[-0.46px]">
              {weekday}
            </span>
          </div>

          {/* 예약 리스트 */}
          <div className="mt-4 flex flex-col gap-2">
            {isLoading ? (
              <div className="animate-skeleton h-10 rounded-[12px] bg-gray-200" />
            ) : data.reservations && data.reservations.length > 0 ? (
              data.reservations.map((item) => (
                <TodayReservationItemRow key={item.reservationId} item={item} />
              ))
            ) : (
              <p className="text-body-2-medium text-gray-700">오늘 예약이 없습니다</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
