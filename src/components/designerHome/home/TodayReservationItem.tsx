'use client';

import Image from 'next/image';
import Link from 'next/link';
import ClockIcon from '@/public/icons/designer-home/clock.svg';
import ChevronRightIcon from '@/public/icons/designer-home/chevron-right.svg';
import ProfilePlaceholderSmIcon from '@/public/icons/designer-home/profile-placeholder-sm.svg';
import { formatTimeWithPeriod } from '@/src/utils/common';
import type { TodayReservationItem as TodayReservationItemType } from '@/src/types/designerHome';

interface TodayReservationItemProps {
  item: TodayReservationItemType;
}

export function TodayReservationItem({ item }: TodayReservationItemProps) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-white p-4">
      {/* 좌측: 프로필 이미지 + 이름 + 모집글 버튼 */}
      <div className="flex items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="relative size-[34px] shrink-0 overflow-hidden rounded-full bg-gray-200">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.modelName} fill className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-gray-300 text-gray-600">
              <ProfilePlaceholderSmIcon className="size-[14px]" />
            </div>
          )}
        </div>

        {/* 이름 + 모집글 버튼 */}
        <div className="flex items-center gap-2">
          <span className="text-body-1-semibold text-gray-900">{item.modelName} 님</span>
          <Link
            href={`/myRecruitment/${item.recruitmentId}`}
            className="flex items-center gap-0.5 rounded-[8px] border border-gray-400 px-2 py-[5px]"
          >
            <span className="text-caption-1-medium text-gray-800">모집글</span>
            <ChevronRightIcon className="size-3 text-gray-500" />
          </Link>
        </div>
      </div>

      {/* 우측: 시간 배지 */}
      <div className="flex items-center gap-2 rounded-[8px] bg-purple-100 px-2 py-1">
        <ClockIcon className="size-4 text-purple-700" />
        <span className="text-body-2-medium text-purple-700">{formatTimeWithPeriod(item.time)}</span>
      </div>
    </div>
  );
}
