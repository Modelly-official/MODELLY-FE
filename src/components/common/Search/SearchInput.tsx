'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import CloseIcon from '@/public/icons/chat/close.svg';

interface SearchInputProps {
  placeholder?: string;
  showClearButton?: boolean;
  // Controlled mode
  value?: string;
  onChange?: (value: string) => void;
  // Search callback
  onSearch?: (value: string) => void;
  // Options
  debounceMs?: number; // 0이면 debounce 없음
  searchOnEnter?: boolean; // true면 Enter 키로만 검색
}

export default function SearchInput({
  placeholder = '검색하기',
  showClearButton = true,
  value: controlledValue,
  onChange,
  onSearch,
  debounceMs = 0,
  searchOnEnter = false,
}: SearchInputProps) {
  // Controlled/Uncontrolled 모드 지원
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const currentValue = isControlled ? controlledValue : internalValue;

  // Debounce 처리
  useEffect(() => {
    if (searchOnEnter || debounceMs === 0 || !onSearch) return;

    const timer = setTimeout(() => {
      onSearch(currentValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [currentValue, debounceMs, onSearch, searchOnEnter]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (isControlled) {
        onChange?.(newValue);
      } else {
        setInternalValue(newValue);
      }

      // searchOnEnter가 false이고 debounce가 0이면 즉시 검색
      if (!searchOnEnter && debounceMs === 0 && onSearch) {
        onSearch(newValue);
      }
    },
    [isControlled, onChange, onSearch, searchOnEnter, debounceMs]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(currentValue);
      }
    },
    [currentValue, onSearch]
  );

  const handleClear = useCallback(() => {
    if (isControlled) {
      onChange?.('');
    } else {
      setInternalValue('');
    }
    onSearch?.('');
  }, [isControlled, onChange, onSearch]);

  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-gray-100 px-4 py-3.5">
      <Image src="/icons/common/search.svg" alt="검색" width={18} height={18} />
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? '' : placeholder}
        className="text-body-2-medium flex-1 bg-transparent text-gray-900 placeholder:text-gray-700 outline-none"
      />
      {showClearButton && currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-500"
        >
          <CloseIcon className="text-white" />
        </button>
      )}
    </div>
  );
}
