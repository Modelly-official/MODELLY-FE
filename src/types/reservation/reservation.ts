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

// Presigned URL 응답
export interface ReservationPresignedUrlResult {
  uploadUrl: string;
  imageUrl: string;
}
