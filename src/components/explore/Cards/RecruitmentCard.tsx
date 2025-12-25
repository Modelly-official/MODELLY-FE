'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RecruitmentListItem } from '@/src/types';
import { formatDistrict, formatDistance } from '@/src/utils/common';

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

  // 서브카테고리를 한글로 변환
  const getSubCategoryLabel = (subCategory: string) => {
    const labels: Record<string, string> = {
      HAIR_CUT: '커트',
      HAIR_PERM: '펌',
      HAIR_COLORING: '염색',
      HAIR_MAGIC: '매직',
      ONE_COLOR: '원컬러',
      ART: '아트',
      PEDICURE: '페디큐어',
      EYELASH_PERM: '래쉬펌',
      EYELASH_EXTENSION: '익스텐션',
      LIP_TATTOO: '입술',
      EYEBROW_TATTOO: '눈썹',
      NORMAL_TATTOO: '타투',
    };
    return labels[subCategory] || subCategory;
  };

  return (
    <Link href={`/post/${recruitment.recruitmentId}`} className="flex flex-col gap-2.5">
      {/* 이미지 */}
      <div className="relative h-[210px] w-full overflow-hidden rounded-none">
        <Image src={recruitment.recruitmentThumbnail} alt={recruitment.title} fill className="object-cover" />
        {/* 찜하기 버튼 */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute right-4 bottom-4 flex size-6 cursor-pointer items-center justify-center"
        >
          <Image
            src={isLiked ? '/icons/explore/heart-active.svg' : '/icons/explore/heart.svg'}
            alt="찜하기"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 정보 */}
      <div className={`flex flex-col gap-2 ${isLeftColumn ? 'pr-[9px] pl-4' : 'pr-4 pl-[10px]'}`}>
        <div className="flex flex-col gap-1">
          {/* 제목 */}
          <h3 className="text-body-1-semibold truncate text-black">{recruitment.title}</h3>

          {/* 디자이너 정보 */}
          <div className="flex flex-col gap-0.5">
            <p className="text-caption-1-medium text-gray-700">
              {recruitment.designerName} · {recruitment.shop}
            </p>

            {/* 위치 */}
            <div className="flex items-center gap-1">
              <Image src="/icons/common/location.svg" alt="위치" width={12} height={12} />
              <span className="text-caption-1-medium text-gray-700">{formatDistrict(recruitment.shopAddress)}</span>
            </div>

            {/* 별점 및 거리 */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <Image src="/icons/common/star.svg" alt="별점" width={14} height={14} />
                <span className="text-caption-1-medium text-gray-700">
                  5.0 ({(recruitment.reviewCount ?? 0).toLocaleString()})
                </span>
              </div>
              <span className="text-body-2-medium text-gray-700">·</span>
              <span className="text-caption-1-medium text-gray-700">{formatDistance(recruitment.distance ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* 서비스 태그 */}
        <div className="flex flex-wrap gap-1">
          {recruitment.subCategories.slice(0, 2).map((subCategory) => (
            <span key={subCategory} className="text-caption-1-medium rounded bg-purple-200 px-2 py-1 text-purple-700">
              {getSubCategoryLabel(subCategory)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
