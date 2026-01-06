'use client';

import 'swiper/css';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import CalendarIcon from '@/public/icons/designer-home/calendar.svg';
import ClockIcon from '@/public/icons/designer-home/clock.svg';
import { formatTimeWithPeriod } from '@/src/utils/common';
import type { PendingReservationItem, PendingReservationsResult } from '@/src/types/designerHome';

// ===== 요일 상수 =====
const WEEKDAY_NAMES_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

// ===== 날짜 포맷 함수 (요일 포함) =====
function formatReservationDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_NAMES_KO[date.getDay()];
  return `${month}월 ${day}일(${weekday})`;
}

// ===== 신규 예약 카드 =====
function PendingReservationCard({ item }: { item: PendingReservationItem }) {
  return (
    <Link
      href={`/reservations/${item.reservationId}`}
      className="flex w-[150px] flex-col gap-4 rounded-[16px] bg-white p-4"
    >
      {/* 이름 */}
      <p className="text-body-1-semibold text-gray-900">{item.modelName} 님</p>

      {/* 날짜/시간 */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-gray-800" />
          <span className="text-body-2-medium text-gray-800">{formatReservationDate(item.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-gray-800" />
          <span className="text-body-2-medium text-gray-800">{formatTimeWithPeriod(item.time)}</span>
        </div>
      </div>
    </Link>
  );
}

interface PendingReservationSectionProps {
  data: PendingReservationsResult;
  isLoading?: boolean;
}

// ===== 신규 예약 신청 섹션 =====
export function PendingReservationSection({ data, isLoading }: PendingReservationSectionProps) {
  return (
    <section className="mt-6">
      {/* 헤더 */}
      <Link href="/reservations/pending" className="flex items-center justify-between px-5">
        <div className="flex items-center gap-1.5">
          <span className="text-body-1-semibold text-gray-900">새로운 예약 신청</span>
          <span className="text-body-1-medium text-purple-700">{data.totalCount ?? 0}</span>
        </div>
        <span className="text-body-2-medium text-gray-600">전체보기</span>
      </Link>

      {/* 캐러셀 카드 리스트 */}
      {isLoading ? (
        <div className="mt-3 flex gap-3 px-4">
          <div className="animate-skeleton h-[100px] w-[150px] shrink-0 rounded-[12px] bg-gray-300" />
          <div className="animate-skeleton h-[100px] w-[150px] shrink-0 rounded-[12px] bg-gray-300" />
        </div>
      ) : data.reservations && data.reservations.length > 0 ? (
        <div className="mt-3">
          <Swiper spaceBetween={12} slidesPerView="auto" className="px-4!">
            {data.reservations.map((item) => (
              <SwiperSlide key={item.reservationId} className="w-[150px]!">
                <PendingReservationCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-body-2-medium mt-3 px-4 text-gray-700">새로운 예약 신청이 없습니다</p>
      )}
    </section>
  );
}
