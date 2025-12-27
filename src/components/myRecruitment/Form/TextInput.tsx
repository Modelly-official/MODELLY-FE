'use client';

import { useState, useEffect, useRef } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
}: TextInputProps) {
  // IME 조합 상태 추적
  const isComposingRef = useRef(false);
  const [localValue, setLocalValue] = useState(value);

  // 외부 value가 변경되면 로컬 상태 동기화 (IME 조합 처리 필수)
  useEffect(() => {
    if (!isComposingRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
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
    onChange(e.currentTarget.value);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span className="text-body-1-semibold text-gray-900">{label}</span>
        {required && <span className="text-head-3-semibold text-purple-500">*</span>}
      </div>

      {/* 입력 필드 */}
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        className="text-body-2-medium w-full rounded-xl bg-gray-100 px-4 py-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:placeholder:text-transparent"
      />
    </div>
  );
}
