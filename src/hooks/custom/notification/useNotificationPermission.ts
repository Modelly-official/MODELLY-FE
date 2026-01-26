'use client';

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react';
import { useFCM } from './useFCM';
import {
  NOTIFICATION_STORAGE_KEYS,
  PERMISSION_MESSAGES,
} from '@/src/constants/notification';
import type {
  EffectivePermissionState,
  PermissionUIConfig,
} from '@/src/types/notification';

// 클라이언트 상태 확인을 위한 외부 스토어
const emptySubscribe = () => () => {};

/** localStorage에서 거부 상태 초기값 로드 */
function getInitialDismissedState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      localStorage.getItem(NOTIFICATION_STORAGE_KEYS.PROMPT_DISMISSED) === 'true'
    );
  } catch {
    return false;
  }
}

interface PlatformInfo {
  isIOS: boolean;
  isPWA: boolean;
  isIOSSafari: boolean;
  isNotificationSupported: boolean;
}

interface UseNotificationPermissionReturn {
  /** 유효 권한 상태 */
  state: EffectivePermissionState;
  /** UI 설정 */
  uiConfig: PermissionUIConfig;
  /** 플랫폼 정보 */
  platform: PlatformInfo;
  /** 앱 거부 상태 리셋 */
  resetDismissed: () => void;
  /** 앱 거부 상태 설정 */
  setDismissed: () => void;
  /** 원본 브라우저 권한 */
  browserPermission: NotificationPermission;
  /** FCM 권한 요청 함수 */
  requestPermission: () => Promise<string | null>;
}

/**
 * 알림 권한 상태 통합 관리 훅
 *
 * 브라우저 권한 + 앱 상태 + 플랫폼 정보를 통합하여
 * 유효 권한 상태와 UI 설정을 제공합니다.
 */
export function useNotificationPermission(): UseNotificationPermissionReturn {
  const { permission: browserPermission, requestPermission } = useFCM();

  // 클라이언트 여부 확인 (hydration-safe)
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // localStorage에서 거부 상태 로드 (lazy initialization)
  const [userDismissed, setUserDismissed] = useState(getInitialDismissedState);

  // 플랫폼 감지
  const platform = useMemo((): PlatformInfo => {
    if (!isClient) {
      return {
        isIOS: false,
        isPWA: false,
        isIOSSafari: false,
        isNotificationSupported: false,
      };
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSSafari = isIOS && !isPWA;
    const isNotificationSupported = 'Notification' in window;

    return { isIOS, isPWA, isIOSSafari, isNotificationSupported };
  }, [isClient]);

  // 거부 상태 설정
  const setDismissed = useCallback(() => {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEYS.PROMPT_DISMISSED, 'true');
      setUserDismissed(true);
    } catch {
      // Private mode
    }
  }, []);

  // 거부 상태 리셋 (다시 활성화)
  const resetDismissed = useCallback(() => {
    try {
      localStorage.removeItem(NOTIFICATION_STORAGE_KEYS.PROMPT_DISMISSED);
      setUserDismissed(false);
    } catch {
      // Private mode
    }
  }, []);

  // 유효 권한 상태 계산
  const state = useMemo((): EffectivePermissionState => {
    if (!isClient) return 'prompt_needed';

    // 1. iOS Safari (PWA 미설치) 또는 Notification API 미지원
    if (platform.isIOSSafari || !platform.isNotificationSupported) {
      return 'not_supported';
    }

    // 2. 브라우저에서 권한 거부
    if (browserPermission === 'denied') {
      return 'browser_denied';
    }

    // 3. 앱 모달에서 거부
    if (browserPermission === 'default' && userDismissed) {
      return 'app_dismissed';
    }

    // 4. 권한 허용됨
    if (browserPermission === 'granted') {
      return 'granted';
    }

    // 5. 아직 요청 전
    return 'prompt_needed';
  }, [isClient, platform, browserPermission, userDismissed]);

  // UI 설정 매핑
  const uiConfig = useMemo((): PermissionUIConfig => {
    const configs: Record<EffectivePermissionState, PermissionUIConfig> = {
      not_supported: {
        disabled: true,
        message: PERMISSION_MESSAGES.not_supported,
        showInstallGuide: true,
      },
      browser_denied: {
        disabled: true,
        message: platform.isPWA
          ? PERMISSION_MESSAGES.browser_denied_pwa
          : PERMISSION_MESSAGES.browser_denied_web,
      },
      app_dismissed: {
        disabled: true,
        message: PERMISSION_MESSAGES.app_dismissed,
        showResetButton: true,
      },
      granted: {
        disabled: false,
        message: null,
      },
      prompt_needed: {
        disabled: false,
        message: null,
        showModal: true,
      },
    };

    return configs[state];
  }, [state, platform.isPWA]);

  return {
    state,
    uiConfig,
    platform,
    resetDismissed,
    setDismissed,
    browserPermission,
    requestPermission,
  };
}
