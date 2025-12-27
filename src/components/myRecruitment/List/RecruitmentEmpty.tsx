'use client';

import CalendarIcon from '@/public/icons/nav/calendar.svg';

interface RecruitmentEmptyProps {
  month: number;
}

export default function RecruitmentEmpty({ month }: RecruitmentEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <CalendarIcon className="h-12 w-12 text-gray-40" />
      <p className="text-body-1-medium text-gray-50">
        {month}월에 등록된 모집글이 없습니다
      </p>
    </div>
  );
}
