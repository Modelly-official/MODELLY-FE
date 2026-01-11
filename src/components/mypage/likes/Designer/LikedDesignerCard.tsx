'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { LikedDesignerItem } from '@/src/types';
import { formatDistrict } from '@/src/utils/common';
import { useToggleDesignerLike } from '@/src/hooks/queries/likes';
import LocationIcon from '@/public/icons/explore/location.svg';
import ProfileIcon from '@/public/icons/myRecruitment/mypage-active.svg';

interface LikedDesignerCardProps {
  designer: LikedDesignerItem;
}

export default function LikedDesignerCard({ designer }: LikedDesignerCardProps) {
  const { mutate: toggleLike, isPending } = useToggleDesignerLike();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPending) {
      toggleLike(designer.designerId);
    }
  };

  return (
    <Link href={`/designer/${designer.designerId}`} className="flex items-center justify-between">
      {/* 왼쪽: 디자이너 정보 */}
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="relative size-[78px] shrink-0 overflow-hidden rounded-full bg-gray-200">
          {designer.designerProfileImage ? (
            <Image
              src={designer.designerProfileImage}
              alt={designer.designerName}
              fill
              sizes="78px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ProfileIcon className="h-10 w-8 text-gray-600" />
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex flex-col gap-1">
          <h3 className="text-head-4-semibold text-black">{designer.designerName}</h3>

          <div className="flex flex-col gap-0.5">
            {/* 위치 및 샵 이름 */}
            <div className="text-body-2-medium flex items-center gap-1 text-gray-800">
              <LocationIcon className="shrink-0" />
              <span>{formatDistrict(designer.shopAddress)}</span>
              <span>·</span>
              <span className="truncate">{designer.shopName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽: 찜하기 버튼 (찜 목록이므로 항상 active) */}
      <button
        type="button"
        onClick={handleLikeClick}
        disabled={isPending}
        className="flex size-5 shrink-0 cursor-pointer items-center justify-center disabled:opacity-50"
        aria-label="찜 해제"
      >
        <Image
          src="/icons/common/heart-active.svg"
          alt="찜하기"
          width={20}
          height={20}
        />
      </button>
    </Link>
  );
}
