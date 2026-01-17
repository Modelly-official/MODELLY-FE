'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { NotificationFilter, NotificationList } from '@/src/components/notification';
import { useNotificationList } from '@/src/hooks/queries';
import { useInfiniteScroll } from '@/src/hooks/common/useInfiniteScroll';
import type { NotificationType } from '@/src/types';

/**
 * 알림 목록 페이지
 * - 필터별 알림 조회 (전체/예약/일정/리뷰/채팅)
 * - 무한 스크롤 지원
 */
export default function NotificationPage() {
  const router = useRouter();

  // 필터 상태 (undefined = 전체)
  const [filter, setFilter] = useState<NotificationType | undefined>(undefined);

  // 알림 목록 조회
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotificationList({ type: filter });

  // 알림 데이터 가공
  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.result?.notifications ?? []) ?? [];
  }, [data?.pages]);

  // 무한 스크롤
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="text-black" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">알림</h1>
        <div className="size-6" />
      </header>

      {/* 필터 */}
      <NotificationFilter selectedFilter={filter} onFilterChange={setFilter} />

      {/* 알림 목록 */}
      <div className="flex-1 pt-4">
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          isFetchingNext={isFetchingNextPage}
        />

        {/* 무한스크롤 감지 영역 */}
        <div ref={loadMoreRef} className="h-1" />
      </div>
    </div>
  );
}
