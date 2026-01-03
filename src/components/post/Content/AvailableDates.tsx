'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import type { RecruitmentSchedule } from '@/src/types';

import 'swiper/css';
import 'swiper/css/free-mode';

interface AvailableDatesProps {
  schedules: RecruitmentSchedule[];
}

export default function AvailableDates({ schedules }: AvailableDatesProps) {
  // 날짜순 오름차순 정렬
  const sortedSchedules = [...schedules].sort(
    (a, b) => new Date(a.recruitmentDate).getTime() - new Date(b.recruitmentDate).getTime()
  );

  return (
    <Swiper
      modules={[FreeMode]}
      slidesPerView="auto"
      spaceBetween={4}
      freeMode={true}
      grabCursor={true}
      className="w-full"
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
  );
}
