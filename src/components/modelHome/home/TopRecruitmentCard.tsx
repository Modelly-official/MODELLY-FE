'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { RecruitmentListItem } from '@/src/types';
import { CategoryBadge } from '@/src/components/common';

interface TopRecruitmentCardProps {
  recruitment: RecruitmentListItem;
}

export function TopRecruitmentCard({ recruitment }: TopRecruitmentCardProps) {
  const chipItems = [recruitment.category, ...recruitment.subCategories].slice(0, 2);

  return (
    <Link href={`/post/${recruitment.recruitmentId}`} className="block">
      <div className="relative aspect-260/286 w-full overflow-hidden rounded-xl bg-gray-200">
        {recruitment.recruitmentThumbnail ? (
          <Image
            src={recruitment.recruitmentThumbnail}
            alt={recruitment.title}
            fill
            sizes="(max-width: 389px) 241px, (max-width: 640px) 62vw, 260px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-body-2-medium text-gray-500">이미지 없음</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(34, 34, 34, 0) 57%, rgba(34, 34, 34, 0.5) 79%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-4 pb-4">
          <div className="flex flex-wrap gap-1 pb-1">
            {chipItems.map((item, index) => (
              <CategoryBadge
                key={`${recruitment.recruitmentId}-${item}`}
                category={item}
                variant={index === 0 ? 'filled' : 'default'}
                className={index === 0 ? 'rounded-full px-2 py-1' : 'rounded-full px-2 py-1'}
              />
            ))}
          </div>
          <p className="text-caption-1-medium text-white">
            {recruitment.designerName} 디자이너 · {recruitment.shop}
          </p>
          <p className="text-body-1-semibold line-clamp-2 text-white">{recruitment.title}</p>
        </div>
      </div>
    </Link>
  );
}
