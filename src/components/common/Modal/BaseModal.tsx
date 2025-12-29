'use client';

import { useEffect, useRef, useId } from 'react';
import CloseIcon from '@/public/icons/common/close.svg';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  disableClose?: boolean;
  title?: string;
  showCloseButton?: boolean;
}

export default function BaseModal({
  isOpen,
  onClose,
  children,
  disableClose = false,
  title,
  showCloseButton = true,
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const titleId = useId();

  // ESC 키 처리 + Focus trap + 초기 포커스
  useEffect(() => {
    if (!isOpen) return;

    // 현재 포커스된 요소 저장
    previousActiveElement.current = document.activeElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC 키로 모달 닫기
      if (e.key === 'Escape' && !disableClose) {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
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

    // 모달 내 첫 번째 포커스 가능한 요소에 포커스
    const focusableElements = modalRef.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    // body 스크롤 방지
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      // 모달 닫힐 때 이전 포커스 복원
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, disableClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (!disableClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,28,30,0.4)]"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="relative w-[311px] rounded-[20px] bg-white px-5 pt-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 영역 */}
        {(showCloseButton || title) && (
          <div className={`flex ${title ? 'justify-between' : 'justify-end'} pb-1`}>
            {title && (
              <h2 id={titleId} className="text-body-1-medium tracking-tight text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={disableClose}
                aria-label="모달 닫기"
                className="cursor-pointer p-1 disabled:cursor-not-allowed"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* 콘텐츠 */}
        {children}
      </div>
    </div>
  );
}
