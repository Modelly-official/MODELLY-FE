'use client';

import { useState, useRef, useEffect } from 'react';
import ArrowDownIcon from '@/public/icons/common/arrow-down.svg';
import CheckIcon from '@/public/icons/common/check.svg';

interface YearDropdownProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function YearDropdown({
  years,
  selectedYear,
  onYearChange,
}: YearDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-head-1-semibold flex cursor-pointer items-center gap-1 text-gray-900"
      >
        {selectedYear}
        <ArrowDownIcon
          className={`size-5 text-gray-900 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-1 flex min-w-[100px] flex-col gap-1 overflow-hidden rounded-xl border border-gray-400 bg-white p-3 shadow-lg">
          {years.map((year) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => {
                  onYearChange(year);
                  setIsOpen(false);
                }}
                className="text-body-2-medium flex cursor-pointer items-center justify-between whitespace-nowrap px-1 py-1 text-left transition-colors hover:text-gray-900"
              >
                <span className={isSelected ? 'text-gray-900' : 'text-gray-600'}>
                  {year}
                </span>
                {isSelected && <CheckIcon className="size-3.5 text-gray-900" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
