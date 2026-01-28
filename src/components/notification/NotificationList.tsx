'use client';

import { useRouter } from 'next/navigation';
import NotificationItem from './NotificationItem';
import { getNotificationTargetUrl } from '@/src/utils/notification';
import type { NotificationItem as NotificationItemType } from '@/src/types';

interface NotificationListProps {
  /** 알림 목록 */
  notifications: NotificationItemType[];
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 다음 페이지 로딩 상태 */
  isFetchingNext?: boolean;
}

/**
 * 알림 목록 컴포넌트
 * - 알림 아이템 리스트 렌더링
 * - 빈 상태 처리
 * - 알림 클릭 시 해당 페이지로 라우팅
 */
export default function NotificationList({
  notifications,
  isLoading,
  isFetchingNext,
}: NotificationListProps) {
  const router = useRouter();

  /** 알림 클릭 시 해당 페이지로 이동 */
  const handleNotificationClick = (notification: NotificationItemType) => {
    const { notificationType, targetId, title } = notification;
    const targetUrl = getNotificationTargetUrl({ notificationType, targetId, title });
    router.push(targetUrl);
  };

  // 초기 로딩
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-4 py-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 빈 상태
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-body-1-medium text-gray-500">알림이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.notificationId}
          notification={notification}
          onClick={handleNotificationClick}
        />
      ))}

      {/* 다음 페이지 로딩 스피너 */}
      {isFetchingNext && (
        <div className="flex justify-center py-4">
          <div className="size-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
}

/** 알림 스켈레톤 */
function NotificationSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="size-9 shrink-0 animate-skeleton rounded-full bg-gray-200" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-16 animate-skeleton rounded bg-gray-200" />
        <div className="h-4 w-full animate-skeleton rounded bg-gray-200" />
        <div className="h-4 w-20 animate-skeleton rounded bg-gray-200" />
      </div>
    </div>
  );
}
