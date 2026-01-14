'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVerticalDragOptions {
  /** 드래그 종료 시 호출되는 콜백 (드래그 델타를 전달) */
  onDragEnd?: (deltaY: number) => void;
  /** 드래그 중 호출되는 콜백 (현재 deltaY를 전달) */
  onDragMove?: (deltaY: number) => void;
  /** 글로벌 마우스 이벤트 사용 여부 (기본: true) */
  useGlobalMouseEvents?: boolean;
}

interface UseVerticalDragReturn {
  /** 드래그 중 여부 */
  isDragging: boolean;
  /** 현재 드래그 델타 Y (px) */
  deltaY: number;

  // 터치 이벤트 핸들러
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;

  // 마우스 이벤트 핸들러 (핸들 요소용)
  handleMouseDown: (e: React.MouseEvent) => void;

  // 마우스 이벤트 핸들러 (컨테이너용 - useGlobalMouseEvents가 false일 때 사용)
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
}

/**
 * 수직 드래그 동작을 관리하는 범용 hook
 * - 터치 및 마우스 이벤트 지원
 * - 드래그 시작, 이동, 종료 콜백
 */
export function useVerticalDrag({
  onDragEnd,
  onDragMove,
  useGlobalMouseEvents = true,
}: UseVerticalDragOptions = {}): UseVerticalDragReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [deltaY, setDeltaY] = useState(0);
  const startYRef = useRef(0);

  // 드래그 시작 (공통)
  const startDrag = useCallback((clientY: number) => {
    startYRef.current = clientY;
    setIsDragging(true);
    setDeltaY(0);
  }, []);

  // 드래그 이동 (공통)
  const moveDrag = useCallback(
    (clientY: number) => {
      if (!isDragging) return;
      const newDeltaY = clientY - startYRef.current;
      setDeltaY(newDeltaY);
      onDragMove?.(newDeltaY);
    },
    [isDragging, onDragMove]
  );

  // 드래그 종료 (공통)
  const endDrag = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    onDragEnd?.(deltaY);
    setDeltaY(0);
  }, [isDragging, deltaY, onDragEnd]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      startDrag(e.touches[0].clientY);
    },
    [startDrag]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      moveDrag(e.touches[0].clientY);
    },
    [moveDrag]
  );

  const handleTouchEnd = useCallback(() => {
    endDrag();
  }, [endDrag]);

  // 마우스 이벤트 핸들러 (핸들용)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientY);
    },
    [startDrag]
  );

  // 마우스 이벤트 핸들러 (컨테이너용)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      moveDrag(e.clientY);
    },
    [moveDrag]
  );

  const handleMouseUp = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      endDrag();
    }
  }, [isDragging, endDrag]);

  // 글로벌 마우스 이벤트 (마우스가 컴포넌트 밖으로 나가도 드래그 유지)
  useEffect(() => {
    if (!useGlobalMouseEvents || !isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      moveDrag(e.clientY);
    };

    const handleGlobalMouseUp = () => {
      endDrag();
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [useGlobalMouseEvents, isDragging, moveDrag, endDrag]);

  return {
    isDragging,
    deltaY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
}
