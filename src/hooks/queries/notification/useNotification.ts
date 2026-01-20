/**
 * 알림(Notification) Query Hooks
 */

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadNotificationCount,
  getNotificationSettings,
  updateNotificationSettings,
  saveFcmToken,
} from '@/src/apis';
import type {
  ApiResponse,
  NotificationType,
  NotificationListResult,
  NotificationSettings,
  UnreadNotificationResult,
} from '@/src/types';

/** Query Key Factory */
export const notificationKeys = {
  all: ['notification'] as const,
  list: (type?: NotificationType, size?: number) => [...notificationKeys.all, 'list', type, size] as const,
  settings: () => [...notificationKeys.all, 'settings'] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
};

interface UseNotificationListParams {
  type?: NotificationType;
  size?: number;
  enabled?: boolean;
}

/**
 * 알림 목록 무한 스크롤 Hook
 */
export function useNotificationList(params: UseNotificationListParams = {}) {
  const { type, size = 20, enabled = true } = params;

  return useInfiniteQuery<
    ApiResponse<NotificationListResult>,
    Error,
    { pages: ApiResponse<NotificationListResult>[]; pageParams: (number | undefined)[] },
    ReturnType<typeof notificationKeys.list>,
    number | undefined
  >({
    queryKey: notificationKeys.list(type, size),
    queryFn: async ({ pageParam }) => {
      return getNotifications({
        notificationType: type,
        cursorId: pageParam,
        size,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) return undefined;
      return lastPage.result.nextCursor ?? undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 읽지 않은 알림 개수 조회 Hook
 */
export function useUnreadNotificationCount(enabled = true) {
  return useQuery<ApiResponse<UnreadNotificationResult>, Error>({
    queryKey: notificationKeys.unread(),
    queryFn: getUnreadNotificationCount,
    enabled,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 알림 설정 조회 Hook
 */
export function useNotificationSettings(enabled = true) {
  return useQuery<ApiResponse<NotificationSettings>, Error>({
    queryKey: notificationKeys.settings(),
    queryFn: getNotificationSettings,
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 알림 설정 수정 Mutation Hook
 */
export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<string>, Error, NotificationSettings>({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.settings() });
    },
  });
}

/**
 * FCM 토큰 저장 Mutation Hook
 */
export function useSaveFcmToken() {
  return useMutation<ApiResponse<string>, Error, string>({
    mutationFn: (fcmToken: string) => saveFcmToken({ fcmToken }),
  });
}
