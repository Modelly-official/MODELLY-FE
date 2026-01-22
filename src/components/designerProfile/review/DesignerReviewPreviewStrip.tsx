'use client';

import Image from 'next/image';

interface DesignerReviewPreviewStripProps {
  previewImages: string[];
  moreCount: number;
  totalSlots?: number;
}

export default function DesignerReviewPreviewStrip({
  previewImages,
  moreCount,
  totalSlots = 3,
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

        return (
          <div key={`${imageUrl}-${index}`} className="relative aspect-square flex-1 overflow-hidden rounded-[10px]">
            <Image src={imageUrl} alt="" fill sizes="33vw" className="object-cover" />
            {isLastPreview && moreCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-body-1-semibold text-white">+{moreCount}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
