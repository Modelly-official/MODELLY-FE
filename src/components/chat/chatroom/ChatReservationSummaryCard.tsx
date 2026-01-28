'use client';

import { useRouter } from 'next/navigation';
import { formatTimeWithPeriod } from '@/src/utils/common';
import ArrowRightIcon from '@/public/icons/common/arrow-right.svg';
import type { ReservationInfo } from '@/src/types/reservation';

interface ChatReservationSummaryCardProps {
  reservation: ReservationInfo;
  viewerRole?: string | null;
  onChange: () => void;
  onCancel: () => void;
  isChangeLoading?: boolean;
  isCancelLoading?: boolean;
  showTitle?: boolean;
}

export default function ChatReservationSummaryCard({
  reservation,
  viewerRole,
  onChange,
  onCancel,
  isChangeLoading = false,
  isCancelLoading = false,
  showTitle = true,
}: ChatReservationSummaryCardProps) {
  const router = useRouter();
  const title = reservation.recruitmentTitle || `${reservation.modelName}님`;
  const timeLabel = formatTimeWithPeriod(reservation.startTime);
  const { monthDay, weekday } = getDateBadge(reservation.date);
  const canOpenRecruitment = reservation.recruitmentId != null;
  const normalizedRole = viewerRole?.toLowerCase();
  const recruitmentPath =
    normalizedRole === 'designer'
      ? `/myRecruitment/${reservation.recruitmentId}`
      : `/post/${reservation.recruitmentId}`;

  const handleRecruitmentClick = () => {
    if (!canOpenRecruitment) return;
    router.push(recruitmentPath);
  };

  return (
    <div className="flex flex-col gap-4 bg-white">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-[10px] bg-purple-200 text-purple-700">
          <span className="text-body-2-medium leading-none tracking-tight">{monthDay}</span>
          <span className="text-body-2-medium mt-1 leading-none font-medium">{weekday}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {showTitle && <span className="text-body-2-medium text-gray-700">예약 내역</span>}
          <button
            type="button"
            onClick={handleRecruitmentClick}
            disabled={!canOpenRecruitment}
            className={`flex items-center gap-2 text-gray-900 ${
              canOpenRecruitment ? 'cursor-pointer' : 'cursor-default'
            }`}
            aria-label={canOpenRecruitment ? '공고 상세로 이동' : undefined}
          >
            <span className="text-body-1-medium truncate text-gray-900">{title}</span>
            <ArrowRightIcon className="h-4 w-4 shrink-0 scale-[0.7] text-gray-800" />
          </button>
          <span className="text-body-2-medium text-gray-700">{timeLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isCancelLoading}
          className={`text-body-2-medium flex h-12 flex-1 cursor-pointer items-center justify-center rounded-full border ${
            isCancelLoading ? 'cursor-not-allowed border-gray-200 text-gray-400' : 'border-gray-300 text-gray-900'
          }`}
        >
          {isCancelLoading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            '예약 취소'
          )}
        </button>
        <button
          type="button"
          onClick={onChange}
          disabled={isChangeLoading}
          className={`text-body-2-medium flex h-12 flex-1 cursor-pointer items-center justify-center rounded-full ${
            isChangeLoading ? 'cursor-not-allowed bg-gray-200 text-gray-400' : 'bg-purple-500 text-white'
          }`}
        >
          {isChangeLoading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            '예약 변경'
          )}
        </button>
      </div>
    </div>
  );
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

function getDateBadge(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) {
    return { monthDay: dateStr, weekday: '' };
  }

  const date = new Date(year, month - 1, day);
  const weekday = WEEKDAYS[date.getDay()] ?? '';
  const monthLabel = String(month).padStart(2, '0');
  const dayLabel = String(day).padStart(2, '0');

  return { monthDay: `${monthLabel}/${dayLabel}`, weekday };
}
