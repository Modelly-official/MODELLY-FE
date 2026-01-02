import { axiosInstance } from '../axios';
import type {
  ApiResponse,
  AvailableSchedulesResult,
  ReservationCreateRequest,
  ReservationCreateResult,
  ReservationPresignedUrlResult,
} from '@/src/types';

interface GetAvailableSchedulesParams {
  recruitmentId: number;
  month?: string; // yyyy-MM (기본값: 현재 월)
}

/**
 * 예약 가능한 시간대 조회
 * GET /models/reservations/available-schedules
 */
export async function getAvailableSchedules(
  params: GetAvailableSchedulesParams
): Promise<ApiResponse<AvailableSchedulesResult>> {
  const { data } = await axiosInstance.get<ApiResponse<AvailableSchedulesResult>>(
    '/models/reservations/available-schedules',
    { params }
  );
  return data;
}

/**
 * 예약 생성
 * POST /models/reservations
 */
export async function createReservation(
  request: ReservationCreateRequest
): Promise<ApiResponse<ReservationCreateResult>> {
  const { data } = await axiosInstance.post<ApiResponse<ReservationCreateResult>>(
    '/models/reservations',
    request
  );
  return data;
}

/**
 * 예약 이미지용 Presigned URL 발급
 * GET /presigned-url/reservations
 */
export async function getReservationPresignedUrl(): Promise<
  ApiResponse<ReservationPresignedUrlResult>
> {
  const { data } = await axiosInstance.get<ApiResponse<ReservationPresignedUrlResult>>(
    '/presigned-url/reservations'
  );
  return data;
}
