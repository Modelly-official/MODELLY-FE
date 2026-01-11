'use client';

import { useMemo } from 'react';
import type { WrittenReviewItem } from '@/src/types';
import { useInfiniteScroll } from '@/src/hooks/common';
import { WrittenReviewCard } from '../Card';
import WrittenReviewListSkeleton from './WrittenReviewListSkeleton';

interface WrittenReviewListProps {
  items: WrittenReviewItem[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onEdit?: (reviewId: number) => void;
  onDelete?: (reviewId: number) => void;
}

// 월별로 리뷰를 그룹핑하는 함수
function groupReviewsByMonth(reviews: WrittenReviewItem[]) {
  const groups: { [key: string]: WrittenReviewItem[] } = {};

  reviews.forEach((review) => {
    const date = new Date(review.createdAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const monthLabel = `${date.getMonth() + 1}월`;

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(review);
  });

  // 월별로 정렬 (최신순)
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => {
      const [year, month] = key.split('-');
      return {
        monthKey: key,
        monthLabel: `${month}월`,
        year,
        items,
      };
    });
}

export default function WrittenReviewList({
  items,
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

  // 월별 그룹핑
  const groupedReviews = useMemo(() => groupReviewsByMonth(items), [items]);

  // 로딩 상태
  if (isLoading) {
    return <WrittenReviewListSkeleton />;
  }

  // 빈 상태
  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <p className="text-body-2-medium text-gray-700">작성한 리뷰가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groupedReviews.map((group) => (
        <div key={group.monthKey} className="flex flex-col gap-3">
          {/* 월 헤더 */}
          <h3 className="text-head-4-semibold text-gray-900">{group.monthLabel}</h3>

          {/* 해당 월의 리뷰 목록 */}
          <div className="flex flex-col gap-3">
            {group.items.map((review) => (
              <WrittenReviewCard
                key={review.reviewId}
                review={review}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
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
