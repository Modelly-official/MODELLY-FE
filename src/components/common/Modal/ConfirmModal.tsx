'use client';

import { useEffect, useRef, useId } from 'react';
import CloseIcon from '@/public/icons/common/close.svg';

type ConfirmVariant = 'default' | 'danger';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: ConfirmVariant;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = '확인',
  cancelText = '취소',
  isLoading = false,
  variant = 'default',
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // ESC 키 처리 + Focus trap + 초기 포커스
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC 키로 모달 닫기
      if (e.key === 'Escape' && !isLoading) {
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

    // 열릴 때 취소 버튼에 포커스
    cancelButtonRef.current?.focus();

    // body 스크롤 방지
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  // variant에 따른 확인 버튼 스타일
  const getConfirmButtonClass = () => {
    const baseClass =
      'text-body-2-medium h-12 flex-1 cursor-pointer rounded-full tracking-tight disabled:cursor-not-allowed disabled:opacity-50';
    if (variant === 'danger') {
      return `${baseClass} bg-error text-white`;
    }
    return `${baseClass} bg-gray-900 text-white`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(28,28,30,0.4)]"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-[311px] rounded-[20px] bg-white px-5 pt-4 pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X 닫기 버튼 */}
        <div className="flex justify-end pb-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="모달 닫기"
            className="cursor-pointer p-1 disabled:cursor-not-allowed"
          >
            <CloseIcon className="h-3 w-3" />
          </button>
        </div>

        {/* 안내 텍스트 */}
        <div className="mb-6 text-center">
          <p id={titleId} className="text-body-1-medium tracking-tight text-gray-900">
            {message}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          {/* 취소 버튼 */}
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-body-2-medium h-12 flex-1 cursor-pointer rounded-full border border-gray-400 bg-white tracking-tight text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          {/* 확인 버튼 */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={getConfirmButtonClass()}
          >
            {isLoading ? '처리 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
