'use client';

import { useRef, useEffect, useState } from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function TextArea({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  // Auto-resize based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height to scrollHeight to fit content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
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
      <textarea
        ref={textareaRef}
        value={localValue}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        rows={1}
        className="text-body-2-medium min-h-[49px] w-full resize-none overflow-hidden rounded-xl bg-gray-100 px-4 py-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:placeholder:text-transparent"
      />
    </div>
  );
}
