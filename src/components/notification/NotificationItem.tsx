'use client';

import NotificationBellIcon from '@/public/icons/common/notification-bell.svg';
import type { NotificationItem as NotificationItemType } from '@/src/types';

interface NotificationItemProps {
  /** 알림 데이터 */
  notification: NotificationItemType;
  /** 클릭 핸들러 */
  onClick?: (notification: NotificationItemType) => void;
}

/**
 * 개별 알림 아이템 컴포넌트
 * - 알림 타입별 아이콘 표시
 * - 클릭 시 해당 알림의 타겟 페이지로 이동
 */
export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const { notificationType, title, content, createdAt } = notification;

  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className="flex w-full cursor-pointer gap-4 text-left"
    >
      {/* 알림 아이콘 */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-500">
        <NotificationBellIcon className="size-5 text-white" />
      </div>

      {/* 알림 내용 */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* 알림 타입 라벨 */}
        <span className="text-body-2-medium text-purple-600">{title || notificationType}</span>

        {/* 알림 내용 */}
        <p className="text-body-2-medium wrap-break-word text-black">{content}</p>

        {/* 시간 */}
        <span className="text-body-2-regular text-gray-600">{createdAt}</span>
      </div>
    </button>
  );
}
