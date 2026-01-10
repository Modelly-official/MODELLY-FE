// 예약 관련 상수

import type { ReservationListType, MyReservationStatus, ReservationCategoryFilter } from '@/src/types';

/** 예약 내역 탭 옵션 */
export const RESERVATION_TABS: { value: ReservationListType; label: string }[] = [
  { value: 'UPCOMING', label: '다가오는 일정' },
  { value: 'COMPLETED', label: '완료된 일정' },
];

/** 예약 상태 한글 매핑 */
export const RESERVATION_STATUS_LABEL: Record<MyReservationStatus, string> = {
  RESERVATION_CONFIRMED: '예약확정',
  RESERVATION_PENDING: '예약대기',
  RESERVATION_CANCELLED: '예약취소',
};

/** 예약 내역 카테고리 필터 옵션 (SubCategoryChips 형식) */
export const RESERVATION_CATEGORY_FILTERS: { code: ReservationCategoryFilter; name: string }[] = [
  { code: 'ALL', name: '전체' },
  { code: 'HAIR', name: '헤어' },
  { code: 'NAIL', name: '네일' },
  { code: 'TATTOO', name: '타투' },
  { code: 'EYELASH', name: '속눈썹' },
];

/** 월 선택 옵션 생성 함수 (SortDropdown 형식) */
export function generateMonthOptions(baseYear: number): { code: string; name: string }[] {
  const options: { code: string; name: string }[] = [];
  const yearRange = [baseYear - 1, baseYear, baseYear + 1];

  yearRange.forEach((year) => {
    for (let month = 1; month <= 12; month++) {
      const code = `${year}-${String(month).padStart(2, '0')}`;
      const name = `${year}.${String(month).padStart(2, '0')}`;
      options.push({ code, name });
    }
  });

  return options;
}
