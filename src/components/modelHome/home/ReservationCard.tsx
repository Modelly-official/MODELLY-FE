'use client';

import Link from 'next/link';
import { CategoryBadge } from '@/src/components/common';
import type { ReservationSummary } from '@/src/types/modelHome/modelHome';

interface ReservationCardProps {
  reservation?: ReservationSummary | null;
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  if (!reservation) {
    return (
      <div className="flex h-[76px] items-center justify-center rounded-xl bg-white">
        <p className="text-body-2-medium text-gray-600">아직 예약 내역이 없어요</p>
      </div>
    );
  }

  return (
    <Link href="/mypage/reservations" className="block">
      <div className="flex flex-col">
        <div className="rounded-xl bg-white px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <p className="text-head-4-semibold text-gray-900">{reservation.designerName} 디자이너</p>
            <div className="flex flex-wrap items-center justify-end gap-1">
              {reservation.tags.map((tag, index) => (
                <CategoryBadge
                  key={`${reservation.id}-${tag}`}
                  label={tag}
                  variant={index === 0 ? 'filled' : 'default'}
                  className={index === 0 ? 'bg-purple-500!' : ''}
                />
              ))}
            </div>
          </div>

          <div className="text-body-2-medium mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">매장명</span>
              <span className="text-gray-800">{reservation.shop}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">모집글</span>
              <span className="text-gray-800">{reservation.recruitmentTitle}</span>
            </div>
          </div>
        </div>

        <div className="-my-px px-7 relative z-10">
          <div
            className="h-px w-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(to right, #CED0D7 0 6px, #ffffff 6px 14px)',
            }}
          />
        </div>

        <div className="rounded-xl bg-white px-5 py-5">
          <div className="flex items-center justify-between">
            <p className="text-head-4-semibold text-purple-600">
              {reservation.date} · {reservation.time}
            </p>
            <span className="text-body-2-medium rounded-xl bg-gray-800 px-3 py-1 text-white">{reservation.dday}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
