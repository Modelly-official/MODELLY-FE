'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DesignerProfileHero from '@/src/components/designerProfile/DesignerProfileHero';
import DesignerProfileIntro from '@/src/components/designerProfile/DesignerProfileIntro';
import DesignerProfileRecruitments from '@/src/components/designerProfile/DesignerProfileRecruitments';
import DesignerPortfolioReviewSection from '@/src/components/designerProfile/DesignerPortfolioReviewSection';
import DesignerProfileActionBar from '@/src/components/designerProfile/DesignerProfileActionBar';
import { usePublicDesignerReviewList, usePublicDesignerReviewThumbnails } from '@/src/hooks/queries/review';
import type { DesignerReviewItem as DesignerReviewCardItem } from '@/src/components/designerProfile/review/DesignerReviewCard';
import type { DesignerReviewSummaryData } from '@/src/components/designerProfile/review/DesignerReviewTab';
import type { DesignerProfileInfo, DesignerRecruitmentCard } from '@/src/types/profile';

interface DesignerProfileViewProps {
  profile: DesignerProfileInfo;
  openRecruitments: DesignerRecruitmentCard[];
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
  portfolioImages = defaultPortfolioImages,
  actionType = 'none',
  showActionBar = false,
  onBack,
  onAction,
}: DesignerProfileViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'review'>('portfolio');
  const [isLiked, setIsLiked] = useState(profile.isLiked);
  const addressParts = [profile.address.line1, profile.address.line2].filter(Boolean);
  const addressLine = addressParts.join(' ');
  const reviewQueryEnabled = activeTab === 'review';

  const reviewListQuery = usePublicDesignerReviewList({
    designerId: profile.designerId,
    params: { size: 10 },
    enabled: reviewQueryEnabled,
  });

  const reviewThumbnailQuery = usePublicDesignerReviewThumbnails({
    designerId: profile.designerId,
    params: { size: 10 },
    enabled: reviewQueryEnabled,
  });

  const reviewItems = useMemo<DesignerReviewCardItem[]>(() => {
    const items = reviewListQuery.data?.result?.items ?? [];
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
  }, [reviewListQuery.data?.result?.items]);

  const reviewSummary = useMemo<DesignerReviewSummaryData>(() => {
    const listResult = reviewListQuery.data?.result;
    const listItems = listResult?.items ?? [];
    const totalCount = listResult?.totalCount ?? listItems.length;
    const totalRating = listItems.reduce((sum, item) => sum + item.rating, 0);
    const rating = listItems.length > 0 ? totalRating / listItems.length : 0;
    const thumbnailItems = reviewThumbnailQuery.data?.result?.items ?? [];
    const thumbnailImages = thumbnailItems.map((item) => item.reviewThumbnail).filter(Boolean);
    const previewImages = thumbnailImages.slice(0, 3);
    const totalPreviewCount = reviewThumbnailQuery.data?.result?.totalCount ?? totalCount ?? thumbnailImages.length;
    const moreCount = Math.max(totalPreviewCount - previewImages.length, 0);

    return {
      rating,
      count: totalCount,
      previewImages,
      moreCount,
    };
  }, [reviewListQuery.data?.result, reviewThumbnailQuery.data?.result]);

  const isReviewLoading = reviewQueryEnabled && reviewListQuery.isLoading;
  const isReviewError = reviewQueryEnabled && reviewListQuery.isError;

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
      router.push('/mypage/profile/edit');
    }
  };

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
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
        <DesignerProfileRecruitments openRecruitments={openRecruitments} />
      </section>

      <DesignerPortfolioReviewSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
        portfolioImages={portfolioImages}
        reviewSummary={reviewSummary}
        reviewItems={reviewItems}
        isReviewLoading={isReviewLoading}
        isReviewError={isReviewError}
      />

      {showActionBar && <DesignerProfileActionBar isLiked={isLiked} onLike={handleLikeToggle} />}
    </div>
  );
}
