'use client';

import { useState, useRef, useEffect } from 'react';
import ChevronDownIcon from '@/src/assets/icons/chevron-down.svg';

interface DropdownOption {
  code: string;
  name: string;
}

interface DropdownProps {
  label: string;
  required?: boolean;
  placeholder: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
}

export default function Dropdown({ label, required = false, placeholder, options, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedOption = options.find((opt) => opt.code === value);

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span className="text-body-1-semibold text-gray-900">{label}</span>
        {required && <span className="text-head-3-semibold text-purple-500">*</span>}
      </div>

      {/* 드롭다운 트리거 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-gray-100 px-4 py-[14px]"
        >
          <span className={`text-body-2-medium ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          <ChevronDownIcon className={`size-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* 드롭다운 옵션 목록 */}
        {isOpen && (
          <div className="absolute top-14 z-10 w-full rounded-xl bg-gray-100 px-4 py-3.5 shadow-lg">
            <div className="flex flex-col gap-3">
              {options.map((option) => {
                const isSelected = value === option.code;
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      onChange(option.code);
                      setIsOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between"
                  >
                    <span className={`text-body-2-medium ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                      {option.name}
                    </span>
                    {isSelected && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 12L9.667 16.5L19 7.5"
                          stroke="#2F2E32"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
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
