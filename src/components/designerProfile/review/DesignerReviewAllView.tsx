'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import DesignerReviewCard, { DesignerReviewItem } from '@/src/components/designerProfile/review/DesignerReviewCard';
import DesignerReviewPreviewStrip from '@/src/components/designerProfile/review/DesignerReviewPreviewStrip';
import DesignerReviewSummary from '@/src/components/designerProfile/review/DesignerReviewSummary';
import { useInfiniteScroll } from '@/src/hooks/common/useInfiniteScroll';
import {
  useDesignerReviews,
  usePublicDesignerReviewImages,
  usePublicDesignerReviewListInfinite,
} from '@/src/hooks/queries/review';

interface DesignerReviewAllViewProps {
  designerId: number;
  mode?: 'public' | 'owner';
}

export default function DesignerReviewAllView({ designerId, mode = 'public' }: DesignerReviewAllViewProps) {
  const router = useRouter();
  const isOwnerMode = mode === 'owner';
  const canFetchReviews = Number.isFinite(designerId) && designerId > 0;
  const photoPath = isOwnerMode ? '/myProfile/reviews/photos' : `/designer/${designerId}/reviews/photos`;
  const photoDetailBase = photoPath;

  const ownerReviewListQuery = useDesignerReviews({ size: 8 }, { enabled: isOwnerMode && canFetchReviews });

  const publicReviewListQuery = usePublicDesignerReviewListInfinite({
    designerId,
    params: { size: 8 },
    enabled: !isOwnerMode && canFetchReviews,
  });

  const reviewListQuery = isOwnerMode ? ownerReviewListQuery : publicReviewListQuery;

  const reviewImagesQuery = usePublicDesignerReviewImages({
    designerId,
    params: { size: 3 },
    enabled: canFetchReviews,
  });

  const reviewItems = useMemo<DesignerReviewItem[]>(() => {
    const items = reviewListQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
    return items.map((item) => ({
      id: item.reviewId,
      name: item.modelName,
      rating: item.rating,
      date: item.createdDate.replace(/-/g, '.'),
      content: item.content,
      images: item.reviewImages ?? [],
      summary: item.summary,
      isFixed: item.isFixed,
    }));
  }, [reviewListQuery.data?.pages]);

  const summary = useMemo(() => {
    const listItems = reviewListQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
    const totalCount = reviewListQuery.data?.pages[0]?.result?.totalCount ?? listItems.length;
    const totalRating = listItems.reduce((sum, item) => sum + item.rating, 0);
    const rating = listItems.length > 0 ? totalRating / listItems.length : 0;
    const previewItems =
      reviewImagesQuery.data?.result?.items
        ?.map((item) => ({ reviewId: item.reviewId, imageUrl: item.reviewImage }))
        .filter((item): item is { reviewId: number; imageUrl: string } => Boolean(item.imageUrl)) ?? [];
    const previewItemsTrimmed = previewItems.slice(0, 3);
    const totalPreviewCount = reviewImagesQuery.data?.result?.totalCount ?? previewItemsTrimmed.length;
    const moreCount = Math.max(totalPreviewCount - previewItemsTrimmed.length, 0);

    return {
      rating,
      count: totalCount,
      previewItems: previewItemsTrimmed,
      moreCount,
    };
  }, [reviewListQuery.data?.pages, reviewImagesQuery.data?.result]);

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: reviewListQuery.hasNextPage ?? false,
    isFetchingNextPage: reviewListQuery.isFetchingNextPage,
    fetchNextPage: reviewListQuery.fetchNextPage,
  });

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="flex items-center justify-between bg-white px-4 pt-3 pb-[13px]">
        <button
          type="button"
          onClick={handleBack}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">리뷰 전체보기</h1>
        <div className="size-6" />
      </header>

      {!canFetchReviews ? (
        <div className="flex flex-1 items-center justify-center bg-white">
          <p className="text-body-2-medium text-gray-600">잘못된 디자이너 ID입니다.</p>
        </div>
      ) : reviewListQuery.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-2-medium text-gray-500">리뷰를 불러오는 중입니다.</p>
        </div>
      ) : reviewListQuery.isError ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-2-medium text-gray-500">리뷰 정보를 불러올 수 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col pt-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <DesignerReviewSummary rating={summary.rating} count={summary.count} />
          {summary.previewItems.length > 0 && (
            <DesignerReviewPreviewStrip
              previewItems={summary.previewItems}
              moreCount={summary.moreCount}
              showMoreLabel
              onMoreClick={() => router.push(photoPath)}
              onImageClick={(reviewId, imageUrl) =>
                router.push(`${photoDetailBase}/${reviewId}?imageUrl=${encodeURIComponent(imageUrl)}`)
              }
            />
          )}

          <div className="flex flex-col gap-4 px-4 pt-5">
            {reviewItems.length === 0 ? (
              <div className="flex items-center justify-center rounded-2xl bg-white px-4 py-6">
                <p className="text-body-2-medium text-gray-500">등록된 리뷰가 없습니다.</p>
              </div>
            ) : (
              reviewItems.map((review) => (
                <DesignerReviewCard
                  key={review.id}
                  review={review}
                  onImageClick={(reviewId, imageUrl) =>
                    router.push(`${photoDetailBase}/${reviewId}?imageUrl=${encodeURIComponent(imageUrl)}`)
                  }
                />
              ))
            )}

            <div ref={loadMoreRef} className="h-4" />

            {reviewListQuery.isFetchingNextPage && (
              <div className="flex justify-center py-2">
                <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
