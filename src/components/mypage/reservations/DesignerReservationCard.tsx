'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { DesignerReservationItem, ReservationListType } from '@/src/types';
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
  const router = useRouter();
  const isUpcoming = tabType === 'UPCOMING';
  const isCompleted = reservation.status === 'RESERVATION_CANCELLED' || tabType === 'COMPLETED';

  // 카드 클릭 시 공고 상세로 이동
  const handleCardClick = () => {
    router.push(`/post/${reservation.recruitmentId}`);
  };

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white px-5 py-4">
      {/* 콘텐츠 */}
      <div className="flex flex-col gap-2">
        {/* 서브카테고리 뱃지 */}
        <div className="flex items-center gap-1">
          {reservation.subCategories.map((label) => (
            <span
              key={label}
              className="text-caption-1-medium rounded-lg bg-purple-200 px-2 py-1 text-purple-700"
            >
              {label}
            </span>
          ))}
        </div>

        {/* 제목 및 예약 정보 */}
        <div className="flex flex-col gap-4">
          {/* 제목 (클릭 가능) */}
          <button
            type="button"
            onClick={handleCardClick}
            className="flex cursor-pointer items-center gap-0.5"
          >
            <p className="text-head-4-semibold text-gray-900">{reservation.recruitmentTitle}</p>
            <Image
              src="/icons/common/chevron-right.svg"
              alt="상세보기"
              width={20}
              height={20}
              className="text-gray-800"
            />
          </button>

          {/* 예약 정보 */}
          <div className="flex flex-col gap-1">
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">예약 일시</span>
              <span className="text-gray-900">
                {formatDateToKorean(reservation.date)} {formatTimeToKorean(reservation.startTime)}
              </span>
            </div>
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">예약자 명</span>
              <span className="text-gray-900">{reservation.modelName} 님</span>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 (다가오는 일정만) */}
      {isUpcoming && !isCompleted && (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            onClick={() => onChatClick?.(reservation)}
            className="text-body-2-medium flex h-[42px] shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-full bg-gray-900 px-4 py-2.5 text-white"
          >
            <Image src="/icons/calendar/chat.svg" alt="채팅" width={20} height={20} />
            채팅 보내기
          </button>
          <button
            type="button"
            onClick={() => onChangeClick?.(reservation)}
            className="text-body-2-medium flex h-[42px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-gray-400 bg-white px-4 py-2.5 text-gray-900"
          >
            예약 변경
          </button>
          <button
            type="button"
            onClick={() => onCancelClick?.(reservation)}
            className="text-body-2-medium flex h-[42px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-gray-400 bg-white px-4 py-2.5 text-gray-900"
          >
            예약 취소
          </button>
        </div>
      )}
    </div>
  );
}
