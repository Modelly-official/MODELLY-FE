'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import BellIcon from '@/public/icons/designer-home/bell.svg';
import { useUnreviewedReservations, useWrittenReviews } from '@/src/hooks/queries/review';
import { ReviewTabs, ReviewCategoryChips } from '@/src/components/mypage/reviews';
import { MonthDropdown } from '@/src/components/mypage/reservations';
import { generateMonthOptions } from '@/src/constants';
import type { ReviewTabType, ReviewCategoryFilter } from '@/src/types';

export default function MyReviewsPage() {
  const router = useRouter();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<ReviewTabType>('unreviewed');

  // 카테고리 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<ReviewCategoryFilter>('ALL');

  // 월 선택 상태 (현재 월로 초기화, yyyy-MM 형식)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // 월 옵션 생성
  const monthOptions = useMemo(() => generateMonthOptions(currentYear), [currentYear]);

  // 리뷰 미작성 예약 목록 조회
  const unreviewedQuery = useUnreviewedReservations();

  // 작성한 리뷰 목록 조회 (무한 스크롤)
  const writtenQuery = useWrittenReviews({
    category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
  });

  // 리뷰 미작성 개수
  const unreviewedCount = unreviewedQuery.data?.result?.reservations?.length ?? 0;

  // 작성한 리뷰 목록 데이터 가공
  const writtenReviews = useMemo(() => {
    return writtenQuery.data?.pages.flatMap((page) => page.result?.reviews ?? []) ?? [];
  }, [writtenQuery.data?.pages]);

  // 현재 탭에 따른 총 개수
  const totalCount = activeTab === 'unreviewed' ? unreviewedCount : writtenReviews.length;

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {/* 헤더 */}
      <header className="flex items-center justify-between bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="text-black" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">나의 리뷰</h1>
        <button
          type="button"
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="알림"
        >
          <BellIcon className="text-black" />
        </button>
      </header>

      {/* 탭 */}
      <ReviewTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreviewedCount={unreviewedCount}
      />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* 카테고리 필터 */}
        <ReviewCategoryChips
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* 월 선택 및 전체 개수 */}
        <div className="flex items-center justify-between">
          <MonthDropdown
            options={monthOptions}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <div className="flex items-center gap-1">
            <span className="text-body-2-medium text-black">전체</span>
            <span className="text-body-2-semibold text-gray-600">{totalCount}</span>
          </div>
        </div>

        {/* 리뷰 목록 - 다음 단계에서 구현 */}
        <div className="flex-1">
          {activeTab === 'unreviewed' ? (
            <div className="text-body-2-regular py-10 text-center text-gray-600">
              리뷰 미작성 목록이 여기에 표시됩니다.
            </div>
          ) : (
            <div className="text-body-2-regular py-10 text-center text-gray-600">
              작성한 리뷰 목록이 여기에 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
