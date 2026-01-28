'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChevronRightIcon from '@/public/icons/common/chevron-right.svg';
import KebabMenu from '@/src/components/common/KebabMenu/KebabMenu';

interface DesignerProfileEditPortfolioProps {
  images: string[];
  onViewAll?: () => void;
  onEditImage?: (index: number) => void;
  onDeleteImage?: (index: number) => void;
  title?: string;
  sectionClassName?: string;
  gridClassName?: string;
}

export default function DesignerProfileEditPortfolio({
  images,
  onViewAll,
  onEditImage,
  onDeleteImage,
  title = '포트폴리오',
  sectionClassName = 'rounded-lg bg-white px-4 py-4',
  gridClassName = 'relative mt-3 grid grid-cols-3 gap-2.5',
}: DesignerProfileEditPortfolioProps) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(() => images.map(() => false));
  const [retrySeeds, setRetrySeeds] = useState<number[]>(() => images.map(() => 0));

  const handleImageError = (index: number) => {
    setRetrySeeds((prev) => {
      const current = prev[index] ?? 0;
      if (current >= 2) return prev;
      const next = [...prev];
      next[index] = current + 1;
      return next;
    });
    setImageLoaded((prev) => {
      if (!prev[index]) return prev;
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  return (
    <section className={sectionClassName}>
      <div className="flex items-center justify-between">
        <h2 className="text-body-1-semibold text-gray-900">{title}</h2>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="flex cursor-pointer items-center justify-center text-gray-800"
            aria-label={`${title} 전체보기`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {images.length > 0 ? (
        <div className={gridClassName}>
          {images.map((imageUrl, index) => {
            const isMenuOpen = openMenuIndex === index;
            const isLoaded = imageLoaded[index];
            const seed = retrySeeds[index] ?? 0;
            const separator = imageUrl.includes('?') ? '&' : '?';
            const resolvedSrc = seed > 0 ? `${imageUrl}${separator}retry=${seed}` : imageUrl;
            return (
              <div key={`${imageUrl}-${index}`} className="relative overflow-visible">
                <div className="relative h-[135px] w-full overflow-hidden rounded-2xl bg-gray-200">
                  <Image
                    src={resolvedSrc}
                    alt={`포트폴리오 이미지 ${index + 1}`}
                    fill
                    sizes="33vw"
                    className={`object-cover transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onError={() => handleImageError(index)}
                    onLoad={() => {
                      setImageLoaded((prev) => {
                        if (prev[index]) return prev;
                        const next = [...prev];
                        next[index] = true;
                        return next;
                      });
                    }}
                  />
                </div>
                <KebabMenu
                  isOpen={isMenuOpen}
                  onOpenChange={(open) => setOpenMenuIndex(open ? index : null)}
                  items={[
                    { label: '수정', onClick: () => onEditImage?.(index) },
                    { label: '삭제', onClick: () => onDeleteImage?.(index) },
                  ]}
                  wrapperClassName="absolute top-2 right-2"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 rounded-2xl bg-gray-100 px-4 py-6 text-center">
          <p className="text-body-2-medium text-gray-500">등록된 포트폴리오가 없습니다.</p>
        </div>
      )}
    </section>
  );
}
