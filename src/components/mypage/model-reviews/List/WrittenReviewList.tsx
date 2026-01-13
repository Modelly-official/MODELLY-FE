'use client';

import { useMemo } from 'react';
import type { WrittenReviewItem } from '@/src/types';
import { useInfiniteScroll } from '@/src/hooks/common';
import { WrittenReviewCard } from '../Card';
import WrittenReviewListSkeleton from './WrittenReviewListSkeleton';

interface WrittenReviewListProps {
  items: WrittenReviewItem[];
  selectedYear: number;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onEdit?: (reviewId: number) => void;
  onDelete?: (reviewId: number) => void;
}

// 날짜 키 생성 (YYYY-MM-DD 형식)
function getDateKey(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 선택된 년도로 필터링 후 월별로 그룹핑하는 함수
function groupReviewsByMonth(reviews: WrittenReviewItem[], selectedYear: number) {
  // 선택된 년도로 필터링
  const filteredReviews = reviews.filter((review) => {
    const date = new Date(review.createdAt);
    return date.getFullYear() === selectedYear;
  });

  const groups: { [key: string]: WrittenReviewItem[] } = {};

  filteredReviews.forEach((review) => {
    const date = new Date(review.createdAt);
    const month = date.getMonth() + 1;
    const monthKey = `${month}`;

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(review);
  });

  // 월별로 정렬 (최신 월 먼저)
  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([month, items]) => ({
      monthKey: month,
      monthLabel: `${month}월`,
      items,
    }));
}

export default function WrittenReviewList({
  items,
  selectedYear,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onEdit,
  onDelete,
}: WrittenReviewListProps) {
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  // 선택된 년도로 필터링 후 월별 그룹핑
  const groupedReviews = useMemo(
    () => groupReviewsByMonth(items, selectedYear),
    [items, selectedYear]
  );

  // 로딩 상태
  if (isLoading) {
    return <WrittenReviewListSkeleton />;
  }

  // 빈 상태 (전체 리뷰가 없는 경우)
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-body-2-medium text-gray-700">작성한 리뷰가 없습니다</p>
      </div>
    );
  }

  // 선택된 년도에 리뷰가 없는 경우
  if (groupedReviews.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-body-2-medium text-gray-700">{selectedYear}년에 작성한 리뷰가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groupedReviews.map((group) => (
        <div key={group.monthKey} className="flex flex-col">
          {/* 월 헤더 */}
          <h3 className="mb-3 text-head-4-semibold text-gray-900">{group.monthLabel}</h3>

          {/* 해당 월의 리뷰 목록 - 타임라인 형식 */}
          <div className="flex flex-col">
            {group.items.map((review, index) => {
              const currentDateKey = getDateKey(review.createdAt);
              const prevDateKey = index > 0 ? getDateKey(group.items[index - 1].createdAt) : null;
              const nextDateKey = index < group.items.length - 1 ? getDateKey(group.items[index + 1].createdAt) : null;

              // 이전 리뷰와 같은 날짜인 경우 날짜 표시 안함
              const showDate = prevDateKey !== currentDateKey;
              // 다음 리뷰가 없거나, 다음 리뷰와 날짜가 다른 경우 그룹의 마지막
              const isLastInDateGroup = nextDateKey !== currentDateKey;
              // 월 그룹의 마지막 아이템
              const isLastInMonth = index === group.items.length - 1;

              return (
                <WrittenReviewCard
                  key={review.reviewId}
                  review={review}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showDate={showDate}
                  isLastInDateGroup={isLastInDateGroup}
                  isLastInMonth={isLastInMonth}
                  isFirstItem={index === 0}
                />
              );
            })}
          </div>
        </div>
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
