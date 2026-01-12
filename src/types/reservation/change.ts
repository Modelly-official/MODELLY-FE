// 예약 변경/취소 관련 타입 정의

// 예약 변경 요청
export interface ReservationChangeRequest {
  proposedDate: string; // yyyy-MM-dd
  proposedStartTime: string; // HH:mm
  reason: string;
}

// 예약 취소 요청
export interface ReservationCancelRequest {
  reason: string;
}

// 예약 변경/취소 API 응답
export interface ReservationChangeResult {
  message: string;
}

// 모달에서 사용할 예약 정보 타입
export interface ReservationInfo {
  reservationId: number;
  recruitmentId?: number | null;
  recruitmentTitle?: string;
  modelUserId: number;
  modelName: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
}

// 시간 선택용 슬롯 (Dropdown에서 사용)
export interface AvailableTimeSlot {
  value: string; // HH:mm (Dropdown option value)
  label: string; // 표시용 텍스트 (예: "09:00")
}
