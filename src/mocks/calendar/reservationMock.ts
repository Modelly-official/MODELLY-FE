// 예약 변경/취소 Mock 데이터

import type { AvailableTimeSlot, ReservationInfo } from '@/src/types/reservation';

// Mock 가능 시간 슬롯 (1시간 간격: 09:00~21:00)
export const MOCK_TIME_SLOTS: AvailableTimeSlot[] = [
  { value: '09:00', label: '09:00' },
  { value: '10:00', label: '10:00' },
  { value: '11:00', label: '11:00' },
  { value: '12:00', label: '12:00' },
  { value: '13:00', label: '13:00' },
  { value: '14:00', label: '14:00' },
  { value: '15:00', label: '15:00' },
  { value: '16:00', label: '16:00' },
  { value: '17:00', label: '17:00' },
  { value: '18:00', label: '18:00' },
  { value: '19:00', label: '19:00' },
  { value: '20:00', label: '20:00' },
  { value: '21:00', label: '21:00' },
];

// Mock 예약 정보 (테스트용)
export const MOCK_RESERVATION_INFO: ReservationInfo = {
  reservationId: 1,
  modelUserId: 100,
  modelName: '박예나',
  date: '2025-10-31',
  startTime: '13:00',
  endTime: '14:00',
};
