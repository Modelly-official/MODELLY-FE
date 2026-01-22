'use client';

import Image from 'next/image';
import Link from 'next/link';
import CalendarIcon from '@/public/icons/myRecruitment/calendar.svg';
import CategoryBadge from '@/src/components/common/CategoryBadge';
import { formatPeriodToMonthDay } from '@/src/utils/common';
import type { DesignerRecruitmentCard } from '@/src/types/profile';

interface DesignerProfileRecruitmentsProps {
  openRecruitments: DesignerRecruitmentCard[];
  isOwner?: boolean;
}

const isCategoryCode = (value: string) => value.includes('_');

export default function DesignerProfileRecruitments({
  openRecruitments,
  isOwner = false,
}: DesignerProfileRecruitmentsProps) {
  const formatPeriod = (startDate: string, endDate: string) => formatPeriodToMonthDay(`${startDate} ~ ${endDate}`);

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex items-center justify-between">
        <h2 className="text-body-1-semibold text-gray-900">모집중인 모집글</h2>
      </div>
      {openRecruitments.length === 0 ? (
        <div className="rounded-2xl bg-gray-100 px-4 py-6 text-center">
          <p className="text-body-2-medium text-gray-600">현재 모집중인 공고가 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {openRecruitments.map((recruitment) => (
            <Link
              key={recruitment.recruitmentId}
              href={isOwner ? `/myRecruitment/${recruitment.recruitmentId}` : `/post/${recruitment.recruitmentId}`}
              className="flex h-[85px] items-center gap-3 overflow-hidden bg-white"
            >
              <div className="relative h-[85px] w-[85px] shrink-0">
                <Image
                  src={recruitment.thumbnailUrl}
                  alt={recruitment.title}
                  fill
                  sizes="72px"
                  className="rounded-xl object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 py-[3.5px]">
                <div className="flex flex-wrap gap-1">
                  {recruitment.subCategories
                    .slice(0, 2)
                    .map((subCategory) =>
                      isCategoryCode(subCategory) ? (
                        <CategoryBadge key={subCategory} category={subCategory} />
                      ) : (
                        <CategoryBadge key={subCategory} label={subCategory} />
                      ),
                    )}
                </div>
                <p className="text-body-2-medium line-clamp-2 text-gray-900">{recruitment.title}</p>
                <div className="flex items-center gap-1 pt-1 text-gray-900">
                  <CalendarIcon className="h-4 w-4 translate-y-px text-gray-900" />
                  <span className="text-body-2-regular">
                    {formatPeriod(recruitment.startDate, recruitment.deadline)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
