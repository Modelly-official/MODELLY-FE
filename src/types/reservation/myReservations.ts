// 예약 내역 페이지 관련 타입 정의

// 예약 상태 (마이페이지 예약 목록 API 응답 코드)
export type MyReservationStatus =
  | 'RESERVATION_CONFIRMED'
  | 'RESERVATION_PENDING'
  | 'RESERVATION_CANCELLED';

// 예약 목록 타입 (탭)
export type ReservationListType = 'UPCOMING' | 'COMPLETED';

// 모델 예약 목록 아이템
export interface ModelReservationItem {
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
  status: MyReservationStatus;
}

// 디자이너 예약 목록 아이템
export interface DesignerReservationItem {
  reservationId: number;
  modelUserId: number;
  modelName: string;
  modelProfileImageUrl?: string;
  category: string;
  subCategories: string[];
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: MyReservationStatus;
  comment?: string;
  imageUrls?: string[];
}

// 예약 목록 응답
export interface ReservationsResponse<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  nextCursorDate?: string;
  nextCursorTime?: string;
  nextCursorId?: number;
}

// 예약 목록 조회 파라미터
export interface ReservationsParams {
  type: ReservationListType;
  cursorId?: number;
  cursorDate?: string;
  cursorTime?: string;
  size?: number;
}
