'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecruitmentListItem } from '@/src/types';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { formatDistrict, formatDistance } from '@/src/utils/common';
import HeartIcon from '@/public/icons/myRecruitment/heart.svg';
import LocationIcon from '@/public/icons/explore/location.svg';

interface RecruitmentCardProps {
  recruitment: RecruitmentListItem;
  isLeftColumn?: boolean;
  onLikeToggle?: () => void;
}

export default function RecruitmentCard({ recruitment, isLeftColumn = false, onLikeToggle }: RecruitmentCardProps) {
  const [isLiked, setIsLiked] = useState(recruitment.isLiked ?? false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    onLikeToggle?.();
  };

  return (
    <Link href={`/post/${recruitment.recruitmentId}`} className="flex flex-col gap-2.5">
      {/* 이미지 */}
      <div className="relative h-[210px] w-full overflow-hidden rounded-none bg-gray-200">
        {recruitment.recruitmentThumbnail ? (
          <Image src={recruitment.recruitmentThumbnail} alt={recruitment.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-body-2-medium text-gray-500">이미지 없음</span>
          </div>
        )}
        {/* 찜하기 버튼 */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute right-4 bottom-4 flex size-6 cursor-pointer items-center justify-center"
        >
          <HeartIcon className={isLiked ? 'text-white' : 'text-transparent'} />
        </button>
      </div>

      {/* 정보 */}
      <div className={`flex flex-col gap-2 ${isLeftColumn ? 'pr-[9px] pl-4' : 'pr-4 pl-[10px]'}`}>
        <div className="flex flex-col gap-1">
          {/* 제목 */}
          <h3 className="text-body-1-semibold truncate text-black">{recruitment.title}</h3>

          {/* 디자이너 정보 */}
          <div className="flex flex-col gap-0.5">
            <p className="text-caption-1-medium text-gray-800">
              {recruitment.designerName} · {recruitment.shop}
            </p>

            {/* 위치 및 별점/거리 */}
            <div className="flex flex-col">
              {/* 위치 */}
              <div className="flex items-center gap-1 px-px">
                <LocationIcon />
                <span className="text-caption-1-medium text-gray-800">{formatDistrict(recruitment.shopAddress)}</span>
              </div>

              {/* 별점 및 거리 */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <Image src="/icons/common/star.svg" alt="별점" width={14} height={14} />
                  <span className="text-caption-1-medium text-gray-800">
                    5.0 ({(recruitment.reviewCount ?? 0).toLocaleString()})
                  </span>
                </div>
                <span className="text-body-2-medium text-gray-800">·</span>
                <span className="text-caption-1-medium text-gray-800">{formatDistance(recruitment.distance ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 서비스 태그 */}
        <div className="flex flex-wrap gap-1">
          {recruitment.subCategories.slice(0, 2).map((subCategory) => (
            <CategoryBadge key={subCategory} category={subCategory} />
          ))}
        </div>
      </div>
    </Link>
  );
}
