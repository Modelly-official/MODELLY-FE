'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { useInfiniteScroll } from '@/src/hooks/common/useInfiniteScroll';
import {
  useDesignerReviews,
  usePublicDesignerReviewListInfinite,
} from '@/src/hooks/queries/review';

interface DesignerReviewPhotoGalleryViewProps {
  designerId: number;
  mode?: 'public' | 'owner';
}

export default function DesignerReviewPhotoGalleryView({
  designerId,
  mode = 'public',
}: DesignerReviewPhotoGalleryViewProps) {
  const router = useRouter();
  const isOwnerMode = mode === 'owner';
  const canFetchPhotos = Number.isFinite(designerId) && designerId > 0;

  const ownerReviewQuery = useDesignerReviews(
    { size: 12 },
    { enabled: isOwnerMode && canFetchPhotos },
  );

  const publicReviewQuery = usePublicDesignerReviewListInfinite({
    designerId,
    params: { size: 12 },
    enabled: !isOwnerMode && canFetchPhotos,
  });

  const activeQuery = isOwnerMode ? ownerReviewQuery : publicReviewQuery;
  const detailBasePath = isOwnerMode
    ? '/myProfile/reviews/photos'
    : `/designer/${designerId}/reviews/photos`;

  const photoItems = useMemo(() => {
    const items = activeQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
    return items
      .map((item) => ({
        reviewId: item.reviewId,
        imageUrl: item.reviewImages?.[0],
      }))
      .filter((item): item is { reviewId: number; imageUrl: string } => Boolean(item.imageUrl));
  }, [activeQuery.data?.pages]);

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage: activeQuery.hasNextPage ?? false,
    isFetchingNextPage: activeQuery.isFetchingNextPage,
    fetchNextPage: activeQuery.fetchNextPage,
  });

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

      {!canFetchPhotos ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-2-medium text-gray-600">잘못된 디자이너 ID입니다.</p>
        </div>
      ) : activeQuery.isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-2-medium text-gray-500">사진을 불러오는 중입니다.</p>
        </div>
      ) : activeQuery.isError ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body-2-medium text-gray-500">사진을 불러올 수 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 px-4 pt-4 pb-[calc(24px+env(safe-area-inset-bottom))]">
          {photoItems.length === 0 ? (
            <div className="col-span-3 flex items-center justify-center rounded-2xl bg-gray-100 py-8">
              <p className="text-body-2-medium text-gray-500">등록된 사진이 없습니다.</p>
            </div>
          ) : (
            photoItems.map((item, index) => (
              <Link
                key={`${item.reviewId}-${index}`}
                href={`${detailBasePath}/${item.reviewId}`}
                className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
              >
                <Image src={item.imageUrl} alt="" fill sizes="33vw" className="object-cover" />
              </Link>
            ))
          )}

          <div ref={loadMoreRef} className="col-span-3 h-4" />

          {activeQuery.isFetchingNextPage && (
            <div className="col-span-3 flex justify-center py-2">
              <div className="size-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
