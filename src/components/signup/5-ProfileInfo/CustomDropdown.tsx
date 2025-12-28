'use client';

import { useState, useRef, useEffect } from 'react';
import DropdownArrowIcon from '@/public/icons/common/down-arrow.svg';
import DropdownSelectedIcon from '@/public/icons/signup/dropdown-selected.svg';

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  label?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-body-1-medium text-gray-900">{label}</label>}
      <div className="relative" ref={dropdownRef}>
        {/* 드롭다운 버튼 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`text-body-2-medium flex w-full cursor-pointer appearance-none items-center justify-between rounded-xl bg-gray-100 px-4 py-[14px] text-left focus:outline-none ${
            value ? 'text-gray-900' : 'text-gray-600'
          }`}
        >
          <span>{selectedLabel}</span>
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <DropdownArrowIcon className="text-gray-900" />
          </div>
        </button>

        {/* 드롭다운 메뉴 */}
        {isOpen && (
          <div className="absolute z-10 w-full overflow-hidden rounded-xl border border-gray-300 bg-white py-3.5">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`text-body-2-medium flex w-full cursor-pointer items-center justify-between px-4 py-0 text-left ${
                  value === '' ? 'text-gray-900' : value === option.value ? 'text-gray-900' : 'text-gray-600'
                } ${index > 0 ? 'mt-3' : ''}`}
              >
                <span>{option.label}</span>
                {value === option.value && <DropdownSelectedIcon />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
