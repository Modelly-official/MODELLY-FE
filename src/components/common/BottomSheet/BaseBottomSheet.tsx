'use client';

import { useEffect, useRef, useId, useState } from 'react';

interface BaseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BaseBottomSheet({
  isOpen,
  onClose,
  children,
  title,
}: BaseBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  // 드래그 상태
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  // onClose ref 업데이트
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // 드래그 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  // 드래그 중
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    // 아래로만 드래그 가능
    if (diff > 0) {
      setDragY(diff);
    }
  };

  // 드래그 종료
  const handleTouchEnd = () => {
    setIsDragging(false);
    // 100px 이상 드래그하면 닫기
    if (dragY > 100) {
      onCloseRef.current();
    }
    setDragY(0);
  };

  // 초기 포커스 + body 스크롤 방지
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;

    const focusableElements = sheetRef.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;

      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // ESC 키 처리 + Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = sheetRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex justify-center" role="presentation">
      {/* 오버레이 - 레이아웃 너비에 맞춤 */}
      <div
        className="flex w-full max-w-[430px] items-end bg-[rgba(28,28,30,0.4)]"
        onClick={onClose}
      >
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className={`w-full rounded-t-[20px] bg-white px-4 pb-6 pt-3 ${isDragging ? '' : 'animate-slide-up'}`}
          style={{ transform: `translateY(${dragY}px)` }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 핸들 바 - 드래그 영역 */}
          <div
            className="mb-3 flex cursor-grab justify-center py-2 active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="h-1.5 w-14 rounded-full bg-gray-400" />
          </div>

          {/* 타이틀 */}
          {title && (
            <h2 id={titleId} className="mb-3 text-center text-head-4-medium text-gray-900">
              {title}
            </h2>
          )}

          {/* 콘텐츠 */}
          {children}
        </div>
      </div>
    </div>
  );
}
