'use client';

import type { PermissionUIConfig } from '@/src/types/notification';
import IOSInstallGuide from './IOSInstallGuide';

interface NotificationStatusBannerProps {
  uiConfig: PermissionUIConfig;
  onResetDismissed?: () => void;
}

/**
 * 알림 권한 상태 안내 배너 컴포넌트
 */
export default function NotificationStatusBanner({
  uiConfig,
  onResetDismissed,
}: NotificationStatusBannerProps) {
  const { message, showInstallGuide, showResetButton } = uiConfig;

  if (!message) return null;

  return (
    <div className="mx-4 mb-2 rounded-xl bg-gray-100 p-3">
      <p className="text-body-2-regular text-gray-600">{message}</p>

      {/* iOS PWA 설치 안내 */}
      {showInstallGuide && <IOSInstallGuide className="mt-2" />}

      {/* 다시 활성화 버튼 */}
      {showResetButton && onResetDismissed && (
        <button
          type="button"
          onClick={onResetDismissed}
          className="text-caption-1-medium text-purple-500 mt-2 underline cursor-pointer"
        >
          다시 활성화
        </button>
      )}
    </div>
  );
}
