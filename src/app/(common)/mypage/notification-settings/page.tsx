'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { Toggle, ConfirmModal } from '@/src/components/common';
import { getUserRole } from '@/src/stores';
import { useNotificationSettings, useUpdateNotificationSettings, useSaveFcmToken } from '@/src/hooks/queries';
import { useFCM } from '@/src/hooks/custom';
import { useToast } from '@/src/hooks/common/useToast';
import type { NotificationSettings } from '@/src/types';

// 클라이언트 상태 확인을 위한 외부 스토어
const emptySubscribe = () => () => {};

// 알림 설정 항목 타입
type NotificationItemConfig = {
  key: keyof Omit<NotificationSettings, 'chattingNotification'>;
  title: string;
  description?: string;
};

// 디자이너 알림 설정 항목
const DESIGNER_NOTIFICATIONS: NotificationItemConfig[] = [
  { key: 'reservationNotification', title: '예약 신청 알림', description: '모델 예약 신청 시 알림' },
  { key: 'scheduleNotification', title: '일정 알림', description: '일정 변동 및 리마인드 알림' },
  { key: 'reviewNotification', title: '리뷰 알림', description: '새 리뷰 등록 시 알림' },
];

// 모델 알림 설정 항목
const MODEL_NOTIFICATIONS: NotificationItemConfig[] = [
  {
    key: 'reservationNotification',
    title: '예약 확정/취소 알림',
    description: '신청한 예약 확정 및 취소 시 알림',
  },
  { key: 'scheduleNotification', title: '일정 알림', description: '일정 변동 및 리마인드 알림' },
  { key: 'reviewNotification', title: '리뷰 답글 알림', description: '리뷰 답글 시 알림' },
];

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // 클라이언트 여부 확인 (hydration-safe)
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // 역할 확인
  const role = isClient ? (getUserRole() ?? 'model') : 'model';
  const isDesigner = role === 'designer';

  // 알림 설정 조회
  const { data: settingsData, isLoading } = useNotificationSettings(isClient);

  // 알림 설정 수정
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateNotificationSettings();

  // FCM 권한 및 토큰 관리
  const { permission, requestPermission } = useFCM();
  const { mutate: saveFcmToken, isPending: isSavingToken } = useSaveFcmToken();
  const [permissionModalDismissed, setPermissionModalDismissed] = useState(false);
  const [tokenSaved, setTokenSaved] = useState(false);
  const [tokenSaveAttempted, setTokenSaveAttempted] = useState(false);

  // 권한 상태가 default이고 모달을 닫지 않았을 때 표시
  const isPermissionModalOpen = isClient && permission === 'default' && !permissionModalDismissed;

  // 권한이 granted인데 토큰이 저장 안 됐으면 자동 발급/저장
  useEffect(() => {
    const autoRegisterToken = async () => {
      if (isClient && permission === 'granted' && !tokenSaved && !tokenSaveAttempted) {
        const fcmToken = await requestPermission();
        if (fcmToken) {
          saveFcmToken(fcmToken, {
            onSuccess: () => {
              setTokenSaved(true);
              setTokenSaveAttempted(true);
            },
            onError: () => {
              setTokenSaveAttempted(true);
            },
          });
        } else {
          setTokenSaveAttempted(true);
        }
      }
    };
    autoRegisterToken();
  }, [isClient, permission, tokenSaved, tokenSaveAttempted, requestPermission, saveFcmToken]);

  // 권한 요청 모달 확인 핸들러
  const handlePermissionConfirm = async () => {
    setPermissionModalDismissed(true);
    const fcmToken = await requestPermission();
    if (fcmToken) {
      saveFcmToken(fcmToken, {
        onSuccess: () => {
          setTokenSaved(true);
          showToast('알림이 활성화되었습니다.');
        },
        onError: () => {
          showToast('알림 설정에 실패했습니다.');
        },
      });
    }
  };

  // PWA 여부에 따른 denied 안내 문구
  const isPWA = isClient && window.matchMedia('(display-mode: standalone)').matches;
  const deniedMessage = isPWA
    ? '기기 설정에서 알림을 허용해주세요'
    : '브라우저 설정에서 알림을 허용해주세요';

  // 현재 설정값
  const settings: NotificationSettings = settingsData?.result ?? {
    chattingNotification: false,
    reservationNotification: false,
    scheduleNotification: false,
    reviewNotification: false,
  };

  // 설정 업데이트 핸들러
  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };

    updateSettings(newSettings, {
      onSuccess: () => {
        showToast('알림 설정이 변경되었습니다.');
      },
      onError: () => {
        showToast('알림 설정 변경에 실패했습니다.');
      },
    });
  };

  // 역할에 따른 알림 항목
  const notificationItems = isDesigner ? DESIGNER_NOTIFICATIONS : MODEL_NOTIFICATIONS;

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <header className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => router.push('/mypage')}
            className="flex size-6 cursor-pointer items-center justify-center"
            aria-label="뒤로가기"
          >
            <ArrowLeftIcon className="text-black" />
          </button>
          <h1 className="text-head-4-medium text-center text-black">알림 설정</h1>
          <div className="size-6" />
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  // 권한 denied 상태
  const isPermissionDenied = permission === 'denied';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.push('/mypage')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="text-black" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">알림 설정</h1>
        <div className="size-6" />
      </header>

      {/* 권한 거부 안내 */}
      {isPermissionDenied && (
        <div className="mx-4 mb-2 rounded-xl bg-gray-100 p-3">
          <p className="text-body-2-regular text-gray-600">{deniedMessage}</p>
        </div>
      )}

      {/* 알림 설정 리스트 */}
      <div className={`flex flex-col ${isPermissionDenied ? 'pointer-events-none opacity-50' : ''}`}>
        {/* 채팅 알림 */}
        <div
          className={`flex items-center justify-between p-4 transition-opacity ${
            !settings.chattingNotification ? 'opacity-50' : ''
          }`}
        >
          <span className="text-body-1-medium text-gray-900">채팅 알림</span>
          <Toggle
            checked={settings.chattingNotification}
            onChange={(checked) => handleSettingChange('chattingNotification', checked)}
            disabled={isUpdating || isPermissionDenied}
          />
        </div>

        {/* 구분선 */}
        <div className="mx-4 h-px bg-gray-300" />

        {/* 하위 알림 항목들 */}
        <div>
          {notificationItems.map((item, index) => (
            <div key={item.key}>
              <div
                className={`flex items-center justify-between p-4 transition-opacity ${
                  !settings[item.key] ? 'opacity-50' : ''
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-body-1-medium text-gray-900">{item.title}</span>
                  {item.description && (
                    <span className="text-body-2-regular text-gray-500">{item.description}</span>
                  )}
                </div>
                <Toggle
                  checked={settings[item.key]}
                  onChange={(checked) => handleSettingChange(item.key, checked)}
                  disabled={isUpdating || isPermissionDenied}
                />
              </div>
              {/* 마지막 항목이 아니면 구분선 */}
              {index < notificationItems.length - 1 && <div className="mx-4 h-px bg-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* 알림 권한 요청 모달 */}
      <ConfirmModal
        isOpen={isPermissionModalOpen}
        onClose={() => setPermissionModalDismissed(true)}
        onConfirm={handlePermissionConfirm}
        message="알림을 허용하시겠습니까?"
        confirmText="허용"
        cancelText="취소"
        isLoading={isSavingToken}
      />
    </div>
  );
}
