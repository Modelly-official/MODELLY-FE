// 디자이너 캘린더 관련 타입 정의

// 예약 도트 (날짜별 예약 존재 여부)
export interface ReservationDot {
  date: string; // yyyy-MM-dd
  hasReserved: boolean;
}

// 월간 예약 도트 조회 응답
export interface ReservationDotsResult {
  month: string; // yyyy-MM
  reservationDots: ReservationDot[];
}

// 캘린더 예약 아이템
export interface CalendarReservationItem {
  reservationId: number;
  recruitmentId: number | null;
  modelUserId: number;
  modelId: number;
  modelName: string;
  subCategories: string[];
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

// 캘린더 예약 목록 조회 응답
export interface CalendarReservationsResult {
  items: CalendarReservationItem[];
  totalCount: number;
}

// API 요청 파라미터
export interface GetReservationDotsParams {
  month: string; // yyyy-MM
  includePending?: boolean;
}

export interface GetCalendarReservationsParams {
  month: string; // yyyy-MM
  date?: string; // yyyy-MM-dd (특정 날짜 필터)
}
