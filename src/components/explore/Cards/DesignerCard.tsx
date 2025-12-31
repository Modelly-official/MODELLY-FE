'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { DesignerListItem } from '@/src/types';
import { formatDistrict } from '@/src/utils/common';
import { useLikeToggle } from '@/src/hooks/custom/explore';
import { LikeButton, RatingDisplay, DistanceDisplay } from './shared';
import LocationIcon from '@/public/icons/explore/location.svg';
import ProfileIcon from '@/public/icons/myRecruitment/mypage-active.svg';

interface DesignerCardProps {
  designer: DesignerListItem;
  onLikeToggle?: () => void;
}

export default function DesignerCard({ designer, onLikeToggle }: DesignerCardProps) {
  const { isLiked, handleClick } = useLikeToggle({
    initialValue: designer.isLiked ?? false,
    onToggle: onLikeToggle,
  });

  return (
    <Link href={`/designer/${designer.designerId}`} className="flex items-center justify-between">
      {/* 왼쪽: 디자이너 정보 */}
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="relative size-[78px] shrink-0 overflow-hidden rounded-full bg-gray-200">
          {designer.thumbnail ? (
            <Image src={designer.thumbnail} alt={designer.designerName} fill sizes="78px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ProfileIcon className="h-10 w-8 text-gray-600" />
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex flex-col gap-1">
          <h3 className="text-head-4-semibold text-black">{designer.designerName} 디자이너</h3>

          <div className="flex flex-col gap-0.5">
            {/* 위치 및 샵 이름 */}
            <div className="text-body-2-medium flex items-center gap-1 px-px text-gray-800">
              <LocationIcon />
              <span>{formatDistrict(designer.shopAddress)}</span>
              <span>·</span>
              <span>{designer.shop}</span>
            </div>

            {/* 별점 및 거리 */}
            <div className="flex items-center gap-1.5">
              <RatingDisplay rating={designer.averageRating} reviewCount={designer.reviewCount} />
              <span className="text-body-2-medium text-gray-800">·</span>
              <DistanceDisplay distance={designer.distance} />
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 찜하기 버튼 */}
      <LikeButton isLiked={isLiked} onClick={handleClick} variant="inline" />
    </Link>
  );
}
