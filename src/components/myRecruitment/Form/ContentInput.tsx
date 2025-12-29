'use client';

interface ContentInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  rows?: number;
}

export default function ContentInput({
  label,
  value,
  onChange,
  placeholder = '',
  maxLength = 500,
  required = false,
  rows = 5,
}: ContentInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <div className="flex items-center gap-1">
        <span className="text-body-1-semibold text-gray-900">{label}</span>
        {required && <span className="text-head-3-semibold text-purple-500">*</span>}
      </div>

      {/* 입력 필드 */}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className="text-body-2-medium w-full resize-none rounded-xl bg-gray-100 p-4 text-gray-900 placeholder:text-gray-600 focus:placeholder:text-transparent focus:outline-none"
        />

        {/* 글자수 표시 */}
        <span className="text-body-2-regular absolute right-4 bottom-4 text-gray-600">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
