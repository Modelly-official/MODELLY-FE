'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  ImageGallery,
  PostTabs,
  AvailableDates,
  InfoSection,
  PostActions,
  PostPageSkeleton,
} from '@/src/components/post';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import DesignerReviewTab from '@/src/components/designerProfile/review/DesignerReviewTab';
import type { DesignerReviewItem as DesignerReviewCardItem } from '@/src/components/designerProfile/review/DesignerReviewCard';
import type { DesignerReviewSummaryData } from '@/src/components/designerProfile/review/DesignerReviewTab';
import { useRecruitmentDetail } from '@/src/hooks/queries/explore';
import { useToggleRecruitmentLike } from '@/src/hooks/queries/likes';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useMyDesignerProfile } from '@/src/hooks/queries/profile';
import {
  useDesignerReviews,
  usePublicDesignerReviewList,
  usePublicDesignerReviewThumbnails,
} from '@/src/hooks/queries/review';
import CheckIcon from '@/public/icons/post/check.svg';
import CloseIcon from '@/public/icons/common/close.svg';

interface PostDetailContentProps {
  recruitmentId: number;
  isOwner?: boolean; // 본인 공고 여부 (디자이너가 자기 공고 볼 때)
}

export default function PostDetailContent({ recruitmentId, isOwner = false }: PostDetailContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'detail' | 'review'>('detail');

  // Optimistic update를 위한 토글 카운트 (홀수면 반전)
  const [toggleCount, setToggleCount] = useState(0);
  const [trackedServerValue, setTrackedServerValue] = useState<boolean | null>(null);
  const { authReady, role, user, isLoggedIn } = useAuthReady();
  const { data: myProfileData } = useMyDesignerProfile({
    enabled: authReady && isLoggedIn && role === 'designer' && !isOwner,
  });

  // Query hook
  const { data, isLoading, isError } = useRecruitmentDetail(recruitmentId);

  // Like mutation
  const { mutate: toggleLike } = useToggleRecruitmentLike();

  const reviewDesignerId = data?.result?.designerProfile.designerId ?? 0;
  const canFetchReviews = Number.isFinite(reviewDesignerId) && reviewDesignerId > 0;
  const reviewQueryEnabled = activeTab === 'review' && canFetchReviews;
  const myDesignerId = myProfileData?.result?.profile.designerId;
  const isOwnerFromAuth =
    authReady && role === 'designer' && user?.userId === data?.result?.designerProfile.userId;
  const isOwnerFromProfile =
    role === 'designer' && !!myDesignerId && myDesignerId === data?.result?.designerProfile.designerId;
  const isOwnerView = isOwner || isOwnerFromAuth || isOwnerFromProfile;

  const ownerReviewListQuery = useDesignerReviews(
    { size: 10 },
    { enabled: reviewQueryEnabled && isOwnerView },
  );

  const reviewListQuery = usePublicDesignerReviewList({
    designerId: reviewDesignerId,
    params: { size: 10 },
    enabled: reviewQueryEnabled && !isOwnerView,
  });

  const reviewThumbnailQuery = usePublicDesignerReviewThumbnails({
    designerId: reviewDesignerId,
    params: { size: 10 },
    enabled: reviewQueryEnabled,
  });

  const reviewItems = useMemo<DesignerReviewCardItem[]>(() => {
    const ownerItems = ownerReviewListQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
    const publicItems = reviewListQuery.data?.result?.items ?? [];
    const items = isOwnerView ? ownerItems : publicItems;
    return items.map((item) => ({
      id: item.reviewId,
      name: item.modelName,
      rating: item.rating,
      date: item.createdDate.replace(/-/g, '.'),
      content: item.content,
      images: item.reviewImages ?? [],
      category: item.summary,
      isFixed: item.isFixed,
    }));
  }, [isOwnerView, ownerReviewListQuery.data?.pages, reviewListQuery.data?.result?.items]);

  const reviewSummary = useMemo<DesignerReviewSummaryData>(() => {
    const publicResult = reviewListQuery.data?.result;
    const ownerPages = ownerReviewListQuery.data?.pages ?? [];
    const ownerItems = ownerPages.flatMap((page) => page.result?.items ?? []);
    const ownerTotalCount = ownerPages[0]?.result?.totalCount;
    const listItems = isOwnerView ? ownerItems : publicResult?.items ?? [];
    const totalCount = isOwnerView
      ? ownerTotalCount ?? listItems.length
      : publicResult?.totalCount ?? data?.result?.reviewCount ?? listItems.length;
    const totalRating = listItems.reduce((sum, item) => sum + item.rating, 0);
    const rating = listItems.length > 0 ? totalRating / listItems.length : (data?.result?.averageRating ?? 0);
    const thumbnailItems = reviewThumbnailQuery.data?.result?.items ?? [];
    const thumbnailImages = thumbnailItems.map((item) => item.reviewThumbnail).filter(Boolean);
    const previewImages = thumbnailImages.slice(0, 3);
    const totalPreviewCount = reviewThumbnailQuery.data?.result?.totalCount ?? thumbnailImages.length ?? totalCount;
    const moreCount = Math.max(totalPreviewCount - previewImages.length, 0);

    return {
      rating,
      count: totalCount,
      previewImages,
      moreCount,
    };
  }, [
    data?.result?.averageRating,
    data?.result?.reviewCount,
    isOwnerView,
    ownerReviewListQuery.data?.pages,
    reviewListQuery.data?.result,
    reviewThumbnailQuery.data?.result,
  ]);

  const isReviewLoading = reviewQueryEnabled
    ? isOwnerView
      ? ownerReviewListQuery.isLoading
      : reviewListQuery.isLoading
    : false;
  const isReviewError = reviewQueryEnabled
    ? isOwnerView
      ? ownerReviewListQuery.isError
      : reviewListQuery.isError || !canFetchReviews
    : false;

  // 서버 값이 변경되면 토글 카운트 리셋 (렌더 중 상태 업데이트 - React 권장 패턴)
  const serverIsLiked = data?.result?.isLiked ?? false;
  if (trackedServerValue !== null && trackedServerValue !== serverIsLiked) {
    setToggleCount(0);
    setTrackedServerValue(serverIsLiked);
  } else if (trackedServerValue === null && data?.result) {
    setTrackedServerValue(serverIsLiked);
  }

  // 로딩 중
  if (isLoading) {
    return <PostPageSkeleton />;
  }

  // 에러 또는 데이터 없음
  if (isError || !data?.result) {
    return notFound();
  }

  const detail = data.result;

  const reviewDetailPath = isOwnerView
    ? '/myProfile/reviews'
    : `/designer/${detail.designerProfile.designerId}/reviews`;

  // 서버 상태 + 로컬 토글 카운트로 현재 상태 계산
  const isLiked = toggleCount % 2 === 0 ? detail.isLiked : !detail.isLiked;

  const handleFavoriteClick = () => {
    setToggleCount((prev) => prev + 1); // Optimistic update
    toggleLike(recruitmentId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 이미지 갤러리 */}
      <ImageGallery images={detail.imageUrls} />

      {/* 제목 및 찜하기 */}
      <div className="flex items-center justify-between gap-4 px-4 pt-4">
        <h1 className="text-head-2-semibold flex-1 text-gray-900">{detail.title}</h1>
        {!isOwnerView && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center"
          >
            <Image
              src={isLiked ? '/icons/common/heart-active.svg' : '/icons/common/heart.svg'}
              alt="찜하기"
              width={20}
              height={20}
            />
          </button>
        )}
      </div>

      {/* 디자이너 정보 */}
      <div className="px-4 pt-2">
        <Link
          href={isOwnerView ? '/myProfile' : `/designer/${detail.designerProfile.designerId}`}
          className="flex flex-col gap-1"
        >
          <div className="flex w-fit items-center gap-1 rounded-lg border border-gray-400 px-2.5 py-1">
            <span className="text-body-2-medium text-black">{detail.designerProfile.designerName} 디자이너</span>
            <span className="text-body-2-medium text-black">·</span>
            <span className="text-body-2-medium mr-1 text-black">{detail.designerProfile.shop}</span>
            <Image src="/icons/common/arrow-right.svg" alt="디자이너 정보" width={6} height={10} />
          </div>

          <div className="flex flex-col gap-1">
            {/* 위치 */}
            <div className="flex items-center gap-1">
              <Image src="/icons/common/location.svg" alt="위치" width={12} height={12} />
              <span className="text-body-2-medium text-gray-900">{detail.designerProfile.shopAddress}</span>
            </div>

            {/* 별점 및 리뷰 */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <Image src="/icons/common/star.svg" alt="별점" width={16} height={16} />
                <span className="text-body-2-medium text-gray-900">{detail.averageRating?.toFixed(1) ?? '0.0'}</span>
              </div>
              <span className="text-body-2-medium text-gray-900">·</span>
              <span className="text-body-2-medium text-gray-900">리뷰 {detail.reviewCount ?? 0}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* 탭 */}
      <div className="mt-6">
        <PostTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 탭 내용 */}
      {activeTab === 'detail' ? (
        <div className="flex flex-col gap-2 bg-gray-100 px-4 py-4 pb-33">
          {/* 시술 내용 */}
          <div className="flex flex-col gap-2 rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-body-2-semibold text-gray-900">시술 내용</h3>
              <div className="flex gap-1">
                {detail.subCategories.map((subCategory) => (
                  <CategoryBadge key={subCategory} category={subCategory} />
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-gray-100 px-4 py-3">
              <p className="text-body-2-medium whitespace-pre-wrap text-black">{detail.content}</p>
            </div>
          </div>

          {/* 시술 가능한 날짜 */}
          <div className="flex flex-col gap-2 rounded-2xl bg-white p-4">
            <h3 className="text-body-2-semibold text-gray-900">시술 가능한 날짜</h3>
            <AvailableDates schedules={detail.recruitmentSchedule} />
          </div>

          {/* 모집 목적 */}
          {detail.goal1 && (
            <div className="rounded-2xl bg-white p-4">
              <InfoSection title="모델 모집 목적" content={detail.goal1} />
            </div>
          )}

          {/* 전달 사항 */}
          {detail.notice && (
            <div className="rounded-2xl bg-white p-4">
              <InfoSection title="전달 사항" content={detail.notice} />
            </div>
          )}

          {/* 유의사항 */}
          {detail.restriction && (
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4">
              <h3 className="text-body-2-semibold text-gray-900">유의사항</h3>
              <div className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3">
                <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-gray-800">
                  <CloseIcon className="text-white" />
                </div>
                <p className="text-body-2-medium flex-1 whitespace-pre-wrap text-black">{detail.restriction}</p>
              </div>
            </div>
          )}

          {/* 사전 동의사항 */}
          {(detail.agreeVideo || detail.agreeInsta || detail.agreeMosaic || detail.etc) && (
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4">
              <h3 className="text-body-2-semibold text-gray-900">사전 동의사항</h3>
              {detail.agreeVideo && (
                <div className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3">
                  <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-purple-600">
                    <CheckIcon className="text-white" />
                  </div>
                  <p className="text-body-2-medium flex-1 text-black">영상 촬영</p>
                </div>
              )}
              {detail.agreeInsta && (
                <div className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3">
                  <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-purple-600">
                    <CheckIcon className="text-white" />
                  </div>
                  <p className="text-body-2-medium flex-1 text-black">인스타 업로드</p>
                </div>
              )}
              {detail.agreeMosaic && (
                <div className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3">
                  <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-purple-600">
                    <CheckIcon className="text-white" />
                  </div>
                  <p className="text-body-2-medium flex-1 text-black">모자이크 가능</p>
                </div>
              )}
              {detail.etc && (
                <div className="flex items-start gap-3 rounded-lg bg-gray-100 px-4 py-3">
                  <div className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-purple-600">
                    <CheckIcon className="text-white" />
                  </div>
                  <p className="text-body-2-medium flex-1 text-black">{detail.etc}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {isReviewLoading ? (
            <div className="flex items-center justify-center bg-gray-100 py-12">
              <p className="text-body-2-medium text-gray-500">리뷰를 불러오는 중입니다.</p>
            </div>
          ) : isReviewError ? (
            <div className="flex items-center justify-center bg-gray-100 py-12">
              <p className="text-body-2-medium text-gray-500">리뷰 정보를 불러올 수 없습니다.</p>
            </div>
          ) : (
            <div className="bg-gray-100 pb-25">
              <DesignerReviewTab
                summary={reviewSummary}
                reviews={reviewItems}
                onViewAll={() => router.push(reviewDetailPath)}
                onPreviewMore={() => router.push(`${reviewDetailPath}/photos`)}
              />
            </div>
          )}
        </>
      )}

      {/* 하단 액션 버튼 */}
      {isOwner ? (
        // 본인 공고: 수정하기 버튼
        <div className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-white px-4 py-3 sm:w-[375px]">
          <button
            type="button"
            onClick={() => router.push(`/myRecruitment/${recruitmentId}/edit`)}
            className="text-body-1-semibold h-14 w-full cursor-pointer rounded-full bg-gray-900 text-white"
          >
            수정하기
          </button>
        </div>
      ) : (
        // 다른 사람 공고: 채팅하기 / 예약하기
        <PostActions recruitmentId={detail.recruitmentId} designerUserId={detail.designerProfile.userId} />
      )}
    </div>
  );
}
