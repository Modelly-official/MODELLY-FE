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
        className="text-body-2-medium flex cursor-pointer items-center gap-1 text-black"
      >
        {selectedOption?.name}
        <Image
          src="/icons/common/arrow-down.svg"
          alt="정렬"
          width={10}
          height={10}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-10 mt-2 flex min-w-[116px] flex-col gap-1.5 rounded-xl border border-gray-400 bg-white p-3 shadow-dropdown">
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
                className="text-body-2-medium flex cursor-pointer items-center justify-between text-left transition-colors hover:text-gray-900"
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
