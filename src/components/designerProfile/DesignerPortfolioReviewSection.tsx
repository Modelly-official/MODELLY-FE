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
}

const reviewSummary: DesignerReviewSummaryData = {
  rating: 5.0,
  count: 42,
  previewImages: ['/images/mocks/portfolio-1.png', '/images/mocks/portfolio-2.png', '/images/mocks/portfolio-3.png'],
  moreCount: 23,
};

const reviewItems: DesignerReviewItem[] = [
  {
    id: 1,
    name: '무무',
    rating: 5,
    date: '2025.11.13',
    content:
      '레이어드 컷으로 롱헤어 정리했는데 너무 가벼워지고 분위기가 살아났어요! 층이 자연스럽게 떨어져서 드라이만 해도 예쁘게 정리돼요. 만족도 최고 ✨',
    images: ['/images/mocks/portfolio-1.png'],
    category: '커트',
  },
  {
    id: 2,
    name: '듀듀',
    rating: 5,
    date: '2025.11.13',
    content: '컬이 자연스럽고 유지도 오래 가요. 손질법도 자세히 알려주셔서 좋았습니다.',
    images: ['/images/mocks/portfolio-2.png', '/images/mocks/portfolio-3.png'],
    category: '펌',
  },
];

export default function DesignerPortfolioReviewSection({
  activeTab,
  onTabChange,
  portfolioImages,
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
        <DesignerReviewTab summary={reviewSummary} reviews={reviewItems} />
      )}
    </section>
  );
}
