/**
 * 알림(Notification) API
 */

import { axiosInstance } from '../axios';
import type {
  ApiResponse,
  NotificationListParams,
  NotificationListResult,
  NotificationSettings,
  UnreadNotificationResult,
  SaveFcmTokenRequest,
} from '@/src/types';

/**
 * 알림 목록 조회
 * GET /notifications
 */
export async function getNotifications(
  params: NotificationListParams
): Promise<ApiResponse<NotificationListResult>> {
  const { data } = await axiosInstance.get<ApiResponse<NotificationListResult>>(
    '/notifications',
    { params }
  );
  return data;
}

/**
 * 읽지 않은 알림 개수 조회
 * GET /notifications/unread
 */
export async function getUnreadNotificationCount(): Promise<ApiResponse<UnreadNotificationResult>> {
  const { data } = await axiosInstance.get<ApiResponse<UnreadNotificationResult>>(
    '/notifications/unread'
  );
  return data;
}

/**
 * 알림 설정 조회
 * GET /notification-setting
 */
export async function getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {
  const { data } = await axiosInstance.get<ApiResponse<NotificationSettings>>(
    '/notification-setting'
  );
  return data;
}

/**
 * 알림 설정 수정
 * PUT /notification-setting
 */
export async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<ApiResponse<string>> {
  const { data } = await axiosInstance.put<ApiResponse<string>>(
    '/notification-setting',
    settings
  );
  return data;
}

/**
 * FCM 토큰 저장
 * POST /fcm-token
 */
export async function saveFcmToken(
  request: SaveFcmTokenRequest
): Promise<ApiResponse<string>> {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    '/fcm-token',
    request
  );
  return data;
}
