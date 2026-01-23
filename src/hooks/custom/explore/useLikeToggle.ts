'use client';

import { useState, useCallback } from 'react';
import { getAccessToken } from '@/src/stores';

interface UseLikeToggleOptions {
  serverValue: boolean;
  onToggle?: () => void;
}

interface UseLikeToggleReturn {
  isLiked: boolean;
  handleClick: (e: React.MouseEvent) => void;
}

/**
 * 찜하기 토글 로직을 추상화한 Hook
 * RecruitmentCard와 DesignerCard에서 공통으로 사용
 *
 * 서버 상태(serverValue)와 로컬 토글 카운트를 조합하여
 * optimistic update와 서버 동기화를 모두 지원
 */
export function useLikeToggle({ serverValue, onToggle }: UseLikeToggleOptions): UseLikeToggleReturn {
  // 토글 카운트: 홀수면 서버 값 반전
  const [toggleCount, setToggleCount] = useState(0);
  const [trackedServerValue, setTrackedServerValue] = useState(serverValue);

  // 서버 값이 변경되면 토글 카운트 리셋 (렌더 중 상태 업데이트 - React 권장 패턴)
  if (trackedServerValue !== serverValue) {
    setToggleCount(0);
    setTrackedServerValue(serverValue);
  }

  // 서버 상태 + 로컬 토글 카운트로 현재 상태 계산
  const isLiked = toggleCount % 2 === 0 ? serverValue : !serverValue;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 로그인하지 않은 경우: UI 토글 없이 콜백만 실행 (Toast 표시용)
      if (!getAccessToken()) {
        onToggle?.();
        return;
      }

      setToggleCount((prev) => prev + 1);
      onToggle?.();
    },
    [onToggle]
  );

  return { isLiked, handleClick };
}
