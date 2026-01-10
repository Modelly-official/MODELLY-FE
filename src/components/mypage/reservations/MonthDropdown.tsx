'use client';

import { useState, useRef, useEffect } from 'react';
import ArrowDownIcon from '@/public/icons/common/arrow-down.svg';
import CheckIcon from '@/public/icons/common/check.svg';

interface MonthOption {
  code: string;
  name: string;
}

interface MonthDropdownProps {
  options: MonthOption[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export default function MonthDropdown({
  options,
  selectedMonth,
  onMonthChange,
}: MonthDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((option) => option.code === selectedMonth);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 드롭다운 열릴 때 선택된 항목으로 스크롤
  useEffect(() => {
    if (isOpen && selectedOptionRef.current && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const optionRect = selectedOptionRef.current.getBoundingClientRect();
      const scrollTop = optionRect.top - listRect.top + listRef.current.scrollTop - listRect.height / 2 + optionRect.height / 2;
      listRef.current.scrollTop = scrollTop;
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-head-1-semibold flex cursor-pointer items-center gap-2 text-gray-900"
      >
        {selectedOption?.name}
        <ArrowDownIcon
          className={`size-5 text-gray-800 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          className="shadow-dropdown absolute top-full left-0 z-10 mt-0.5 flex max-h-[200px] min-w-[100px] flex-col gap-1.5 overflow-y-auto rounded-xl border border-gray-400 bg-white p-3"
        >
          {options.map((option) => {
            const isSelected = selectedMonth === option.code;
            return (
              <button
                key={option.code}
                ref={isSelected ? selectedOptionRef : null}
                type="button"
                onClick={() => {
                  onMonthChange(option.code);
                  setIsOpen(false);
                }}
                className="text-body-2-medium flex cursor-pointer items-center justify-between whitespace-nowrap text-left transition-colors hover:text-gray-900"
              >
                <span className={isSelected ? 'text-gray-900' : 'text-gray-600'}>
                  {option.name}
                </span>
                {isSelected && (
                  <CheckIcon className="size-3.5 text-gray-900" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
