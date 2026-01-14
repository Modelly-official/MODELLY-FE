'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { RecruitmentListItem } from '@/src/types';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { formatDistrict } from '@/src/utils/common';
import { useLikeToggle } from '@/src/hooks/custom/explore';
import { LikeButton, RatingDisplay, DistanceDisplay } from '@/src/components/explore/Cards/shared';
import LocationIcon from '@/public/icons/explore/location.svg';

interface MapRecruitmentCardProps {
  recruitment: RecruitmentListItem;
  onLikeToggle?: () => void;
}

export default function MapRecruitmentCard({
  recruitment,
  onLikeToggle,
}: MapRecruitmentCardProps) {
  const { isLiked, handleClick } = useLikeToggle({
    serverValue: recruitment.isLiked ?? false,
    onToggle: onLikeToggle,
  });

  return (
    <Link
      href={`/post/${recruitment.recruitmentId}`}
      className="flex gap-[14px] items-start w-full"
    >
      {/* 썸네일 이미지 */}
      <div className="relative h-[138px] w-[120px] shrink-0 overflow-hidden rounded-[16px] bg-gray-200">
        {recruitment.recruitmentThumbnail ? (
          <Image
            src={recruitment.recruitmentThumbnail}
            alt={recruitment.title}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-caption-1-medium text-gray-500">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-1 items-start justify-between">
        <div className="flex flex-col gap-2 w-[179px]">
          {/* 제목 및 상세 정보 */}
          <div className="flex flex-col gap-1">
            {/* 제목 */}
            <h3 className="text-body-1-semibold truncate text-black">
              {recruitment.title}
            </h3>

            {/* 디자이너 정보 */}
            <div className="flex flex-col gap-0.5">
              <p className="text-caption-1-medium text-gray-800">
                {recruitment.designerName} · {recruitment.shop}
              </p>

              {/* 위치 */}
              <div className="flex items-center gap-1 px-px">
                <LocationIcon className="w-[11.25px] h-[13.5px]" />
                <span className="text-caption-1-medium text-gray-800">
                  {formatDistrict(recruitment.shopAddress)}
                </span>
              </div>

              {/* 별점 및 거리 */}
              <div className="flex items-center gap-1.5">
                <RatingDisplay
                  rating={recruitment.averageRating}
                  reviewCount={recruitment.reviewCount}
                />
                {recruitment.distance != null && (
                  <>
                    <span className="text-body-2-medium text-gray-800">·</span>
                    <DistanceDisplay distance={recruitment.distance} />
                  </>
                )}
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

        {/* 좋아요 버튼 */}
        <LikeButton isLiked={isLiked} onClick={handleClick} variant="inline" />
      </div>
    </Link>
  );
}
