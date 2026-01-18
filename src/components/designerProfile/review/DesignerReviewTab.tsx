'use client';

import DesignerReviewCard, { DesignerReviewItem } from '@/src/components/designerProfile/review/DesignerReviewCard';
import DesignerReviewPreviewStrip from '@/src/components/designerProfile/review/DesignerReviewPreviewStrip';
import DesignerReviewSummary from '@/src/components/designerProfile/review/DesignerReviewSummary';

export interface DesignerReviewSummaryData {
  rating: number;
  count: number;
  previewImages: string[];
  moreCount: number;
}

interface DesignerReviewTabProps {
  summary: DesignerReviewSummaryData;
  reviews: DesignerReviewItem[];
}

export default function DesignerReviewTab({ summary, reviews }: DesignerReviewTabProps) {
  return (
    <div className="bg-gray-100 pt-4 pb-[calc(32px+env(safe-area-inset-bottom))]">
      <DesignerReviewSummary rating={summary.rating} count={summary.count} />
      <DesignerReviewPreviewStrip previewImages={summary.previewImages} moreCount={summary.moreCount} />

      <div className="flex flex-col gap-5 px-4 pt-5">
        {reviews.map((review) => (
          <DesignerReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
