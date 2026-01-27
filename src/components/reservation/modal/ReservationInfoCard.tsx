'use client';

import CalendarIcon from '@/public/icons/reservationModal/calendar.svg';
import TimeCircleIcon from '@/public/icons/reservationModal/time-circle.svg';
import { formatDateToShort, formatTimeWithPeriod } from '@/src/utils/common';

interface ReservationInfoCardProps {
  modelName: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
}

export default function ReservationInfoCard({ modelName, date, startTime }: ReservationInfoCardProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-[20px] border border-gray-400 px-12 py-[23px]">
      <div className="flex flex-col items-center gap-1">
        {/* 모델명 */}
        <p className="text-head-4-medium text-gray-900">
          {modelName} <span>님</span>
        </p>

        {/* 날짜/시간 정보 */}
        <div className="flex items-center gap-2">
          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4 text-gray-700" />
            <span className="text-body-2-medium text-gray-700">{formatDateToShort(date)}</span>
          </div>

          <span className="text-body-2-medium text-gray-700">·</span>

          {/* 시간 */}
          <div className="flex items-center gap-1">
            <TimeCircleIcon className="size-4 text-gray-700" />
            <span className="text-body-2-medium text-gray-700">{formatTimeWithPeriod(startTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
