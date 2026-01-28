'use client';

import { useState, useRef, useCallback, useId } from 'react';
import ChevronDownIcon from '@/public/icons/common/chevron-down.svg';
import ArrowDownIcon from '@/public/icons/common/arrow-down.svg';
import CheckIcon from '@/public/icons/myRecruitment/form/check.svg';
import CheckIconSmall from '@/public/icons/common/check.svg';
import type { DropdownProps } from './types';

// 외부에서 사용 중인 타입 re-export
export type { DropdownOption } from './types';

// ===== 모듈 레벨 스타일 헬퍼 함수 (컴포넌트 외부) =====

/**
 * 옵션 버튼 className 계산
 */
function getOptionClassName(variant: 'form' | 'inline', isFocused: boolean): string {
  const base = 'flex cursor-pointer items-center justify-between';
  const focus = isFocused ? 'bg-gray-50' : '';

  if (variant === 'form') {
    return `${base} rounded-lg px-1 py-0.5 ${focus}`;
  }
  return `${base} whitespace-nowrap px-1 py-1 text-left text-body-2-medium transition-colors hover:text-gray-900 ${focus}`;
}

/**
 * Form variant 옵션 텍스트 className 계산
 */
function getFormOptionTextClassName(isSelected: boolean, hasValue: boolean): string {
  return `text-body-2-medium ${hasValue ? (isSelected ? 'text-gray-900' : 'text-gray-500') : 'text-gray-900'}`;
}

/**
 * Inline variant 옵션 텍스트 className 계산
 */
function getInlineOptionTextClassName(isSelected: boolean): string {
  return isSelected ? 'text-gray-900' : 'text-gray-600';
}

// ===== 컴포넌트 =====

export default function Dropdown<T = string>({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  label,
  required = false,
  disabled = false,
  variant = 'form',
  size = 'sm',
  scrollToSelected = false,
  maxHeight,
  ariaLabel,
  buttonClassName,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  // 드롭다운 열기 핸들러
  const handleOpen = useCallback(() => {
    if (disabled) return;

    setIsOpen(true);
    const selectedIndex = options.findIndex((opt) => opt.value === value);
    // 선택된 값이 없으면 focusedIndex를 -1로 유지 (첫 번째 옵션 자동 포커스 방지)
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : -1);

    // 선택된 항목으로 스크롤
    if (scrollToSelected) {
      requestAnimationFrame(() => {
        if (selectedOptionRef.current && listRef.current) {
          const listRect = listRef.current.getBoundingClientRect();
          const optionRect = selectedOptionRef.current.getBoundingClientRect();
          const scrollTop =
            optionRect.top -
            listRect.top +
            listRef.current.scrollTop -
            listRect.height / 2 +
            optionRect.height / 2;
          listRef.current.scrollTop = scrollTop;
        }
      });
    }
  }, [disabled, options, value, scrollToSelected]);

  // 드롭다운 닫기 핸들러
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  // 드롭다운 토글 핸들러
  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleClose, handleOpen]);

  // 키보드 내비게이션 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            handleOpen();
          } else {
            setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            onChange(options[focusedIndex].value);
            handleClose();
            buttonRef.current?.focus();
          } else {
            handleToggle();
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          buttonRef.current?.focus();
          break;
        case 'Tab':
          if (isOpen) {
            handleClose();
          }
          break;
      }
    },
    [isOpen, focusedIndex, options, onChange, disabled, handleOpen, handleClose, handleToggle],
  );

  // 옵션 선택 핸들러
  const handleSelect = useCallback(
    (optionValue: T) => {
      onChange(optionValue);
      handleClose();
      buttonRef.current?.focus();
    },
    [onChange, handleClose],
  );

  const selectedOption = options.find((opt) => opt.value === value);

  // Form variant
  if (variant === 'form') {
    return (
      <div className="flex flex-col gap-2">
        {/* 라벨 */}
        {label && (
          <div className="flex items-center gap-1">
            <span id={`${listboxId}-label`} className="text-body-1-medium text-gray-900">
              {label}
            </span>
            {required && <span className="text-head-3-semibold text-purple-500">*</span>}
          </div>
        )}

        {/* 드롭다운 트리거 */}
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? `${listboxId}-label` : undefined}
            aria-label={ariaLabel || (!label ? placeholder : undefined)}
            aria-controls={isOpen ? listboxId : undefined}
            disabled={disabled}
            className={
              buttonClassName ||
              `flex w-full items-center justify-between rounded-xl bg-gray-100 px-4 py-3.5 ${
                disabled ? 'cursor-not-allowed text-gray-700' : 'cursor-pointer'
              }`
            }
          >
            <span className={`text-body-2-medium !text-[16px] ${selectedOption ? 'text-gray-900' : 'text-gray-600'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 드롭다운 옵션 목록 */}
          {isOpen && !disabled && (
            <>
              {/* Overlay for outside click */}
              <div className="fixed inset-0 z-50" onClick={handleClose} aria-hidden="true" />
              <div
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={label ? `${listboxId}-label` : undefined}
                aria-label={ariaLabel || (!label ? placeholder : undefined)}
                aria-activedescendant={focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
                className={`absolute top-14 z-60 w-full rounded-xl border border-solid border-gray-400 bg-white px-4 py-3.5 shadow-dropdown ${
                  maxHeight ? 'overflow-y-auto scrollbar-hide' : ''
                }`}
                style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
              >
                <div className="flex flex-col gap-3">
                  {options.map((option, index) => {
                    const isSelected = value === option.value;
                    const isFocused = focusedIndex === index;
                    return (
                      <button
                        key={String(option.value)}
                        ref={isSelected ? selectedOptionRef : null}
                        id={`${listboxId}-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(option.value)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        className={getOptionClassName('form', isFocused)}
                      >
                        <span className={getFormOptionTextClassName(isSelected, !!value)}>{option.label}</span>
                        {isSelected && <CheckIcon />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Inline variant
  const sizeClasses = size === 'lg' ? 'text-head-1-medium tracking-[-0.96px]' : 'text-body-2-medium';

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || label || placeholder}
        aria-controls={isOpen ? listboxId : undefined}
        disabled={disabled}
        className={
          buttonClassName ||
          `flex cursor-pointer items-center gap-1 text-gray-900 ${sizeClasses} ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          }`
        }
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ArrowDownIcon className={`size-5 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <>
          {/* Overlay for outside click */}
          <div className="fixed inset-0 z-50" onClick={handleClose} aria-hidden="true" />
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel || label || placeholder}
            aria-activedescendant={focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
            className={`absolute top-full right-0 z-60 mt-0.5 flex min-w-[100px] flex-col gap-1.5 overflow-hidden rounded-xl border border-gray-400 bg-white p-3 shadow-dropdown ${
              maxHeight ? 'overflow-y-auto scrollbar-hide' : ''
            }`}
            style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
          >
            {options.map((option, index) => {
              const isSelected = value === option.value;
              const isFocused = focusedIndex === index;
              return (
                <button
                  key={String(option.value)}
                  ref={isSelected ? selectedOptionRef : null}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={getOptionClassName('inline', isFocused)}
                >
                  <span className={getInlineOptionTextClassName(isSelected)}>{option.label}</span>
                  {isSelected && <CheckIconSmall className="size-3.5 text-gray-900" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
