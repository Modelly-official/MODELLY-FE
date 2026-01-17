'use client';

import { useEffect, useRef } from 'react';

import type { MyRecruitmentListItem } from '@/src/types/myRecruitment/recruitment';

import ClosedRecruitmentListItem from './ClosedRecruitmentListItem';
import RecruitmentEmpty from './RecruitmentEmpty';

interface ClosedRecruitmentListProps {
  recruitments: MyRecruitmentListItem[];
  totalCount: number;
  onClick?: (id: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export default function ClosedRecruitmentList({
  recruitments,
  totalCount,
  onClick,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: ClosedRecruitmentListProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver로 무한 스크롤 구현
  useEffect(() => {
    if (!observerRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (recruitments.length === 0) {
    return <RecruitmentEmpty />;
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-3">
      {/* 전체 카운트 */}
      <div className="flex items-center gap-1">
        <span className="text-body-2-medium text-black">전체</span>
        <span className="text-body-2-semibold text-gray-600">{totalCount}</span>
      </div>

      {/* 리스트 */}
      <div className="flex flex-col gap-4">
        {recruitments.map((recruitment) => (
          <ClosedRecruitmentListItem
            key={recruitment.recruitmentId}
            recruitment={recruitment}
            onClick={onClick}
          />
        ))}
      </div>

      {/* 무한 스크롤 감지 영역 */}
      {hasMore && (
        <div ref={observerRef} className="flex items-center justify-center py-4">
          {isLoadingMore && (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          )}
        </div>
      )}
    </div>
  );
}
