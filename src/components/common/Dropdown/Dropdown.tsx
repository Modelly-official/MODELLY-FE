'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import ChevronDownIcon from '@/public/icons/common/chevron-down.svg';
import ArrowDownIcon from '@/public/icons/common/arrow-down.svg';
import CheckIcon from '@/public/icons/myRecruitment/form/check.svg';
import CheckIconSmall from '@/public/icons/common/check.svg';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
}

interface DropdownProps<T = string> {
  // 필수 Props
  options: DropdownOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;

  // 라벨 관련
  label?: string;
  required?: boolean;
  disabled?: boolean;

  // 확장 기능
  variant?: 'form' | 'inline';
  size?: 'sm' | 'lg';
  scrollToSelected?: boolean;
  maxHeight?: number;

  // 접근성
  ariaLabel?: string;

  // 스타일 오버라이드
  buttonClassName?: string;
}

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  // inline 모드에서 label 없을 때 ariaLabel 경고
  useEffect(() => {
    if (variant === 'inline' && !label && !ariaLabel && process.env.NODE_ENV === 'development') {
      console.warn('Dropdown: inline 모드에서는 ariaLabel이 필요합니다.');
    }
  }, [variant, label, ariaLabel]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 드롭다운 열릴 때 포커스 인덱스 초기화 및 스크롤
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);

      // 선택된 항목으로 스크롤
      if (scrollToSelected && selectedOptionRef.current && listRef.current) {
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
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, options, value, scrollToSelected]);

  // 키보드 내비게이션 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
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
            setIsOpen(false);
            buttonRef.current?.focus();
          } else {
            setIsOpen(!isOpen);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'Tab':
          if (isOpen) {
            setIsOpen(false);
          }
          break;
      }
    },
    [isOpen, focusedIndex, options, onChange, disabled],
  );

  const selectedOption = options.find((opt) => opt.value === value);

  // Form variant 스타일
  if (variant === 'form') {
    return (
      <div className="flex flex-col gap-2" ref={dropdownRef}>
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
            onClick={() => !disabled && setIsOpen(!isOpen)}
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
            <span className={`text-body-2-medium ${selectedOption ? 'text-gray-900' : 'text-gray-600'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 드롭다운 옵션 목록 */}
          {isOpen && !disabled && (
            <div
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={label ? `${listboxId}-label` : undefined}
              aria-label={ariaLabel || (!label ? placeholder : undefined)}
              aria-activedescendant={focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
              className={`absolute top-14 z-10 w-full rounded-xl border border-solid border-gray-400 bg-white px-4 py-3.5 shadow-dropdown ${
                maxHeight ? `max-h-[${maxHeight}px] overflow-y-auto scrollbar-hide` : ''
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
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        buttonRef.current?.focus();
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-1 py-0.5 ${
                        isFocused ? 'bg-gray-50' : ''
                      }`}
                    >
                      <span
                        className={`text-body-2-medium ${
                          value ? (isSelected ? 'text-gray-900' : 'text-gray-500') : 'text-gray-900'
                        }`}
                      >
                        {option.label}
                      </span>
                      {isSelected && <CheckIcon />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline variant 스타일
  const sizeClasses = size === 'lg' ? 'text-head-1-semibold' : 'text-body-2-medium';

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
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
        <ArrowDownIcon
          className={`size-5 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel || label || placeholder}
          aria-activedescendant={focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
          className={`absolute top-full right-0 z-10 mt-0.5 flex min-w-[100px] flex-col gap-1.5 overflow-hidden rounded-xl border border-gray-400 bg-white p-3 shadow-dropdown ${
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
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  buttonRef.current?.focus();
                }}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`flex cursor-pointer items-center justify-between whitespace-nowrap px-1 py-1 text-left text-body-2-medium transition-colors hover:text-gray-900 ${
                  isFocused ? 'bg-gray-50' : ''
                }`}
              >
                <span className={isSelected ? 'text-gray-900' : 'text-gray-600'}>{option.label}</span>
                {isSelected && <CheckIconSmall className="size-3.5 text-gray-900" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
