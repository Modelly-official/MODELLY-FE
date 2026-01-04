/**
 * 디자이너 홈 - 예약 관련 타입 정의
 */

// ===== 오늘의 예약 =====

/** 오늘의 예약 아이템 */
export interface TodayReservationItem {
  reservationId: number;
  modelName: string;
  subCategories: string[];
  startTime: string; // HH:mm
}

/** 오늘의 예약 목록 응답 */
export interface TodayReservationsResult {
  date: string; // yyyy-MM-dd
  items: TodayReservationItem[];
  totalCount: number;
}

// ===== 신규 예약 신청 =====

/** 신규 예약 신청 아이템 */
export interface PendingReservationItem {
  reservationId: number;
  modelUserId: number;
  modelName: string;
  subCategories: string[];
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
}

/** 신규 예약 신청 목록 응답 */
export interface PendingReservationsResult {
  items: PendingReservationItem[];
  totalCount: number;
}

// ===== 예약 상세 =====

/** 예약 상태 */
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

/** 예약 상세 정보 */
export interface ReservationDetailResult {
  reservationId: number;
  modelUserId: number;
  modelName: string;
  subCategories: string[];
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  photos: string[];
  status: ReservationStatus;
}

// ===== API 요청 파라미터 =====

/** 오늘의 예약 조회 파라미터 */
export interface GetTodayReservationsParams {
  date: string; // yyyy-MM-dd
}
