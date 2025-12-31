'use client';

import { useState, useMemo } from 'react';

/**
 * iOS 사용자를 위한 PWA 설치 안내 컴포넌트
 * - iOS 기기에서만 표시
 * - 이미 홈 화면에 설치된 경우 표시하지 않음
 */
export const InstallPrompt = () => {
  const [isVisible, setIsVisible] = useState(true);

  // iOS 기기 및 설치 상태 체크 (클라이언트 사이드에서만)
  const shouldShow = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    // iOS 기기 감지
    interface WindowWithMSStream extends Window {
      MSStream?: unknown;
    }
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as WindowWithMSStream).MSStream;

    // 이미 홈 화면에 설치되어 있는지 확인
    const standalone = window.matchMedia('(display-mode: standalone)').matches;

    // iOS이고 아직 설치되지 않은 경우에만 표시
    return iOS && !standalone;
  }, []);

  // 닫기 버튼 핸들러
  const handleClose = () => {
    setIsVisible(false);
  };

  // 표시 조건을 만족하지 않으면 렌더링하지 않음
  if (!isVisible || !shouldShow) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 mx-auto w-full sm:w-[375px]">
      <div className="bg-purple-800 px-5 py-4 text-white shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-body-1-semibold mb-1">Monde 앱 설치하기</h3>
            <p className="text-body-2-regular mb-2">홈 화면에 추가하여 앱처럼 사용하세요</p>
            <div className="text-caption-1-medium flex items-center gap-1">
              <span>1. 하단 공유 버튼</span>
              <span className="text-body-1-semibold">⎋</span>
              <span>탭</span>
            </div>
            <div className="text-caption-1-medium flex items-center gap-1">
              <span>2. &quot;홈 화면에 추가&quot;</span>
              <span className="text-body-1-semibold">➕</span>
              <span>선택</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-body-1-semibold flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-purple-700"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};
