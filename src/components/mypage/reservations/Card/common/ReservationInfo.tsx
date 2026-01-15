'use client';

import { formatDateToKorean, formatTimeToKorean } from '@/src/utils/common';

interface ReservationInfoProps {
  date: string;
  startTime: string;
  designerNickname: string;
  shop: string;
}

export default function ReservationInfo({
  date,
  startTime,
  designerNickname,
  shop,
}: ReservationInfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-body-2-medium flex items-center gap-4">
        <span className="w-[51px] text-gray-600">예약 일시</span>
        <span className="text-gray-900">
          {formatDateToKorean(date)} {formatTimeToKorean(startTime)}
        </span>
      </div>
      <div className="text-body-2-medium flex items-center gap-4">
        <span className="w-[51px] text-gray-600">디자이너</span>
        <span className="text-gray-900">{designerNickname}</span>
      </div>
      <div className="text-body-2-medium flex items-center gap-4">
        <span className="w-[51px] text-gray-600">매장명</span>
        <span className="text-gray-900">{shop}</span>
      </div>
    </div>
  );
}
