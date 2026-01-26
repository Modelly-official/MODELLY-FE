'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DesignerProfileHero from '@/src/components/designerProfile/DesignerProfileHero';
import DesignerProfileIntro from '@/src/components/designerProfile/DesignerProfileIntro';
import DesignerProfileRecruitments from '@/src/components/designerProfile/DesignerProfileRecruitments';
import DesignerPortfolioReviewSection from '@/src/components/designerProfile/DesignerPortfolioReviewSection';
import DesignerProfileActionBar from '@/src/components/designerProfile/DesignerProfileActionBar';
import {
  useDesignerReviews,
  usePublicDesignerReviewList,
  usePublicDesignerReviewThumbnails,
} from '@/src/hooks/queries/review';
import { useToggleDesignerLike } from '@/src/hooks/queries/likes';
import { useCreateChatRoom } from '@/src/hooks/queries/chat';
import { useToast } from '@/src/hooks/common/useToast';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import type { DesignerReviewItem as DesignerReviewCardItem } from '@/src/components/designerProfile/review/DesignerReviewCard';
import type { DesignerReviewSummaryData } from '@/src/components/designerProfile/review/DesignerReviewTab';
import type { DesignerProfileInfo, DesignerRecruitmentCard } from '@/src/types/profile';
import type { DesignerPortfolioListItem } from '@/src/types/portfolio';

interface DesignerProfileViewProps {
  profile: DesignerProfileInfo;
  openRecruitments: DesignerRecruitmentCard[];
  portfolioItems?: DesignerPortfolioListItem[];
  portfolioImages?: string[];
  actionType?: 'edit' | 'share' | 'none';
  showActionBar?: boolean;
  onBack?: () => void;
  onAction?: () => void;
}

const defaultPortfolioImages = [
  '/images/mocks/portfolio-1.png',
  '/images/mocks/portfolio-2.png',
  '/images/mocks/portfolio-3.png',
  '/images/mocks/portfolio-4.png',
  '/images/mocks/portfolio-5.png',
  '/images/mocks/portfolio-6.png',
  '/images/mocks/hair-1.png',
  '/images/mocks/hair-2.png',
  '/images/mocks/hair-3.png',
];

export default function DesignerProfileView({
  profile,
  openRecruitments,
  portfolioItems,
  portfolioImages = defaultPortfolioImages,
  actionType = 'none',
  showActionBar = false,
  onBack,
  onAction,
}: DesignerProfileViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'review'>('portfolio');
  const [isLiked, setIsLiked] = useState(profile.isLiked);
  const { mutate: toggleLike } = useToggleDesignerLike();
  const createChatRoom = useCreateChatRoom();
  const { showToast } = useToast();
  const { authReady, isLoggedIn } = useAuthReady();
  const addressParts = [profile.address.line1, profile.address.line2].filter(Boolean);
  const addressLine = addressParts.join(' ');
  const isOwnerProfile = actionType === 'edit';
  const reviewQueryEnabled = activeTab === 'review';
  const reviewDesignerId = Number(profile.designerId ?? profile.designerUserId);
  const canFetchPublicReviews = Number.isFinite(reviewDesignerId) && reviewDesignerId > 0;

  const designerReviewsQuery = useDesignerReviews({ size: 10 }, { enabled: reviewQueryEnabled && isOwnerProfile });

  const reviewListQuery = usePublicDesignerReviewList({
    designerId: reviewDesignerId,
    params: { size: 10 },
    enabled: reviewQueryEnabled && !isOwnerProfile && canFetchPublicReviews,
  });

  const reviewThumbnailQuery = usePublicDesignerReviewThumbnails({
    designerId: reviewDesignerId,
    params: { size: 10 },
    enabled: reviewQueryEnabled && canFetchPublicReviews,
  });

  const reviewItems = useMemo<DesignerReviewCardItem[]>(() => {
    const publicItems = reviewListQuery.data?.result?.items ?? [];
    const ownerItems = designerReviewsQuery.data?.pages.flatMap((page) => page.result?.items ?? []) ?? [];
    const items = isOwnerProfile ? ownerItems : publicItems;
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
  }, [designerReviewsQuery.data?.pages, isOwnerProfile, reviewListQuery.data?.result?.items]);

  const reviewSummary = useMemo<DesignerReviewSummaryData>(() => {
    const publicResult = reviewListQuery.data?.result;
    const ownerPages = designerReviewsQuery.data?.pages ?? [];
    const ownerItems = ownerPages.flatMap((page) => page.result?.items ?? []);
    const ownerTotalCount = ownerPages[0]?.result?.totalCount;
    const listItems = isOwnerProfile ? ownerItems : (publicResult?.items ?? []);
    const totalCount = isOwnerProfile
      ? (ownerTotalCount ?? listItems.length)
      : (publicResult?.totalCount ?? listItems.length);
    const totalRating = listItems.reduce((sum, item) => sum + item.rating, 0);
    const rating = listItems.length > 0 ? totalRating / listItems.length : 0;
    const thumbnailResult = reviewThumbnailQuery.data?.result;
    const thumbnailItems = thumbnailResult?.items ?? [];
    const fallbackPreviewItems = listItems
      .map((item) => ({ reviewId: item.reviewId, imageUrl: item.reviewImages?.[0] }))
      .filter((item): item is { reviewId: number; imageUrl: string } => Boolean(item.imageUrl));
    const previewSourceItems =
      thumbnailItems.length > 0
        ? thumbnailItems
            .map((item) => ({ reviewId: item.reviewId, imageUrl: item.reviewThumbnail }))
            .filter((item): item is { reviewId: number; imageUrl: string } => Boolean(item.imageUrl))
        : fallbackPreviewItems;
    const previewImages = previewSourceItems.slice(0, 3).map((item) => item.imageUrl);
    const totalPreviewCount =
      thumbnailItems.length > 0
        ? thumbnailResult?.hasNext
          ? (thumbnailResult?.totalCount ?? previewSourceItems.length ?? totalCount)
          : previewSourceItems.length
        : (previewSourceItems.length ?? totalCount);
    const moreCount = Math.max(totalPreviewCount - previewImages.length, 0);

    return {
      rating,
      count: totalCount,
      previewImages,
      moreCount,
    };
  }, [
    designerReviewsQuery.data?.pages,
    isOwnerProfile,
    reviewListQuery.data?.result,
    reviewThumbnailQuery.data?.result,
  ]);

  const isReviewLoading = reviewQueryEnabled
    ? isOwnerProfile
      ? designerReviewsQuery.isLoading
      : reviewListQuery.isLoading
    : false;
  const isReviewError = reviewQueryEnabled
    ? isOwnerProfile
      ? designerReviewsQuery.isError
      : reviewListQuery.isError || !canFetchPublicReviews
    : false;

  const reviewDetailPath = isOwnerProfile
    ? '/myProfile/reviews'
    : canFetchPublicReviews
      ? `/designer/${reviewDesignerId}/reviews`
      : '';

  const handleReviewViewAll = () => {
    if (!reviewDetailPath) return;
    router.push(reviewDetailPath);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }
    if (actionType === 'edit') {
      router.push('/myProfile/edit');
      return;
    }
    if (actionType === 'share') {
      if (typeof window === 'undefined') return;
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({ url: shareUrl }).catch(() => {
          // 사용자가 공유 시트 닫아도 에러 토스트 띄우지 않음
        });
        return;
      }
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => showToast('공유 링크가 복사되었습니다.'))
          .catch(() => showToast('공유 링크 복사에 실패했습니다.'));
        return;
      }
      showToast('공유 링크를 복사할 수 없습니다.');
    }
  };

  const handleLikeToggle = () => {
    if (!Number.isFinite(profile.designerId) || profile.designerId <= 0) return;
    setIsLiked((prev) => !prev);
    toggleLike(profile.designerId, {
      onError: () => {
        setIsLiked((prev) => !prev);
      },
    });
  };

  const resolvedPortfolioImages = useMemo(() => {
    if (portfolioItems && portfolioItems.length > 0) {
      return portfolioItems.map((item) => item.thumbnail);
    }
    return portfolioImages;
  }, [portfolioItems, portfolioImages]);

  const resolvedPortfolioIds = useMemo(() => {
    if (!portfolioItems || portfolioItems.length === 0) return undefined;
    return portfolioItems.map((item) => item.portfolioId);
  }, [portfolioItems]);

  const handlePortfolioViewAll = () => {
    if (!Number.isFinite(profile.designerId) || profile.designerId <= 0) return;
    router.push(`/designer/portfolio?designerId=${profile.designerId}`);
  };

  const handlePortfolioSelect = (portfolioId: number) => {
    if (!Number.isFinite(profile.designerId) || profile.designerId <= 0) return;
    router.push(`/designer/portfolio?designerId=${profile.designerId}&portfolioId=${portfolioId}`);
  };

  const handleChat = () => {
    if (!authReady) return;
    if (!isLoggedIn) {
      showToast('로그인이 필요한 기능입니다.');
      return;
    }
    if (!Number.isFinite(profile.designerUserId) || profile.designerUserId <= 0) {
      showToast('채팅 대상 정보를 찾을 수 없습니다.');
      return;
    }
    createChatRoom.mutate(profile.designerUserId, {
      onSuccess: (response) => {
        router.push(`/chat/${response.result.chatRoomId}`);
      },
      onError: () => {
        showToast('채팅방 생성에 실패했습니다');
      },
    });
  };

  return (
    <div className={`flex min-h-screen flex-col bg-white ${showActionBar ? 'pb-[76px]' : ''}`}>
      <DesignerProfileHero
        profileImageUrl={profile.profileImageUrl}
        nickname={profile.nickname}
        shop={profile.shop}
        addressLine={addressLine}
        actionType={actionType}
        onBack={handleBack}
        onAction={handleAction}
      />

      <section className="flex flex-col gap-1 px-4 pt-5 pb-3">
        <DesignerProfileIntro intro={profile.intro} />
        <DesignerProfileRecruitments openRecruitments={openRecruitments} isOwner={isOwnerProfile} />
      </section>

      <DesignerPortfolioReviewSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
        portfolioImages={resolvedPortfolioImages}
        portfolioIds={resolvedPortfolioIds}
        reviewSummary={reviewSummary}
        reviewItems={reviewItems}
        isReviewLoading={isReviewLoading}
        isReviewError={isReviewError}
        onPortfolioViewAll={handlePortfolioViewAll}
        onPortfolioSelect={handlePortfolioSelect}
        onReviewViewAll={handleReviewViewAll}
      />

      {showActionBar && <DesignerProfileActionBar isLiked={isLiked} onLike={handleLikeToggle} onChat={handleChat} />}
    </div>
  );
}
