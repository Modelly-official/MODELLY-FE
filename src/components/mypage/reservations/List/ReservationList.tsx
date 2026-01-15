'use client';

import type {
  ModelReservationItem,
  DesignerReservationItem,
  ReservationListType,
} from '@/src/types';
import { useInfiniteScroll } from '@/src/hooks/common';
import { ModelReservationCard, DesignerReservationCard, PendingReservationCard } from '../Card';
import ReservationListSkeleton from './ReservationListSkeleton';

type ReservationItem = ModelReservationItem | DesignerReservationItem;

interface ReservationListProps {
  items: ReservationItem[];
  role: 'model' | 'designer';
  tabType: ReservationListType;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
}

export default function ReservationList({
  items,
  role,
  tabType,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  fetchNextPage,
}: ReservationListProps) {
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // 로딩 상태
  if (isLoading) {
    return <ReservationListSkeleton />;
  }

  // 빈 상태
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-body-2-medium text-gray-700">예약 내역이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        // 모델 - 대기 중 탭
        if (role === 'model' && tabType === 'PENDING') {
          return (
            <PendingReservationCard
              key={item.reservationId}
              reservation={item as ModelReservationItem}
            />
          );
        }
        // 모델 - 다가오는 일정 / 완료된 일정
        if (role === 'model') {
          return (
            <ModelReservationCard
              key={item.reservationId}
              reservation={item as ModelReservationItem}
              tabType={tabType}
            />
          );
        }
        // 디자이너
        return (
          <DesignerReservationCard
            key={item.reservationId}
            reservation={item as DesignerReservationItem}
            tabType={tabType}
          />
        );
      })}

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
