'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChevronRightIcon from '@/public/icons/common/chevron-right.svg';
import DesignerProfileEditMenu from '@/src/components/designerProfile/edit/DesignerProfileEditMenu';

interface DesignerProfileEditPortfolioProps {
  images: string[];
  onViewAll?: () => void;
  onEditImage?: (index: number) => void;
  onDeleteImage?: (index: number) => void;
}

export default function DesignerProfileEditPortfolio({
  images,
  onViewAll,
  onEditImage,
  onDeleteImage,
}: DesignerProfileEditPortfolioProps) {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const handleToggleMenu = (index: number) => {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
  };

  const handleCloseMenu = () => setOpenMenuIndex(null);

  const handleEdit = (index: number) => {
    onEditImage?.(index);
    setOpenMenuIndex(null);
  };

  const handleDelete = (index: number) => {
    onDeleteImage?.(index);
    setOpenMenuIndex(null);
  };

  return (
    <section className="rounded-2xl bg-white px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-body-1-semibold text-gray-900">포트폴리오</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex cursor-pointer items-center justify-center text-gray-800"
          aria-label="포트폴리오 전체보기"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mt-3 grid grid-cols-3 gap-2.5">
        {images.map((imageUrl, index) => {
          const isMenuOpen = openMenuIndex === index;
          return (
            <div key={`${imageUrl}-${index}`} className="relative overflow-visible">
              <div className="relative h-[135px] w-full overflow-hidden rounded-2xl bg-gray-200">
                <Image
                  src={imageUrl}
                  alt={`포트폴리오 이미지 ${index + 1}`}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>

              <DesignerProfileEditMenu
                isOpen={isMenuOpen}
                onToggle={() => handleToggleMenu(index)}
                onClose={handleCloseMenu}
                onEdit={() => handleEdit(index)}
                onDelete={() => handleDelete(index)}
                ariaLabel="포트폴리오 메뉴"
                wrapperClassName="absolute top-2 right-2"
                buttonClassName="flex h-5 w-5 cursor-pointer items-center justify-center"
                menuPositionClassName="top-8 right-0"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
