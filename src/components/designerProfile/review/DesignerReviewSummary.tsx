'use client';

import ChevronRightIcon from '@/public/icons/common/chevron-right.svg';
import DesignerReviewStars from '@/src/components/designerProfile/review/DesignerReviewStars';

interface DesignerReviewSummaryProps {
  rating: number;
  count: number;
  onViewAll?: () => void;
}

export default function DesignerReviewSummary({ rating, count, onViewAll }: DesignerReviewSummaryProps) {
  return (
    <div className="flex h-6 items-center justify-between px-4">
      <div className="flex items-center gap-1">
        <DesignerReviewStars rating={rating} />
        <span className="text-body-1-semibold text-gray-900">{rating.toFixed(1)}</span>
        <span className="text-body-2-semibold text-gray-500">({count})</span>
      </div>
      {onViewAll && count > 0 && (
        <button
          type="button"
          onClick={onViewAll}
          className="text-body-2-medium flex cursor-pointer items-center justify-center gap-0.5 text-gray-800"
        >
          전체보기
          <ChevronRightIcon className="h-5 w-5 -translate-y-px text-gray-800" />
        </button>
      )}
    </div>
  );
}
