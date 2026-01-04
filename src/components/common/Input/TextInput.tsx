'use client';

import { useState, useEffect, useRef } from 'react';
import DeleteIcon from '@/public/icons/signup/delete.svg';

type InputStatus = 'default' | 'error' | 'success';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  showClearButton?: boolean;
  maxLength?: number;
  disabled?: boolean;
  type?: 'text' | 'email' | 'tel';
  status?: InputStatus;
  message?: string;
}

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  showClearButton = false,
  maxLength,
  disabled = false,
  type = 'text',
  status = 'default',
  message,
}: TextInputProps) {
  // IME 조합 상태 추적 (한글 입력 지원)
  const isComposingRef = useRef(false);
  const [localValue, setLocalValue] = useState(value);

  // 외부 value가 변경되면 로컬 상태 동기화
  useEffect(() => {
    if (!isComposingRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // maxLength 체크
    if (maxLength && newValue.length > maxLength) return;

    setLocalValue(newValue);
    // IME 조합 중이 아닐 때만 부모에게 전달
    if (!isComposingRef.current) {
      onChange(newValue);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    // 조합 완료 시 최종 값 전달
    const finalValue = e.currentTarget.value;
    if (maxLength && finalValue.length > maxLength) {
      const truncated = finalValue.slice(0, maxLength);
      setLocalValue(truncated);
      onChange(truncated);
    } else {
      onChange(finalValue);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

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
      <div className="flex items-center gap-1">
        <span className="text-body-1-medium text-gray-900">{label}</span>
        {required && <span className="text-head-3-semibold text-purple-500">*</span>}
      </div>

      {/* 입력 필드 */}
      <div className="relative">
        <input
          type={type}
          value={localValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          disabled={disabled}
          className={`text-body-2-medium w-full rounded-xl bg-gray-100 px-4 py-[14px] text-gray-900 placeholder:text-gray-600 focus:outline-none focus:placeholder:text-transparent disabled:cursor-not-allowed disabled:text-gray-700 ${
            showClearButton && localValue ? 'pr-10' : ''
          } ${getStatusRingClass()}`}
        />
        {showClearButton && localValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            <DeleteIcon />
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
