'use client';

import { useIMEInput } from '@/src/hooks/custom/useIMEInput';

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
  const imeInput = useIMEInput(value, onChange, { maxLength });

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
          value={imeInput.value}
          onChange={imeInput.onChange}
          onCompositionStart={imeInput.onCompositionStart}
          onCompositionEnd={imeInput.onCompositionEnd}
          placeholder={placeholder}
          className="text-body-2-medium w-full rounded-xl bg-gray-100 px-4 py-[14px] pr-16 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:placeholder:text-transparent"
        />

        {/* 글자수 표시 */}
        <span className="text-body-2-regular absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
          {imeInput.value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
