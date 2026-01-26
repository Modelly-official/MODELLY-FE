'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { LikedRecruitmentItem } from '@/src/types';
import { useToggleRecruitmentLike } from '@/src/hooks/queries/likes';
import { formatDistrict } from '@/src/utils/common';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import LocationIcon from '@/public/icons/explore/location.svg';
import StarIcon from '@/public/icons/common/star.svg';

interface LikedRecruitmentCardProps {
  recruitment: LikedRecruitmentItem;
  isLeftColumn?: boolean;
}

export default function LikedRecruitmentCard({
  recruitment,
  isLeftColumn = false,
}: LikedRecruitmentCardProps) {
  const { mutate: toggleLike, isPending } = useToggleRecruitmentLike();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPending) {
      toggleLike(recruitment.recruitmentId);
    }
  };

  return (
    <Link href={`/post/${recruitment.recruitmentId}`} className="flex flex-col gap-2.5">
      {/* 이미지 */}
      <div className="relative h-[210px] w-full overflow-hidden bg-gray-200">
        {recruitment.recruitmentThumbnail ? (
          <Image
            src={recruitment.recruitmentThumbnail}
            alt={recruitment.title}
            fill
            sizes="50vw"
            quality={100}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-body-2-medium text-gray-500">이미지 없음</span>
          </div>
        )}
        {/* 찜 버튼 */}
        <button
          type="button"
          onClick={handleLikeClick}
          disabled={isPending}
          className="absolute right-4 bottom-4 flex size-6 cursor-pointer items-center justify-center disabled:opacity-50"
          aria-label="찜 해제"
        >
          <Image
            src="/icons/explore/heart-active.svg"
            alt="찜하기"
            width={19}
            height={19}
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
            <p className="text-caption-1-medium text-gray-800">
              {recruitment.designerName} · {recruitment.shop}
            </p>

            {/* 위치 */}
            <div className="flex items-center gap-1 px-px">
              <LocationIcon className="shrink-0" />
              <span className="text-caption-1-medium text-gray-800">
                {formatDistrict(recruitment.shopAddress)}
              </span>
            </div>

            {/* 별점 */}
            {recruitment.averageRating != null && (
              <div className="flex items-center gap-1">
                <StarIcon className="size-3.5 text-star" />
                <span className="text-caption-1-medium text-gray-800">
                  {recruitment.averageRating.toFixed(1)} ({recruitment.reviewCount?.toLocaleString() ?? 0})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 서비스 태그 */}
        {recruitment.subCategories && recruitment.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recruitment.subCategories.slice(0, 2).map((subCategory) => (
              <CategoryBadge key={subCategory} category={subCategory} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
