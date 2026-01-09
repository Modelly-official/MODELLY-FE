'use client';

import type {
  ModelReservationItem,
  DesignerReservationItem,
  ReservationListType,
} from '@/src/types';
import { useInfiniteScroll } from '@/src/hooks/common';
import ModelReservationCard from './ModelReservationCard';
import DesignerReservationCard from './DesignerReservationCard';
import ReservationListSkeleton from './ReservationListSkeleton';

type ReservationItem = ModelReservationItem | DesignerReservationItem;

interface ReservationListProps {
  items: ReservationItem[];
  role: 'model' | 'designer';
  tabType: ReservationListType;
  totalCount: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
  onChangeClick?: (reservation: ReservationItem) => void;
  onCancelClick?: (reservation: ReservationItem) => void;
  onChatClick?: (reservation: DesignerReservationItem) => void;
}

export default function ReservationList({
  items,
  role,
  tabType,
  totalCount,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  fetchNextPage,
  onChangeClick,
  onCancelClick,
  onChatClick,
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
    <div className="flex flex-col gap-2">
      {/* 전체 개수 */}
      <p className="text-body-2-medium text-gray-700">전체 ({totalCount})</p>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-4">
        {items.map((item) =>
          role === 'model' ? (
            <ModelReservationCard
              key={item.reservationId}
              reservation={item as ModelReservationItem}
              tabType={tabType}
              onChangeClick={onChangeClick as (r: ModelReservationItem) => void}
              onCancelClick={onCancelClick as (r: ModelReservationItem) => void}
            />
          ) : (
            <DesignerReservationCard
              key={item.reservationId}
              reservation={item as DesignerReservationItem}
              tabType={tabType}
              onChatClick={onChatClick}
              onChangeClick={onChangeClick as (r: DesignerReservationItem) => void}
              onCancelClick={onCancelClick as (r: DesignerReservationItem) => void}
            />
          )
        )}
      </div>

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
