'use client';

import { useState, useEffect, useRef } from 'react';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

export default function TitleInput({
  value,
  onChange,
  maxLength = 20,
  placeholder = '모집글 제목을 입력해 주세요',
}: TitleInputProps) {
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
    if (newValue.length <= maxLength) {
      setLocalValue(newValue);
      // IME 조합 중이 아닐 때만 부모에게 전달
      if (!isComposingRef.current) {
        onChange(newValue);
      }
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    // 조합 완료 시 최종 값 전달 (maxLength 체크)
    const finalValue = e.currentTarget.value;
    if (finalValue.length <= maxLength) {
      onChange(finalValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span className="text-body-1-semibold text-gray-900">모집글 제목</span>
        <span className="text-head-3-semibold text-purple-500">*</span>
      </div>

      {/* 입력 필드 */}
      <div className="relative">
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          className="text-body-2-medium w-full rounded-xl bg-gray-100 px-4 py-[14px] pr-16 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:placeholder:text-transparent"
        />

        {/* 글자수 표시 */}
        <span className="text-body-2-regular absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
          {localValue.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
