'use client';

import { useEffect, useRef, useId } from 'react';

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

  // onClose ref 업데이트
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

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
          className="w-full animate-slide-up rounded-t-[20px] bg-white px-4 pb-6 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 핸들 바 */}
          <div className="mb-3 flex justify-center">
            <div className="h-1 w-9 rounded-full bg-gray-300" />
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
