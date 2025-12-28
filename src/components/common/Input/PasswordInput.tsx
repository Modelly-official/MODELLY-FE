'use client';

import { useState } from 'react';
import ShowIcon from '@/public/icons/signup/show.svg';
import HideIcon from '@/public/icons/signup/hide.svg';

type InputStatus = 'default' | 'error' | 'success';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  status?: InputStatus;
  message?: string;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = '비밀번호를 입력해주세요',
  maxLength = 20,
  disabled = false,
  status = 'default',
  message,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // 상태별 ring 스타일
  const getStatusRingClass = () => {
    if (status === 'error') return 'ring-1 ring-error';
    if (status === 'success') return 'ring-1 ring-purple-500';
    return '';
  };

  // 상태별 메시지 색상
  const getMessageColorClass = () => {
    if (status === 'error') return 'text-error';
    if (status === 'success') return 'text-purple-700';
    return 'text-gray-600';
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <span className="text-body-1-semibold text-gray-900">{label}</span>

      {/* 입력 필드 */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`text-body-2-medium w-full rounded-xl bg-gray-100 px-4 py-[14px] pr-12 text-gray-900 placeholder:text-gray-600 focus:placeholder:text-transparent focus:outline-none disabled:text-gray-700 disabled:cursor-not-allowed ${getStatusRingClass()}`}
        />
        {value && !disabled && (
          <button
            type="button"
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ShowIcon /> : <HideIcon />}
          </button>
        )}
      </div>

      {/* 하단 메시지 */}
      {message && (
        <div className="px-[6px]">
          <p className={`text-caption-1-medium ${getMessageColorClass()}`}>{message}</p>
        </div>
      )}
    </div>
  );
}
