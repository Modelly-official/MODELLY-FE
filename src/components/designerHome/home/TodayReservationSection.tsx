'use client';

import { TodayReservationItem } from './TodayReservationItem';
import type { TodayReservationsResult } from '@/src/types/designerHome';

interface TodayReservationSectionProps {
  data: TodayReservationsResult;
  isLoading?: boolean;
}

export function TodayReservationSection({ data, isLoading }: TodayReservationSectionProps) {
  return (
    <section className="scrollbar-hide flex h-full flex-col gap-[10px] overflow-y-auto px-4 pb-4">
      {isLoading ? (
        <>
          <div className="h-[66px] animate-skeleton rounded-[12px] bg-gray-300" />
          <div className="h-[66px] animate-skeleton rounded-[12px] bg-gray-300" />
        </>
      ) : data.reservations && data.reservations.length > 0 ? (
        data.reservations.map((item) => (
          <TodayReservationItem key={item.reservationId} item={item} />
        ))
      ) : (
        <div className="flex h-[66px] items-center justify-center rounded-[12px] bg-white">
          <p className="text-body-2-medium text-gray-600">예약이 없습니다</p>
        </div>
      )}
    </section>
  );
}
