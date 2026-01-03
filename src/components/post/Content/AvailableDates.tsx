'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { RecruitmentSchedule } from '@/src/types';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

interface AvailableDatesProps {
  schedules: RecruitmentSchedule[];
}

export default function AvailableDates({ schedules }: AvailableDatesProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // 날짜순 오름차순 정렬
  const sortedSchedules = [...schedules].sort(
    (a, b) => new Date(a.recruitmentDate).getTime() - new Date(b.recruitmentDate).getTime()
  );

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // 4개 이하면 화살표 불필요
  const showNav = sortedSchedules.length > 4;

  return (
    <div className="relative">
      <Swiper
        modules={[FreeMode, Navigation]}
        slidesPerView="auto"
        spaceBetween={4}
        freeMode={true}
        grabCursor={true}
        className="w-full"
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        onReachBeginning={() => setIsBeginning(true)}
        onReachEnd={() => setIsEnd(true)}
        onFromEdge={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {sortedSchedules.map((schedule, index) => {
          const date = new Date(schedule.recruitmentDate);
          const dateStr = format(date, 'M/d', { locale: ko });
          const dayStr = format(date, 'EEEE', { locale: ko });

          return (
            <SwiperSlide
              key={`${schedule.recruitmentDate}-${index}`}
              className="w-[74px]!"
            >
              <div className="flex w-[74px] flex-col items-center rounded-[10px] bg-gray-100 px-2 py-4">
                <span className="text-body-1-semibold text-gray-900">{dateStr}</span>
                <span className="text-caption-1-medium text-gray-700">{dayStr}</span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 화살표 네비게이션 */}
      {showNav && (
        <>
          {/* 왼쪽 화살표 */}
          {!isBeginning && (
            <button
              type="button"
              onClick={() => swiperInstance?.slidePrev()}
              className="absolute top-1/2 left-0 z-10 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
            >
              <Image
                src="/icons/common/arrow-right.svg"
                alt="이전"
                width={6}
                height={10}
                className="rotate-180"
              />
            </button>
          )}

          {/* 오른쪽 화살표 */}
          {!isEnd && (
            <button
              type="button"
              onClick={() => swiperInstance?.slideNext()}
              className="absolute top-1/2 right-0 z-10 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
            >
              <Image
                src="/icons/common/arrow-right.svg"
                alt="다음"
                width={6}
                height={10}
              />
            </button>
          )}
        </>
      )}
    </div>
  );
}
