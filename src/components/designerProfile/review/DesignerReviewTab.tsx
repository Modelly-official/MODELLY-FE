'use client';

import DesignerReviewCard, { DesignerReviewItem } from '@/src/components/designerProfile/review/DesignerReviewCard';
import DesignerReviewPreviewStrip from '@/src/components/designerProfile/review/DesignerReviewPreviewStrip';
import DesignerReviewSummary from '@/src/components/designerProfile/review/DesignerReviewSummary';
import RightArrowIcon from '@/public/icons/common/arrow-right.svg';

export interface DesignerReviewPreviewItem {
  reviewId: number;
  imageUrl: string;
}

export interface DesignerReviewSummaryData {
  rating: number;
  count: number;
  previewItems: DesignerReviewPreviewItem[];
  moreCount: number;
}

interface DesignerReviewTabProps {
  summary: DesignerReviewSummaryData;
  reviews: DesignerReviewItem[];
  onViewAll?: () => void;
  onPreviewMore?: () => void;
  showPreviewMoreLabel?: boolean;
  onPreviewImageClick?: (reviewId: number, imageUrl: string) => void;
}

export default function DesignerReviewTab({
  summary,
  reviews,
  onViewAll,
  onPreviewMore,
  showPreviewMoreLabel = false,
  onPreviewImageClick,
}: DesignerReviewTabProps) {
  return (
    <div className="bg-gray-100 pt-4 pb-[calc(24px+env(safe-area-inset-bottom))]">
      <DesignerReviewSummary rating={summary.rating} count={summary.count} onViewAll={onViewAll} />
      {summary.previewItems.length > 0 && (
        <DesignerReviewPreviewStrip
          previewItems={summary.previewItems}
          moreCount={summary.moreCount}
          showMoreLabel={showPreviewMoreLabel}
          onMoreClick={onPreviewMore}
          onImageClick={onPreviewImageClick}
        />
      )}

      <div className="flex flex-col px-4 pt-5">
        <div className="flex flex-col gap-5">
          {reviews.length > 0 ? (
            reviews.map((review) => <DesignerReviewCard key={review.id} review={review} />)
          ) : (
            <div className="flex items-center justify-center rounded-2xl bg-white px-4 py-6">
              <p className="text-body-2-medium text-gray-500">등록된 리뷰가 없습니다.</p>
            </div>
          )}
        </div>
        {onViewAll && reviews.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onViewAll}
              className="text-body-2-medium flex cursor-pointer items-center rounded-[34px] border border-gray-400 bg-white py-2 pr-2 pl-3.5 text-gray-900"
            >
              리뷰 전체보기
              <RightArrowIcon className="h-6 scale-[0.7] text-gray-900" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
