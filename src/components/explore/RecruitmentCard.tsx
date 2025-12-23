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
    console.log('찜하기:', recruitment.id);
  };

  return (
    <Link href={`/post/${recruitment.id}`} className="flex flex-col gap-2.5">
      {/* 이미지 */}
      <div className="relative h-[210px] w-full overflow-hidden rounded-none">
        <Image src={recruitment.thumbnail} alt={recruitment.title} fill className="object-cover" />
        {/* 찜하기 버튼 */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute bottom-4 right-4 flex size-6 items-center justify-center"
        >
          <Image
            src={recruitment.isFavorite ? '/icons/common/heart-active.svg' : '/icons/common/heart.svg'}
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
              {recruitment.designerName} · {recruitment.shopName}
            </p>

            {/* 위치 */}
            <div className="flex items-center gap-1">
              <Image src="/icons/common/location.svg" alt="위치" width={12} height={12} />
              <span className="text-caption-1-medium text-gray-700">{recruitment.location}</span>
            </div>

            {/* 별점 및 거리 */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <Image src="/icons/common/star.svg" alt="별점" width={14} height={14} />
                <span className="text-caption-1-medium text-gray-700">
                  {recruitment.rating.toFixed(1)} ({recruitment.reviewCount.toLocaleString()})
                </span>
              </div>
              <span className="text-body-2-medium text-gray-700">·</span>
              <span className="text-caption-1-medium text-gray-700">{recruitment.distance}</span>
            </div>
          </div>
        </div>

        {/* 서비스 태그 */}
        <div className="flex flex-wrap gap-1">
          {recruitment.services.slice(0, 2).map((service) => (
            <span key={service} className="rounded bg-purple-200 px-2 py-1 text-caption-1-medium text-purple-700">
              {service}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

