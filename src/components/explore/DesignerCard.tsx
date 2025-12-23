'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { DesignerListItem } from '@/src/types';

interface DesignerCardProps {
  designer: DesignerListItem;
}

export default function DesignerCard({ designer }: DesignerCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: 찜하기 기능 구현 (Zustand + API)
    console.log('찜하기:', designer.id);
  };

  return (
    <Link href={`/designer/${designer.id}`} className="flex items-center justify-between">
      {/* 왼쪽: 디자이너 정보 */}
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="relative size-[78px] shrink-0 overflow-hidden rounded-full">
          <Image src={designer.profileImage} alt={designer.name} fill className="object-cover" />
        </div>

        {/* 정보 */}
        <div className="flex flex-col gap-1">
          <h3 className="text-body-1-semibold text-black">{designer.name}</h3>

          <div className="flex flex-col gap-0.5">
            {/* 위치 및 샵 이름 */}
            <div className="flex items-center gap-1 text-body-2-medium text-gray-700">
              <Image src="/icons/common/location.svg" alt="위치" width={12} height={12} />
              <span>{designer.location}</span>
              <span>·</span>
              <span>{designer.shopName}</span>
            </div>

            {/* 별점 및 거리 */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <Image src="/icons/common/star.svg" alt="별점" width={14} height={14} />
                <span className="text-caption-1-medium text-gray-700">
                  {designer.rating.toFixed(1)} ({designer.reviewCount.toLocaleString()})
                </span>
              </div>
              <span className="text-body-2-medium text-gray-700">·</span>
              <span className="text-caption-1-medium text-gray-700">{designer.distance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 찜하기 버튼 */}
      <button type="button" onClick={handleFavoriteClick} className="flex size-5 shrink-0 items-center justify-center">
        <Image
          src={designer.isFavorite ? '/icons/common/heart-active.svg' : '/icons/common/heart.svg'}
          alt="찜하기"
          width={20}
          height={20}
        />
      </button>
    </Link>
  );
}

