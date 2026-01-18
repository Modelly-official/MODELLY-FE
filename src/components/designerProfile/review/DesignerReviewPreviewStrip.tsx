'use client';

import Image from 'next/image';

interface DesignerReviewPreviewStripProps {
  previewImages: string[];
  moreCount: number;
}

export default function DesignerReviewPreviewStrip({ previewImages, moreCount }: DesignerReviewPreviewStripProps) {
  return (
    <div className="flex gap-2.5 px-4 pt-4">
      {previewImages.map((imageUrl, index) => {
        const isLast = index === previewImages.length - 1;
        return (
          <div key={`${imageUrl}-${index}`} className="relative aspect-square flex-1 overflow-hidden rounded-[10px]">
            <Image src={imageUrl} alt="" fill sizes="33vw" className="object-cover" />
            {isLast && moreCount > 0 && (
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
