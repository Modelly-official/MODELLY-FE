'use client';

import { useState, useRef, useEffect, useCallback, useId } from 'react';
import ChevronDownIcon from '@/src/assets/icons/chevron-down.svg';
import CheckIcon from '@/public/icons/myRecruitment/form/check.svg';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

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

  // 드롭다운 열릴 때 포커스 인덱스 초기화
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.findIndex((opt) => opt.value === value);
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, options, value]);

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
    [isOpen, focusedIndex, options, onChange, disabled]
  );

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span id={`${listboxId}-label`} className="text-body-1-semibold text-gray-900">
          {label}
        </span>
        {required && <span className="text-head-3-semibold text-purple-500">*</span>}
      </div>

      {/* 드롭다운 트리거 */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${listboxId}-label`}
          aria-controls={isOpen ? listboxId : undefined}
          disabled={disabled}
          className={`flex w-full items-center justify-between rounded-xl bg-gray-100 px-4 py-[14px] ${
            disabled ? 'cursor-not-allowed text-gray-700' : 'cursor-pointer'
          }`}
        >
          <span className={`text-body-2-medium ${selectedOption ? 'text-gray-900' : 'text-gray-600'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* 드롭다운 옵션 목록 */}
        {isOpen && !disabled && (
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={`${listboxId}-label`}
            aria-activedescendant={focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined}
            className="absolute top-14 z-10 w-full rounded-xl border border-solid border-gray-400 bg-white px-4 py-3.5 shadow-lg"
          >
            <div className="flex flex-col gap-3">
              {options.map((option, index) => {
                const isSelected = value === option.value;
                const isFocused = focusedIndex === index;
                return (
                  <button
                    key={option.value}
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
                    <span className={`text-body-2-medium ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
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
