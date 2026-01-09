'use client';

import Image from 'next/image';
import type { DesignerReservationItem, ReservationListType } from '@/src/types';
import { subCategoryCodeToName, categoryCodeToName } from '@/src/utils/myRecruitment';
import { formatDateToKorean, formatTimeToKorean } from '@/src/utils/common';

interface DesignerReservationCardProps {
  reservation: DesignerReservationItem;
  tabType: ReservationListType;
  onChatClick?: (reservation: DesignerReservationItem) => void;
  onChangeClick?: (reservation: DesignerReservationItem) => void;
  onCancelClick?: (reservation: DesignerReservationItem) => void;
}

export default function DesignerReservationCard({
  reservation,
  tabType,
  onChatClick,
  onChangeClick,
  onCancelClick,
}: DesignerReservationCardProps) {
  const isUpcoming = tabType === 'UPCOMING';
  const isCompleted = reservation.status === 'RESERVATION_CANCELLED' || tabType === 'COMPLETED';

  // 서브카테고리 한글 변환
  const subCategoryLabels = reservation.subCategories.map((code) =>
    subCategoryCodeToName(reservation.category, code)
  );

  // 카테고리 한글 변환
  const categoryLabel = categoryCodeToName(reservation.category as 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH') ?? reservation.category;

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-gray-200 bg-white px-5 py-4">
      {/* 콘텐츠 */}
      <div className="flex flex-col gap-3">
        {/* 서브카테고리 뱃지 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-1">
            {subCategoryLabels.map((label) => (
              <span
                key={label}
                className="text-caption-1-medium rounded-lg bg-purple-200 px-2 py-[3px] text-purple-700"
              >
                {label}
              </span>
            ))}
          </div>
          {/* 제목 */}
          <p className="text-head-4-semibold text-gray-900">{categoryLabel} 예약</p>
        </div>

        {/* 예약 정보 */}
        <div className="flex flex-col gap-2">
          <div className="text-body-2-medium flex items-center gap-4">
            <span className="text-gray-600">예약 일시</span>
            <span className="text-gray-900">
              {formatDateToKorean(reservation.date)} {formatTimeToKorean(reservation.startTime)}
            </span>
          </div>
          <div className="text-body-2-medium flex items-center gap-4">
            <span className="text-gray-600">예약자 명</span>
            <span className="text-gray-900">{reservation.modelName} 님</span>
          </div>
        </div>
      </div>

      {/* 액션 버튼 (다가오는 일정만) */}
      {isUpcoming && !isCompleted && (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            onClick={() => onChatClick?.(reservation)}
            className="text-body-2-medium flex h-[42px] cursor-pointer items-center justify-center gap-1 rounded-full bg-gray-900 px-4 py-2.5 text-white"
          >
            <Image src="/icons/common/chat.svg" alt="채팅" width={20} height={20} />
            채팅 보내기
          </button>
          <button
            type="button"
            onClick={() => onChangeClick?.(reservation)}
            className="text-body-2-medium flex h-[42px] cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-4 py-2.5 text-gray-900"
          >
            예약 변경
          </button>
          <button
            type="button"
            onClick={() => onCancelClick?.(reservation)}
            className="text-body-2-medium flex h-[42px] cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-4 py-2.5 text-gray-900"
          >
            예약 취소
          </button>
        </div>
      )}
    </div>
  );
}
