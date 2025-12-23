'use client';

import { useState } from 'react';
import ShowIcon from '@/public/icons/signup/show.svg';
import HideIcon from '@/public/icons/signup/hide.svg';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error: string | null;
  successMessage?: string;
  errorMessage?: string;
  hintMessage?: string;
  maxLength?: number;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '비밀번호를 입력해주세요',
  error,
  successMessage,
  errorMessage,
  hintMessage,
  maxLength = 20,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col">
      <label className="text-body-1-medium mb-2 text-gray-900">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full border ${error === 'error' ? 'border-error' : 'border-gray-400'} text-body-2-medium rounded-xl px-4 py-[14px] pr-12 text-gray-900 placeholder:text-gray-600 focus:outline-none`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
        />
        {value && (
          <button
            type="button"
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <ShowIcon /> : <HideIcon />}
          </button>
        )}
      </div>
      {error === null && hintMessage && (
        <div className="pt-[6px] px-[6px]">
          <p className="text-caption-1-medium text-gray-600">{hintMessage}</p>
        </div>
      )}
      {error === 'error' && errorMessage && (
        <div className="pt-[6px] px-[6px]">
          <p className="text-caption-1-medium text-error">{errorMessage}</p>
        </div>
      )}
      {error === 'success' && successMessage && (
        <div className="pt-[6px] px-[6px]">
          <p className="text-caption-1-medium text-purple-700">{successMessage}</p>
        </div>
      )}
    </div>
  );
};
