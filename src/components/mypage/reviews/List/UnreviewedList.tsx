'use client';

import type { UnreviewedReservation } from '@/src/types';
import { UnreviewedCard } from '../Card';
import UnreviewedListSkeleton from './UnreviewedListSkeleton';

interface UnreviewedListProps {
  items: UnreviewedReservation[];
  isLoading: boolean;
}

export default function UnreviewedList({
  items,
  isLoading,
}: UnreviewedListProps) {
  // 로딩 상태
  if (isLoading) {
    return <UnreviewedListSkeleton />;
  }

  // 빈 상태
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-body-2-medium text-gray-700">리뷰를 작성할 예약이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <UnreviewedCard
          key={item.reservationId}
          reservation={item}
        />
      ))}
    </div>
  );
}
