'use client';

import { useState, useCallback } from 'react';

interface UseLikeToggleOptions {
  initialValue: boolean;
  onToggle?: () => void;
}

interface UseLikeToggleReturn {
  isLiked: boolean;
  handleClick: (e: React.MouseEvent) => void;
}

/**
 * 찜하기 토글 로직을 추상화한 Hook
 * RecruitmentCard와 DesignerCard에서 공통으로 사용
 */
export function useLikeToggle({ initialValue, onToggle }: UseLikeToggleOptions): UseLikeToggleReturn {
  const [isLiked, setIsLiked] = useState(initialValue);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsLiked((prev) => !prev);
      onToggle?.();
    },
    [onToggle]
  );

  return { isLiked, handleClick };
}
