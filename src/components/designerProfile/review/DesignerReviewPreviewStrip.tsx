'use client';

import Image from 'next/image';
import CircleArrowIcon from '@/public/icons/review/circle_arrow.svg';
import type { DesignerReviewPreviewItem } from '@/src/components/designerProfile/review/DesignerReviewTab';

interface DesignerReviewPreviewStripProps {
  previewItems: DesignerReviewPreviewItem[];
  moreCount: number;
  totalSlots?: number;
  showMoreLabel?: boolean;
  onMoreClick?: () => void;
  onImageClick?: (reviewId: number, imageUrl: string) => void;
}

export default function DesignerReviewPreviewStrip({
  previewItems,
  moreCount,
  totalSlots = 3,
  showMoreLabel = false,
  onMoreClick,
  onImageClick,
}: DesignerReviewPreviewStripProps) {
  const slots = Array.from({ length: totalSlots });
  const lastPreviewIndex =
    previewItems.length > 0 ? Math.min(previewItems.length, totalSlots) - 1 : -1;

  return (
    <div className="flex gap-2.5 px-4 pt-4">
      {slots.map((_, index) => {
        const item = previewItems[index];
        const isLastPreview = index === lastPreviewIndex;

        if (!item?.imageUrl) {
          return (
            <div key={`preview-placeholder-${index}`} className="aspect-square flex-1 rounded-[10px] bg-transparent" />
          );
        }

        const showOverlay = isLastPreview && moreCount > 0;
        const overlayContent = showMoreLabel ? (
          <div className="flex flex-col items-center gap-1 text-white">
            <CircleArrowIcon className="h-6 w-6 text-white" />
            <span className="text-body-2-medium">더보기</span>
          </div>
        ) : (
          <span className="text-body-1-semibold text-white">+{moreCount}</span>
        );
        const containerClass = "relative aspect-square flex-1 overflow-hidden rounded-[10px]";

        if (showOverlay) {
          return (
            <div key={`${item.reviewId}-${index}`} className={containerClass}>
              <Image src={item.imageUrl} alt="" fill sizes="33vw" className="object-cover" />
              {onMoreClick ? (
                <button
                  type="button"
                  onClick={onMoreClick}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45"
                >
                  {overlayContent}
                </button>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45">{overlayContent}</div>
              )}
            </div>
          );
        }

        if (onImageClick) {
          return (
            <button
              key={`${item.reviewId}-${index}`}
              type="button"
              onClick={() => onImageClick(item.reviewId, item.imageUrl)}
              className={`${containerClass} cursor-pointer`}
            >
              <Image src={item.imageUrl} alt="" fill sizes="33vw" className="object-cover" />
            </button>
          );
        }

        return (
          <div key={`${item.reviewId}-${index}`} className={containerClass}>
            <Image src={item.imageUrl} alt="" fill sizes="33vw" className="object-cover" />
          </div>
        );
      })}
    </div>
  );
}
