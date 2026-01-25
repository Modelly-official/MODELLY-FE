'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { useUnreviewedReservations, useWrittenReviews, useDeleteReview } from '@/src/hooks/queries/review';
import {
  ReviewTabs,
  ReviewCategoryChips,
  UnreviewedList,
  WrittenReviewList,
  YearDropdown,
} from '@/src/components/mypage/model-reviews';
import ConfirmModal from '@/src/components/common/Modal/ConfirmModal';
import type { ReviewTabType, ReviewCategoryFilter, UnreviewedReservation } from '@/src/types';

export default function ModelReviewsPage() {
  const router = useRouter();
  const deleteReviewMutation = useDeleteReview();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<ReviewTabType>('unreviewed');

  // 삭제 확인 모달 상태
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<number | null>(null);

  // 카테고리 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<ReviewCategoryFilter>('ALL');

  // 년도 선택 상태 (현재 년도로 초기화)
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // 년도 옵션 생성 (최근 5년)
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  // 카테고리 필터 파라미터
  const categoryParam = selectedCategory !== 'ALL' ? selectedCategory : undefined;

  // 리뷰 미작성 예약 목록 조회 (무한 스크롤 + 카테고리 필터)
  const unreviewedQuery = useUnreviewedReservations({
    category: categoryParam,
  });

  // 작성한 리뷰 목록 조회 (무한 스크롤 + 카테고리 필터)
  const writtenQuery = useWrittenReviews({
    category: categoryParam,
  });

  // 리뷰 미작성 목록 데이터 (무한 스크롤 pages에서 추출)
  const unreviewedReservations: UnreviewedReservation[] = useMemo(() => {
    return unreviewedQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
  }, [unreviewedQuery.data?.pages]);

  // 리뷰 미작성 개수 (API 응답의 totalCount 사용)
  const unreviewedCount = unreviewedQuery.data?.pages[0]?.result?.totalCount ?? 0;

  // 작성한 리뷰 목록 데이터 가공
  const writtenReviews = useMemo(() => {
    return writtenQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
  }, [writtenQuery.data?.pages]);

  // 현재 탭에 따른 총 개수 (API 응답의 totalCount 사용)
  const writtenCount = writtenQuery.data?.pages[0]?.result?.totalCount ?? 0;
  const totalCount = activeTab === 'unreviewed' ? unreviewedCount : writtenCount;

  // 리뷰 수정 핸들러
  const handleEditReview = (reviewId: number) => {
    router.push(`/mypage/reviews/edit/${reviewId}`);
  };

  // 리뷰 삭제 모달 열기
  const handleDeleteReview = (reviewId: number) => {
    setReviewIdToDelete(reviewId);
    setDeleteModalOpen(true);
  };

  // 리뷰 삭제 확인
  const handleConfirmDelete = () => {
    if (reviewIdToDelete !== null) {
      deleteReviewMutation.mutate(reviewIdToDelete, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setReviewIdToDelete(null);
        },
      });
    }
  };

  // 리뷰 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setReviewIdToDelete(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {/* 헤더 */}
      <header className="flex items-center justify-between bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => router.push('/mypage')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">나의 리뷰</h1>
        <div className="size-6" />
      </header>

      {/* 탭 */}
      <ReviewTabs activeTab={activeTab} onTabChange={setActiveTab} unreviewedCount={unreviewedCount} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* 카테고리 필터 */}
        <ReviewCategoryChips selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

        {/* 년도 선택 및 전체 개수 (작성한 리뷰 탭에서만 표시) */}
        {activeTab === 'written' && (
          <div className="flex items-center justify-between">
            <YearDropdown years={yearOptions} selectedYear={selectedYear} onYearChange={setSelectedYear} />
            <div className="flex items-center gap-1">
              <span className="text-body-2-medium text-black">전체</span>
              <span className="text-body-2-semibold text-gray-600">{totalCount}</span>
            </div>
          </div>
        )}

        {/* 리뷰 목록 */}
        <div className="flex-1">
          {activeTab === 'unreviewed' ? (
            <UnreviewedList
              items={unreviewedReservations}
              isLoading={unreviewedQuery.isLoading}
              hasNextPage={unreviewedQuery.hasNextPage ?? false}
              isFetchingNextPage={unreviewedQuery.isFetchingNextPage}
              fetchNextPage={unreviewedQuery.fetchNextPage}
            />
          ) : (
            <WrittenReviewList
              items={writtenReviews}
              selectedYear={selectedYear}
              isLoading={writtenQuery.isLoading}
              hasNextPage={writtenQuery.hasNextPage ?? false}
              isFetchingNextPage={writtenQuery.isFetchingNextPage}
              fetchNextPage={writtenQuery.fetchNextPage}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        message="리뷰를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        isLoading={deleteReviewMutation.isPending}
      />
    </div>
  );
}
