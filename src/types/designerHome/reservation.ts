/**
 * 디자이너 홈 - 예약 관련 타입 정의
 */

// ===== 오늘의 예약 =====

/** 오늘의 예약 아이템 */
export interface TodayReservationItem {
  reservationId: number;
  modelName: string;
  subCategories: string[];
  time: string; // HH:mm
}

/** 오늘의 예약 목록 응답 */
export interface TodayReservationsResult {
  date: string; // yyyy-MM-dd
  totalCount: number;
  reservations: TodayReservationItem[];
}

// ===== 신규 예약 신청 =====

/** 신규 예약 신청 아이템 */
export interface PendingReservationItem {
  reservationId: number;
  modelUserId?: number;
  modelName: string;
  subCategories: string[];
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
}

/** 신규 예약 신청 목록 응답 */
export interface PendingReservationsResult {
  reservations: PendingReservationItem[];
  totalCount: number;
  cursorId: number | null;
  cursorDate: string | null;
  cursorTime: string | null;
  hasNext: boolean;
}

// ===== 예약 상세 =====

/** 예약 상태 (API 응답값) */
export type ReservationStatus = '예약대기' | '예약확정' | '예약거절' | '예약취소';

/** 예약 상세 정보 */
export interface ReservationDetailResult {
  reservationId: number;
  recruitmentId?: number;
  modelUserId: number;
  modelName: string;
  category: string;
  subCategories: string[];
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  imageUrl: string | null;
  comment: string | null;
  cancelReason: string | null;
  status: ReservationStatus;
}

// ===== API 요청 파라미터 =====

/** 오늘의 예약 조회 파라미터 */
export interface GetTodayReservationsParams {
  date: string; // yyyy-MM-dd
}
