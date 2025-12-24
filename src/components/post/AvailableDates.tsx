'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { RecruitmentSchedule } from '@/src/types';

interface AvailableDatesProps {
  schedules: RecruitmentSchedule[];
}

export default function AvailableDates({ schedules }: AvailableDatesProps) {
  return (
    <div className="scrollbar-hide flex gap-1 overflow-x-auto">
      {schedules.map((schedule, index) => {
        const date = new Date(schedule.recruitmentDate);
        const dateStr = format(date, 'M/d', { locale: ko });
        const dayStr = format(date, 'EEEE', { locale: ko });

        return (
          <div
            key={`${schedule.recruitmentDate}-${index}`}
            className="flex w-[74px] shrink-0 flex-col items-center rounded-[10px] bg-gray-100 px-2 py-4"
          >
            <span className="text-body-1-semibold text-gray-900">{dateStr}</span>
            <span className="text-caption-1-medium text-gray-700">{dayStr}</span>
          </div>
        );
      })}
    </div>
  );
}
