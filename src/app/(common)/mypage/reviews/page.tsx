'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import BellIcon from '@/public/icons/designer-home/bell.svg';
import { getUserRole } from '@/src/stores/auth/useAuthStore';
import { useUnreviewedReservations, useWrittenReviews, useDeleteReview } from '@/src/hooks/queries/review';
import { useDesignerReviews, useCreateReply, useUpdateReply, usePinReview } from '@/src/hooks/queries/review';
import { ReviewTabs, ReviewCategoryChips, UnreviewedList, WrittenReviewList, YearDropdown } from '@/src/components/mypage/model-reviews';
import { DesignerReviewCard } from '@/src/components/mypage/designer-reviews';
import type { ReviewTabType, ReviewCategoryFilter, UnreviewedReservation, DesignerReviewItem } from '@/src/types';

// 모델 리뷰 페이지 컴포넌트
function ModelReviewsPage() {
  const router = useRouter();
  const deleteReviewMutation = useDeleteReview();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<ReviewTabType>('unreviewed');

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

  // 리뷰 미작성 개수
  const unreviewedCount = unreviewedReservations.length;

  // 작성한 리뷰 목록 데이터 가공
  const writtenReviews = useMemo(() => {
    return writtenQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
  }, [writtenQuery.data?.pages]);

  // 현재 탭에 따른 총 개수
  const totalCount = activeTab === 'unreviewed' ? unreviewedCount : writtenReviews.length;

  // 리뷰 수정 핸들러
  const handleEditReview = (reviewId: number) => {
    router.push(`/mypage/reviews/edit/${reviewId}`);
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = (reviewId: number) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

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

        {/* 년도 선택 및 전체 개수 (작성한 리뷰 탭에서만 표시) */}
        {activeTab === 'written' && (
          <div className="flex items-center justify-between">
            <YearDropdown
              years={yearOptions}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
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
    </div>
  );
}

// 디자이너 리뷰 관리 페이지 컴포넌트
function DesignerReviewsPage() {
  const router = useRouter();

  // API Hooks
  const designerReviewsQuery = useDesignerReviews();
  const createReplyMutation = useCreateReply();
  const updateReplyMutation = useUpdateReply();
  const pinReviewMutation = usePinReview();

  // 답글 입력 상태
  const [replyingReviewId, setReplyingReviewId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);

  // 리뷰 데이터 추출
  const reviews: DesignerReviewItem[] = useMemo(() => {
    return designerReviewsQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
  }, [designerReviewsQuery.data?.pages]);

  // 전체 개수
  const totalCount = reviews.length;

  // 답글 달기 클릭
  const handleReplyClick = (reviewId: number) => {
    setReplyingReviewId(reviewId);
    setReplyContent('');
    setEditingReplyId(null);
  };

  // 답글 수정 클릭
  const handleReplyEdit = (reviewId: number, replyId: number) => {
    const review = reviews.find((r) => r.reviewId === reviewId);
    if (review?.replyDto) {
      setReplyingReviewId(reviewId);
      setReplyContent(review.replyDto.content);
      setEditingReplyId(replyId);
    }
  };

  // 답글 취소
  const handleReplyCancel = () => {
    setReplyingReviewId(null);
    setReplyContent('');
    setEditingReplyId(null);
  };

  // 답글 제출
  const handleReplySubmit = () => {
    if (!replyingReviewId || !replyContent.trim()) return;

    if (editingReplyId) {
      // 수정
      updateReplyMutation.mutate(
        { replyId: editingReplyId, data: { content: replyContent } },
        { onSuccess: handleReplyCancel }
      );
    } else {
      // 신규 작성
      createReplyMutation.mutate(
        { reviewId: replyingReviewId, data: { content: replyContent } },
        { onSuccess: handleReplyCancel }
      );
    }
  };

  // 리뷰 고정/해제
  const handlePin = (reviewId: number, isFixed: boolean) => {
    pinReviewMutation.mutate({ reviewId, isFixed });
  };

  // 답글 삭제
  const handleReplyDelete = (reviewId: number, replyId: number) => {
    if (window.confirm('답글을 삭제하시겠습니까?')) {
      // TODO: 답글 삭제 mutation 추가
      console.log('Delete reply:', reviewId, replyId);
    }
  };

  const isSubmittingReply = createReplyMutation.isPending || updateReplyMutation.isPending;

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
        <h1 className="text-head-4-medium text-center text-black">리뷰 관리</h1>
        <button
          type="button"
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="알림"
        >
          <BellIcon className="text-black" />
        </button>
      </header>

      {/* 전체 개수 */}
      <div className="flex items-center gap-1 bg-white px-4 py-2">
        <span className="text-body-2-medium text-black">전체</span>
        <span className="text-body-2-semibold text-gray-600">{totalCount}</span>
      </div>

      {/* 리뷰 목록 */}
      <div className="flex flex-1 flex-col">
        {designerReviewsQuery.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-body-2-medium text-gray-600">등록된 리뷰가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {reviews.map((review) => (
              <DesignerReviewCard
                key={review.reviewId}
                review={review}
                onPin={handlePin}
                onReplyClick={handleReplyClick}
                onReplyEdit={handleReplyEdit}
                onReplyDelete={handleReplyDelete}
                isReplying={replyingReviewId === review.reviewId}
                replyContent={replyingReviewId === review.reviewId ? replyContent : ''}
                onReplyContentChange={setReplyContent}
                onReplySubmit={handleReplySubmit}
                onReplyCancel={handleReplyCancel}
                isSubmittingReply={isSubmittingReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 메인 페이지 - 역할에 따라 분기
export default function MyReviewsPage() {
  const userRole = getUserRole();
  const isDesigner = userRole === 'designer';

  if (isDesigner) {
    return <DesignerReviewsPage />;
  }

  return <ModelReviewsPage />;
}
