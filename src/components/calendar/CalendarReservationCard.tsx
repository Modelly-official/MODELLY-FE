'use client';

import { useRouter } from 'next/navigation';
import CalendarIcon from '@/public/icons/myRecruitment/calendar.svg';
import TimeCircleIcon from '@/public/icons/calendar/time-circle.svg';
import ChatIcon from '@/public/icons/nav/chat.svg';
import { subCategoryCodeToName } from '@/src/utils/myRecruitment/category';
import type { CalendarReservationItem } from '@/src/types/calendar';

interface CalendarReservationCardProps {
  reservation: CalendarReservationItem;
}

/**
 * 날짜를 YY.MM.DD 형식으로 포맷
 */
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year.slice(2)}.${month}.${day}`;
}

/**
 * 시간을 12시간 형식 (h:mm am/pm)으로 포맷
 */
function formatTime(timeStr: string): string {
  const [hour, minute] = timeStr.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'pm' : 'am';
  const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${displayHour}:${minute} ${period}`;
}

/**
 * 서브카테고리 코드에서 카테고리 코드 추출
 * 예: HAIR_CUT -> HAIR, EYELASH_PERM -> EYELASH
 */
function extractCategoryFromSubCategory(subCategoryCode: string): string {
  // EYELASH는 특별 처리 (EYELASH_PERM, EYELASH_EXTENSION)
  if (subCategoryCode.startsWith('EYELASH_')) {
    return 'EYELASH';
  }
  // 나머지는 첫 번째 언더스코어 앞까지
  const underscoreIndex = subCategoryCode.indexOf('_');
  return underscoreIndex > 0 ? subCategoryCode.slice(0, underscoreIndex) : subCategoryCode;
}

/**
 * subCategories 배열을 표시 문자열로 변환
 */
function formatSubCategories(subCategories: string[]): string {
  return subCategories
    .map((code) => {
      const category = extractCategoryFromSubCategory(code);
      return subCategoryCodeToName(category, code);
    })
    .join('/');
}

export default function CalendarReservationCard({ reservation }: CalendarReservationCardProps) {
  const router = useRouter();

  const handleChatClick = () => {
    // 채팅 페이지로 이동 (modelUserId 활용)
    router.push(`/chat?userId=${reservation.modelUserId}`);
  };

  const handleChangeClick = () => {
    // TODO: 예약 변경 기능 연결
  };

  const handleCancelClick = () => {
    // TODO: 예약 취소 기능 연결
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      {/* 고객 정보 */}
      <div className="flex flex-col gap-2">
        <p className="text-head-4-semibold text-gray-900">{reservation.modelName}님</p>

        {/* 예약 정보 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4 text-gray-800" />
            <span className="text-body-2-medium text-gray-800">
              {formatDate(reservation.date)}
            </span>
          </div>

          <span className="text-body-2-medium text-gray-800">·</span>

          <div className="flex items-center gap-1">
            <TimeCircleIcon className="size-4" />
            <span className="text-body-2-medium text-gray-800">
              {formatTime(reservation.startTime)}
            </span>
          </div>

          <span className="text-body-2-medium text-gray-800">·</span>

          <span className="text-body-2-medium text-gray-800">
            {formatSubCategories(reservation.subCategories)}
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleChatClick}
          className="flex h-[42px] items-center gap-1 rounded-full bg-gray-900 px-4 py-[10px]"
        >
          <ChatIcon className="size-5 text-white" />
          <span className="text-body-2-medium text-white">채팅 보내기</span>
        </button>

        <button
          type="button"
          onClick={handleChangeClick}
          className="flex h-[42px] items-center justify-center rounded-full border border-gray-400 bg-white px-4 py-[10px]"
        >
          <span className="text-body-2-medium text-gray-900">예약 변경</span>
        </button>

        <button
          type="button"
          onClick={handleCancelClick}
          className="flex h-[42px] items-center justify-center rounded-full border border-gray-400 bg-white px-4 py-[10px]"
        >
          <span className="text-body-2-medium text-gray-900">예약 취소</span>
        </button>
      </div>
    </div>
  );
}
