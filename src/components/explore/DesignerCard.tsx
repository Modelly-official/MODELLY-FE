'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { DesignerListItem } from '@/src/types';
import { formatDistrict, formatDistance } from '@/src/utils/common';

interface DesignerCardProps {
  designer: DesignerListItem;
}

export default function DesignerCard({ designer }: DesignerCardProps) {
  const [isLiked, setIsLiked] = useState(designer.isLiked);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    // TODO: API 연동 시 찜하기/취소 API 호출
  };

  return (
    <Link href={`/designer/${designer.designerId}`} className="flex items-center justify-between">
      {/* 왼쪽: 디자이너 정보 */}
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="relative size-[78px] shrink-0 overflow-hidden rounded-full">
          <Image src={designer.thumbnail} alt={designer.designerName} fill className="object-cover" />
        </div>

        {/* 정보 */}
        <div className="flex flex-col gap-1">
          <h3 className="text-body-1-semibold text-black">{designer.designerName}</h3>

          <div className="flex flex-col gap-0.5">
            {/* 위치 및 샵 이름 */}
            <div className="text-body-2-medium flex items-center gap-1 text-gray-700">
              <Image src="/icons/common/location.svg" alt="위치" width={12} height={12} />
              <span>{formatDistrict(designer.shopAddress)}</span>
              <span>·</span>
              <span>{designer.shop}</span>
            </div>

            {/* 별점 및 거리 */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <Image src="/icons/common/star.svg" alt="별점" width={14} height={14} />
                <span className="text-caption-1-medium text-gray-700">
                  5.0 ({designer.reviewCount.toLocaleString()})
                </span>
              </div>
              <span className="text-body-2-medium text-gray-700">·</span>
              <span className="text-caption-1-medium text-gray-700">{formatDistance(designer.distance)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 찜하기 버튼 */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        className="flex size-5 shrink-0 cursor-pointer items-center justify-center"
      >
        <Image
          src={isLiked ? '/icons/common/heart-active.svg' : '/icons/common/heart.svg'}
          alt="찜하기"
          width={20}
          height={20}
        />
      </button>
    </Link>
  );
}
