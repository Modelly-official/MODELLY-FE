'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { RecruitmentListItem } from '@/src/types';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { formatDistrict } from '@/src/utils/common';
import { useLikeToggle } from '@/src/hooks/custom/explore';
import { LikeButton, RatingDisplay, DistanceDisplay } from './shared';
import LocationIcon from '@/public/icons/explore/location.svg';

interface RecruitmentCardProps {
  recruitment: RecruitmentListItem;
  isLeftColumn?: boolean;
  onLikeToggle?: () => void;
}

export default function RecruitmentCard({ recruitment, isLeftColumn = false, onLikeToggle }: RecruitmentCardProps) {
  const { isLiked, handleClick } = useLikeToggle({
    serverValue: recruitment.isLiked ?? false,
    onToggle: onLikeToggle,
  });

  return (
    <Link href={`/post/${recruitment.recruitmentId}`} className="flex flex-col gap-2.5">
      {/* 이미지 */}
      <div className="relative h-[210px] w-full overflow-hidden rounded-none bg-gray-200">
        {recruitment.recruitmentThumbnail ? (
          <Image
            src={recruitment.recruitmentThumbnail}
            alt={recruitment.title}
            fill
            sizes="50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-body-2-medium text-gray-500">이미지 없음</span>
          </div>
        )}
        <LikeButton isLiked={isLiked} onClick={handleClick} variant="overlay" />
      </div>

      {/* 정보 */}
      <div className={`flex flex-col gap-2 ${isLeftColumn ? 'pr-[9px] pl-4' : 'pr-4 pl-2.5'}`}>
        <div className="flex flex-col gap-1">
          {/* 제목 */}
          <h3 className="text-body-1-semibold truncate text-black">{recruitment.title}</h3>

          {/* 디자이너 정보 */}
          <div className="flex flex-col gap-0.5">
            <p className="text-caption-1-medium text-gray-800">
              {recruitment.designerName} 디자이너 · {recruitment.shop}
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
                <RatingDisplay rating={recruitment.averageRating} reviewCount={recruitment.reviewCount} />
                {recruitment.distance != null && (
                  <>
                    <span className="text-body-2-medium text-gray-800">·</span>
                    <DistanceDisplay distance={recruitment.distance} />
                  </>
                )}
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
