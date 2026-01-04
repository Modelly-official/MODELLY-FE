import type {
  TodayReservationsResult,
  PendingReservationsResult,
  ReservationDetailResult,
} from '@/src/types/designerHome';

// ===== 오늘의 예약 Mock 데이터 =====
export const mockTodayReservations: TodayReservationsResult = {
  date: '2025-01-04',
  items: [
    { reservationId: 1, modelName: '김현지', subCategories: ['펌'], startTime: '13:00' },
    { reservationId: 2, modelName: '김현지', subCategories: ['커트'], startTime: '13:00' },
  ],
  totalCount: 2,
};

// ===== 신규 예약 신청 Mock 데이터 =====
export const mockPendingReservations: PendingReservationsResult = {
  items: [
    {
      reservationId: 3,
      modelUserId: 101,
      modelName: '박지민',
      subCategories: ['커트'],
      date: '2025-01-15',
      startTime: '17:00',
    },
    {
      reservationId: 4,
      modelUserId: 102,
      modelName: '최수아',
      subCategories: ['펌'],
      date: '2025-01-18',
      startTime: '19:00',
    },
    {
      reservationId: 5,
      modelUserId: 103,
      modelName: '정민서',
      subCategories: ['커트'],
      date: '2025-01-20',
      startTime: '14:00',
    },
    {
      reservationId: 6,
      modelUserId: 104,
      modelName: '이서연',
      subCategories: ['염색'],
      date: '2025-01-22',
      startTime: '13:00',
    },
    {
      reservationId: 7,
      modelUserId: 105,
      modelName: '한지은',
      subCategories: ['펌'],
      date: '2025-01-27',
      startTime: '09:00',
    },
  ],
  totalCount: 5,
};

// ===== 예약 상세 Mock 데이터 =====
export const mockReservationDetail: ReservationDetailResult = {
  reservationId: 3,
  modelUserId: 101,
  modelName: '김나영',
  subCategories: ['모델 시술', '커트'],
  date: '2025-01-15',
  startTime: '21:00',
  endTime: '22:00',
  photos: ['/images/sample-hair.jpg'],
  status: 'PENDING',
};
