'use client';

import Image from 'next/image';
import CircleArrowIcon from '@/public/icons/review/circle_arrow.svg';

interface DesignerReviewPreviewStripProps {
  previewImages: string[];
  moreCount: number;
  totalSlots?: number;
  showMoreLabel?: boolean;
  onMoreClick?: () => void;
}

export default function DesignerReviewPreviewStrip({
  previewImages,
  moreCount,
  totalSlots = 3,
  showMoreLabel = false,
  onMoreClick,
}: DesignerReviewPreviewStripProps) {
  const slots = Array.from({ length: totalSlots });
  const lastPreviewIndex = previewImages.length > 0 ? previewImages.length - 1 : -1;

  return (
    <div className="flex gap-2.5 px-4 pt-4">
      {slots.map((_, index) => {
        const imageUrl = previewImages[index];
        const isLastPreview = index === lastPreviewIndex;

        if (!imageUrl) {
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

        return (
          <div key={`${imageUrl}-${index}`} className="relative aspect-square flex-1 overflow-hidden rounded-[10px]">
            <Image src={imageUrl} alt="" fill sizes="33vw" className="object-cover" />
            {showOverlay &&
              (onMoreClick ? (
                <button
                  type="button"
                  onClick={onMoreClick}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45"
                >
                  {overlayContent}
                </button>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45">{overlayContent}</div>
              ))}
          </div>
        );
      })}
    </div>
  );
}
