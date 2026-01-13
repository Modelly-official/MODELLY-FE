'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { Toggle } from '@/src/components/common';
import { getUserRole } from '@/src/stores';

// 클라이언트 상태 확인을 위한 외부 스토어
const emptySubscribe = () => () => {};

// 알림 설정 항목 타입
type NotificationItem = {
  key: string;
  title: string;
  description?: string;
};

// 디자이너 알림 설정 항목
const DESIGNER_NOTIFICATIONS: NotificationItem[] = [
  { key: 'reservation', title: '예약 신청 알림', description: '모델 예약 신청 시 알림' },
  { key: 'schedule', title: '일정 알림', description: '일정 변동 및 리마인드 알림' },
  { key: 'review', title: '리뷰 알림', description: '새 리뷰 등록 시 알림' },
];

// 모델 알림 설정 항목
const MODEL_NOTIFICATIONS: NotificationItem[] = [
  { key: 'reservation', title: '예약 확정/취소 알림', description: '신청한 예약 확정 및 취소 시 알림' },
  { key: 'schedule', title: '일정 알림', description: '일정 변동 및 리마인드 알림' },
  { key: 'review', title: '리뷰 답글 알림', description: '리뷰 답글 시 알림' },
];

export default function NotificationSettingsPage() {
  const router = useRouter();

  // 클라이언트 여부 확인 (hydration-safe)
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // 역할 확인
  const role = isClient ? (getUserRole() ?? 'model') : 'model';
  const isDesigner = role === 'designer';

  // 알림 설정 상태
  const [chatNotification, setChatNotification] = useState(false);
  const [subNotifications, setSubNotifications] = useState({
    reservation: false,
    schedule: false,
    review: false,
  });

  // 채팅 알림 토글 핸들러 (마스터 토글)
  const handleChatToggle = (checked: boolean) => {
    setChatNotification(checked);
    if (checked) {
      // ON: 모든 하위 항목 활성화
      setSubNotifications({ reservation: true, schedule: true, review: true });
    } else {
      // OFF: 모든 하위 항목 비활성화
      setSubNotifications({ reservation: false, schedule: false, review: false });
    }
  };

  // 하위 알림 토글 핸들러
  const handleSubToggle = (key: string, checked: boolean) => {
    setSubNotifications((prev) => ({ ...prev, [key]: checked }));
  };

  // 역할에 따른 알림 항목
  const notificationItems = isDesigner ? DESIGNER_NOTIFICATIONS : MODEL_NOTIFICATIONS;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="text-black" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">알림 설정</h1>
        {/* 균형을 위한 빈 공간 */}
        <div className="size-6" />
      </header>

      {/* 알림 설정 리스트 */}
      <div className="flex flex-col">
        {/* 채팅 알림 (마스터 토글) */}
        <div className="flex items-center justify-between p-4">
          <span className="text-body-1-medium text-gray-900">채팅 알림</span>
          <Toggle checked={chatNotification} onChange={handleChatToggle} />
        </div>

        {/* 구분선 */}
        <div className="mx-4 h-px bg-gray-300" />

        {/* 하위 알림 항목들 */}
        <div
          className={`transition-opacity duration-200 ${
            !chatNotification ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          {notificationItems.map((item, index) => (
            <div key={item.key}>
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-body-1-medium text-gray-900">{item.title}</span>
                  {item.description && (
                    <span className="text-body-2-regular text-gray-500">{item.description}</span>
                  )}
                </div>
                <Toggle
                  checked={subNotifications[item.key as keyof typeof subNotifications]}
                  onChange={(checked) => handleSubToggle(item.key, checked)}
                  disabled={!chatNotification}
                />
              </div>
              {/* 마지막 항목이 아니면 구분선 */}
              {index < notificationItems.length - 1 && (
                <div className="mx-4 h-px bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
