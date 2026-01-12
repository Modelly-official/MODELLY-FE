// 예약 관련 타입 정의

// 시간 슬롯
export interface TimeSlot {
  startTime: string; // HH:mm
  isReserved: boolean;
}

// 날짜별 스케줄
export interface DateSchedule {
  date: string; // yyyy-MM-dd
  times: TimeSlot[];
}

// 예약 가능 시간대 조회 응답
export interface AvailableSchedulesResult {
  recruitmentId: number;
  month: string; // yyyy-MM
  schedules: DateSchedule[];
}

// 예약 생성 요청
export interface ReservationCreateRequest {
  recruitmentId: number;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  category: string;
  subCategories: string[];
  comment: string; // 요청 사항 (시술내역/현재상태)
  designerName: string;
  shop: string;
  imageUrls?: string;
}

// 예약 생성 응답
export interface ReservationCreateResult {
  message: string;
}

export type ReservationStatusCode = 'RESERVATION_CONFIRMED' | 'RESERVATION_PENDING' | 'RESERVATION_CANCELLED';

export interface ReservationScrollResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  nextCursorDate?: string;
  nextCursorTime?: string;
  nextCursorId?: number;
}

export interface DesignerReservationListItem {
  reservationId: number;
  recruitmentId: number;
  recruitmentTitle: string;
  modelUserId: number;
  modelId: number;
  modelName: string;
  subCategories: string[];
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: ReservationStatusCode;
}

export interface ModelReservationListItem {
  reservationId: number;
  recruitmentId: number;
  recruitmentTitle: string;
  designerUserId: number;
  designerId: number;
  designerNickname: string;
  shop: string;
  category: string;
  subCategories: string[];
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: ReservationStatusCode;
}

export interface GetDesignerReservationListParams {
  month?: string; // yyyy-MM
  type: 'UPCOMING' | 'COMPLETED';
  size?: number;
  cursorDate?: string;
  cursorTime?: string;
  cursorId?: number;
}

export interface GetModelReservationListParams {
  month?: string; // yyyy-MM
  type: 'UPCOMING' | 'COMPLETED';
  category?: string;
  size?: number;
  cursorDate?: string;
  cursorTime?: string;
  cursorId?: number;
}

// Presigned URL 응답
export interface ReservationPresignedUrlResult {
  uploadUrl: string;
  imageUrl: string;
}
