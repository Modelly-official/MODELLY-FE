'use client';

import Image from 'next/image';
import ChevronRightIcon from '@/public/icons/common/chevron-right.svg';
import DesignerReviewTab, { DesignerReviewSummaryData } from '@/src/components/designerProfile/review/DesignerReviewTab';
import type { DesignerReviewItem } from '@/src/components/designerProfile/review/DesignerReviewCard';

type DesignerProfileTab = 'portfolio' | 'review';

interface DesignerPortfolioReviewSectionProps {
  activeTab: DesignerProfileTab;
  onTabChange: (tab: DesignerProfileTab) => void;
  portfolioImages: string[];
  reviewSummary: DesignerReviewSummaryData;
  reviewItems: DesignerReviewItem[];
  isReviewLoading?: boolean;
  isReviewError?: boolean;
  onReviewViewAll?: () => void;
  onReviewPreviewMore?: () => void;
}

export default function DesignerPortfolioReviewSection({
  activeTab,
  onTabChange,
  portfolioImages,
  reviewSummary,
  reviewItems,
  isReviewLoading = false,
  isReviewError = false,
  onReviewViewAll,
  onReviewPreviewMore,
}: DesignerPortfolioReviewSectionProps) {
  return (
    <section className="border-gray-200">
      <div className="grid h-13 grid-cols-2 border-b border-gray-400">
        <button
          type="button"
          onClick={() => onTabChange('portfolio')}
          className={`text-body-1-semibold relative cursor-pointer py-3 text-center ${
            activeTab === 'portfolio'
              ? "text-gray-900 after:absolute after:right-0 after:bottom-0 after:left-4 after:h-0.5 after:bg-gray-900 after:content-['']"
              : 'text-gray-600'
          }`}
        >
          포트폴리오
        </button>
        <button
          type="button"
          onClick={() => onTabChange('review')}
          className={`text-body-1-semibold relative cursor-pointer py-3 text-center ${
            activeTab === 'review'
              ? "text-gray-900 after:absolute after:right-4 after:bottom-0 after:left-0 after:h-0.5 after:bg-gray-900 after:content-['']"
              : 'text-gray-600'
          }`}
        >
          리뷰
        </button>
      </div>

      {activeTab === 'portfolio' ? (
        <>
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex gap-1">
              <span className="text-body-1-medium text-black">전체</span>
              <span className="text-body-1-semibold text-gray-600">{portfolioImages.length}</span>
            </div>
            <button type="button" className="text-body-2-medium flex items-center justify-center gap-0.5 text-gray-800">
              자세히 보기
              <ChevronRightIcon className="h-5 w-5 -translate-y-px text-gray-800" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2.5 px-4 pt-3 pb-[calc(32px+env(safe-area-inset-bottom))]">
            {portfolioImages.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="relative h-[151px] w-full overflow-hidden rounded-lg bg-gray-200"
              >
                <Image
                  src={imageUrl}
                  alt={`포트폴리오 이미지 ${index + 1}`}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </>
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
            <DesignerReviewTab
              summary={reviewSummary}
              reviews={reviewItems}
              onViewAll={onReviewViewAll}
              onPreviewMore={onReviewPreviewMore}
            />
          )}
        </>
      )}
    </section>
  );
}
