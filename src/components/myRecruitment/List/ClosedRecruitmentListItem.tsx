'use client';

import Image from 'next/image';
import { useState } from 'react';

import CalendarIcon from '@/public/icons/myRecruitment/calendar.svg';
import { CategoryBadge } from '@/src/components/common';
import type { MyRecruitmentListItem } from '@/src/types/myRecruitment/recruitment';
import { formatPeriodToMonthDay } from '@/src/utils/common';

interface ClosedRecruitmentListItemProps {
  recruitment: MyRecruitmentListItem;
  onClick?: (id: number) => void;
}

export default function ClosedRecruitmentListItem({
  recruitment,
  onClick,
}: ClosedRecruitmentListItemProps) {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onClick?.(recruitment.recruitmentId);
  };

  const subCategories = recruitment.subCategory || [];
  const dateText = formatPeriodToMonthDay(recruitment.period);

  return (
    <div
      className="flex w-full cursor-pointer items-center gap-3"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* 썸네일 */}
      <div className="relative h-[85px] w-[85px] shrink-0 overflow-hidden rounded-xl bg-gray-200">
        {recruitment.thumbnail && !imageError ? (
          <Image
            src={recruitment.thumbnail}
            alt={recruitment.title}
            fill
            sizes="85px"
            quality={100}
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-caption-1-medium text-gray-500">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* 카테고리 + 제목 (4px gap) */}
        <div className="flex flex-col gap-1">
          {/* 카테고리 배지 */}
          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {subCategories.map((category) => (
                <CategoryBadge key={category} category={category} />
              ))}
            </div>
          )}

          {/* 제목 */}
          <p className="text-body-1-medium line-clamp-1 text-gray-900">{recruitment.title}</p>
        </div>

        {/* 날짜 */}
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4 text-gray-700" />
          <span className="text-caption-1-medium text-gray-700">{dateText}</span>
        </div>
      </div>
    </div>
  );
}
