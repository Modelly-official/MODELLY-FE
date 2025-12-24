'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import type { SortOption } from '@/src/constants/explore';

interface SortDropdownProps {
  sortOptions: SortOption[];
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

export default function SortDropdown({ sortOptions, selectedSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = sortOptions.find((option) => option.code === selectedSort);

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
        className="flex items-center gap-1 text-body-2-medium text-black cursor-pointer"
      >
        {selectedOption?.name}
        <Image
          src="/icons/common/arrow-down.svg"
          alt="정렬"
          width={16}
          height={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 flex min-w-[116px] flex-col gap-1.5 rounded-xl border border-gray-400 bg-white p-3 shadow-[0px_0px_12px_12px_rgba(56,56,56,0.1)]">
          {sortOptions.map((option) => {
            const isSelected = selectedSort === option.code;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  onSortChange(option.code);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between text-body-2-medium text-left transition-colors hover:text-gray-900"
              >
                <span className={isSelected ? 'text-gray-900' : 'text-gray-600'}>{option.name}</span>
                {isSelected && <Image src="/icons/common/check.svg" alt="선택됨" width={14} height={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

