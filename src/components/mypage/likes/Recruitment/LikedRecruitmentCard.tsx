'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { LikedRecruitmentItem } from '@/src/types';
import { useRecruitmentDetail } from '@/src/hooks/queries/explore/useRecruitmentDetail';
import { useToggleRecruitmentLike } from '@/src/hooks/queries/likes';
import { formatDistrict } from '@/src/utils/common';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { Skeleton } from '@/src/components/common/Skeleton';
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

  // 공고 상세 정보 조회
  const { data: detailResponse, isLoading: isDetailLoading } = useRecruitmentDetail(
    recruitment.recruitmentId
  );
  const detail = detailResponse?.result;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPending) {
      toggleLike(recruitment.recruitmentId);
    }
  };

  // 썸네일 (찜 목록 API 또는 상세 API에서)
  const thumbnailSrc = recruitment.thumbnail || detail?.imageUrls?.[0];

  return (
    <Link href={`/post/${recruitment.recruitmentId}`} className="flex flex-col gap-2.5">
      {/* 이미지 */}
      <div className="relative h-[210px] w-full overflow-hidden bg-gray-200">
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt={detail?.title ?? '공고 이미지'}
            fill
            sizes="50vw"
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
            src="/icons/common/heart-active.svg"
            alt="찜하기"
            width={24}
            height={24}
            className="drop-shadow-[0_0_4px_rgba(34,34,34,0.32)]"
          />
        </button>
      </div>

      {/* 정보 */}
      <div className={`flex flex-col gap-2 ${isLeftColumn ? 'pr-[9px] pl-4' : 'pr-4 pl-[10px]'}`}>
        {isDetailLoading ? (
          // 로딩 상태
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex flex-col gap-0.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ) : detail ? (
          // 상세 정보 표시
          <div className="flex flex-col gap-1">
            {/* 제목 */}
            <h3 className="text-body-1-semibold truncate text-black">{detail.title}</h3>

            {/* 디자이너 정보 */}
            <div className="flex flex-col gap-0.5">
              <p className="text-caption-1-medium text-gray-800">
                {detail.designerProfile.designerName} · {detail.designerProfile.shop}
              </p>

              {/* 위치 */}
              <div className="flex items-center gap-1 px-px">
                <LocationIcon className="shrink-0" />
                <span className="text-caption-1-medium text-gray-800">
                  {formatDistrict(detail.designerProfile.shopAddress)}
                </span>
              </div>

              {/* 별점 */}
              {detail.averageRating != null && (
                <div className="flex items-center gap-1">
                  <StarIcon className="size-3.5 text-star" />
                  <span className="text-caption-1-medium text-gray-800">
                    {detail.averageRating.toFixed(1)} ({detail.reviewCount?.toLocaleString() ?? 0})
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // 정보 없음
          <div className="flex flex-col gap-1">
            <span className="text-caption-1-medium text-gray-500">정보를 불러올 수 없습니다</span>
          </div>
        )}

        {/* 서비스 태그 */}
        {detail?.subCategories && detail.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {detail.subCategories.slice(0, 2).map((subCategory) => (
              <CategoryBadge key={subCategory} category={subCategory} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
