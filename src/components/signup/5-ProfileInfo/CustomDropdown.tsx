"use client";

import { useState, useRef, useEffect } from "react";
import DropdownArrowIcon from "@/public/icons/signup/dropdown-arrow.svg";
import DropdownSelectedIcon from "@/public/icons/signup/dropdown-selected.svg";

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  label?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-gray-900 text-body-1-medium">{label}</label>}
      <div className="relative" ref={dropdownRef}>
        {/* 드롭다운 버튼 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full border border-gray-400 rounded-xl px-4 py-3 text-body-2-medium text-left focus:outline-none appearance-none bg-white cursor-pointer flex items-center justify-between ${
            value ? "text-gray-900" : "text-gray-600"
          }`}
        >
          <span>{selectedLabel}</span>
          <div className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
            <DropdownArrowIcon />
          </div>
        </button>

        {/* 드롭다운 메뉴 */}
        {isOpen && (
          <div className="absolute z-10 w-full py-3.5 bg-white border border-gray-300 rounded-xl overflow-hidden">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-0 text-left text-body-2-medium cursor-pointer flex items-center justify-between ${
                  value === "" ? "text-gray-900" : value === option.value ? "text-gray-900" : "text-gray-600"
                } ${index > 0 ? "mt-3" : ""}`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <DropdownSelectedIcon />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
