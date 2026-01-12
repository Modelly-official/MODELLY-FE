'use client';

import type { UnreviewedReservation } from '@/src/types';
import { useInfiniteScroll } from '@/src/hooks/common';
import { UnreviewedCard } from '../Card';
import UnreviewedListSkeleton from './UnreviewedListSkeleton';

interface UnreviewedListProps {
  items: UnreviewedReservation[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export default function UnreviewedList({
  items,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage = () => {},
}: UnreviewedListProps) {
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

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

      {/* 무한 스크롤 트리거 */}
      <div ref={loadMoreRef} className="h-4" />

      {/* 추가 로딩 */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="size-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
