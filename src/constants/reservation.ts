// 예약 관련 상수

import type { ReservationListType, MyReservationStatus } from '@/src/types';

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
