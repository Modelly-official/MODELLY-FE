'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { useDesignerReviews, useCreateReply, useUpdateReply, usePinReview } from '@/src/hooks/queries/review';
import { useInfiniteScroll } from '@/src/hooks/common/useInfiniteScroll';
import { DesignerReviewCard } from '@/src/components/mypage/designer-reviews';
import type { DesignerReviewItem } from '@/src/types';

export default function DesignerReviewsPage() {
  const router = useRouter();

  // API Hooks
  const designerReviewsQuery = useDesignerReviews({ size: 8 });
  const createReplyMutation = useCreateReply();
  const updateReplyMutation = useUpdateReply();
  const pinReviewMutation = usePinReview();

  // 무한 스크롤
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: designerReviewsQuery.hasNextPage ?? false,
    isFetchingNextPage: designerReviewsQuery.isFetchingNextPage,
    fetchNextPage: designerReviewsQuery.fetchNextPage,
  });

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
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">리뷰 관리</h1>
        <div className="size-6" />
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
                isReplying={replyingReviewId === review.reviewId}
                replyContent={replyingReviewId === review.reviewId ? replyContent : ''}
                onReplyContentChange={setReplyContent}
                onReplySubmit={handleReplySubmit}
                onReplyCancel={handleReplyCancel}
                isSubmittingReply={isSubmittingReply}
              />
            ))}

            {/* 무한 스크롤 트리거 */}
            <div ref={loadMoreRef} className="h-4" />

            {/* 추가 로딩 스피너 */}
            {designerReviewsQuery.isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <div className="size-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
