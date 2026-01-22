'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { useEffect, useMemo, useId } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import PinIcon from '@/public/icons/common/pin.svg';
import ProfilePlaceholderIcon from '@/public/icons/designer-home/profile-placeholder-sm.svg';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import DesignerReviewStars from '@/src/components/designerProfile/review/DesignerReviewStars';
import { useDesignerReviews, usePublicDesignerReviewListInfinite } from '@/src/hooks/queries/review';

interface DesignerReviewPhotoDetailViewProps {
  designerId: number;
  reviewId: number;
  mode?: 'public' | 'owner';
}

export default function DesignerReviewPhotoDetailView({
  designerId,
  reviewId,
  mode = 'public',
}: DesignerReviewPhotoDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOwnerMode = mode === 'owner';
  const paginationId = useId().replace(/:/g, '');
  const canFetchReviews = Number.isFinite(designerId) && designerId > 0 && reviewId > 0;

  const ownerReviewQuery = useDesignerReviews({ size: 10 }, { enabled: isOwnerMode && canFetchReviews });

  const publicReviewQuery = usePublicDesignerReviewListInfinite({
    designerId,
    params: { size: 10 },
    enabled: !isOwnerMode && canFetchReviews,
  });

  const reviewListQuery = isOwnerMode ? ownerReviewQuery : publicReviewQuery;

  const reviewItem = useMemo(() => {
    const items = reviewListQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
    return items.find((item) => item.reviewId === reviewId);
  }, [reviewId, reviewListQuery.data?.pages]);

  useEffect(() => {
    if (!canFetchReviews || reviewItem || !reviewListQuery.hasNextPage || reviewListQuery.isFetchingNextPage) return;
    reviewListQuery.fetchNextPage();
  }, [
    canFetchReviews,
    reviewItem,
    reviewListQuery,
  ]);

  const reviewImages = reviewItem?.reviewImages ?? [];
  const displayDate = reviewItem?.createdDate ? reviewItem.createdDate.replace(/-/g, '.') : '';
  const initialIndex = useMemo(() => {
    const rawIndex = Number(searchParams.get('imageIndex'));
    if (!Number.isFinite(rawIndex)) return 0;
    const clamped = Math.max(0, Math.min(rawIndex, reviewImages.length - 1));
    return Number.isNaN(clamped) ? 0 : clamped;
  }, [reviewImages.length, searchParams]);

  if (!canFetchReviews) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-600">잘못된 리뷰 정보입니다.</p>
      </div>
    );
  }

  if (reviewListQuery.isLoading && !reviewItem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-500">리뷰를 불러오는 중입니다.</p>
      </div>
    );
  }

  if (!reviewItem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-body-2-medium text-gray-500">리뷰 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between px-4 pt-3 pb-[13px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">사진 모아보기</h1>
        <div className="size-6" />
      </header>

      <div className="relative aspect-square w-full overflow-visible pt-3">
        {reviewImages.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-body-2-medium text-gray-500">사진이 없습니다.</p>
          </div>
        ) : (
          <>
            <Swiper
              modules={[Pagination]}
              pagination={{
                el: `#${paginationId}`,
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
                bulletActiveClass: '!bg-gray-900',
              }}
              initialSlide={initialIndex}
              className="size-full"
            >
              {reviewImages.map((imageUrl, index) => (
                <SwiperSlide key={`${imageUrl}-${index}`}>
                  <div className="relative size-full">
                    <Image
                      src={imageUrl}
                      alt={`리뷰 이미지 ${index + 1}`}
                      fill
                      sizes="(max-width: 375px) 100vw, 375px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <style jsx global>{`
              .swiper-pagination-bullet {
                width: 6px;
                height: 6px;
                margin: 0 3px !important;
              }
            `}</style>
          </>
        )}
        {reviewImages.length > 1 && (
          <div
            id={paginationId}
            className="absolute right-0 left-0 flex justify-center"
            style={{ top: 'calc(100% + 16px)' }}
          />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2 px-4 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              {reviewItem.modelImage ? (
                <Image
                  src={reviewItem.modelImage}
                  alt={reviewItem.modelName}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <ProfilePlaceholderIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-body-1-semibold text-gray-900">{reviewItem.modelName}</span>
              <DesignerReviewStars rating={reviewItem.rating} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {reviewItem.isFixed && <PinIcon className="h-5 w-5 text-gray-700" />}
            <span className="text-caption-1-medium text-gray-500">{displayDate}</span>
          </div>
        </div>

        <p className="text-body-2-regular pt-2 whitespace-pre-line text-gray-700">{reviewItem.content}</p>
        <div className="flex">
          <CategoryBadge label={reviewItem.summary} />
        </div>
      </div>
    </div>
  );
}
