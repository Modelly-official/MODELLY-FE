'use client';

import { useRef, useEffect } from 'react';
import { useIMEInput } from '@/src/hooks/custom/useIMEInput';

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
  const imeInput = useIMEInput(value, onChange);

  // Auto-resize based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height to scrollHeight to fit content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [imeInput.value]);

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
        value={imeInput.value}
        onChange={imeInput.onChange}
        onCompositionStart={imeInput.onCompositionStart}
        onCompositionEnd={imeInput.onCompositionEnd}
        placeholder={placeholder}
        rows={1}
        className="text-body-2-medium min-h-[49px] w-full resize-none overflow-hidden rounded-xl bg-gray-100 px-4 py-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:placeholder:text-transparent"
      />
    </div>
  );
}
