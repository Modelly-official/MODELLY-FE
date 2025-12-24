'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { RecruitmentListItem } from '@/src/types';

interface RecruitmentCardProps {
  recruitment: RecruitmentListItem;
}

export default function RecruitmentCard({ recruitment }: RecruitmentCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: 찜하기 기능 구현 (Zustand + API)
    console.log('찜하기:', recruitment.recruitmentId);
  };

  // 서브카테고리를 한글로 변환
  const getSubCategoryLabel = (subCategory: string) => {
    const labels: Record<string, string> = {
      HAIR_CUT: '커트',
      HAIR_PERM: '펌',
      HAIR_COLORING: '염색',
      ONE_COLOR: '원컬러',
      ART: '아트',
      PEDICURE: '페디큐어',
      EYELASH_PERM: '래쉬펌',
      EYELASH_EXTENSION: '익스텐션',
      LIP_TATTOO: '입술',
      EYEBROW_TATTOO: '눈썹',
      NORMAL_TATTOO: '타투',
      ETC: '기타',
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
          className="absolute bottom-4 right-4 flex size-6 items-center justify-center cursor-pointer"
        >
          <Image
            src={recruitment.isLiked ? '/icons/common/heart-active.svg' : '/icons/common/heart.svg'}
            alt="찜하기"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 정보 */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex flex-col gap-1">
          {/* 제목 */}
          <h3 className="truncate text-body-1-semibold text-black">{recruitment.title}</h3>

          {/* 디자이너 정보 */}
          <div className="flex flex-col gap-0.5">
            <p className="text-caption-1-medium text-gray-700">
              {recruitment.designerName} · {recruitment.shop}
            </p>

            {/* 위치 */}
            <div className="flex items-center gap-1">
              <Image src="/icons/common/location.svg" alt="위치" width={12} height={12} />
              <span className="text-caption-1-medium text-gray-700">{recruitment.shopAddress}</span>
            </div>

            {/* 별점 및 거리 */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <Image src="/icons/common/star.svg" alt="별점" width={14} height={14} />
                <span className="text-caption-1-medium text-gray-700">
                  5.0 ({recruitment.reviewCount.toLocaleString()})
                </span>
              </div>
              <span className="text-body-2-medium text-gray-700">·</span>
              <span className="text-caption-1-medium text-gray-700">{recruitment.distance}km</span>
            </div>
          </div>
        </div>

        {/* 서비스 태그 */}
        <div className="flex flex-wrap gap-1">
          {recruitment.subCategories.slice(0, 2).map((subCategory) => (
            <span key={subCategory} className="rounded bg-purple-200 px-2 py-1 text-caption-1-medium text-purple-700">
              {getSubCategoryLabel(subCategory)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

