'use client';

import DeleteIcon from '@/public/icons/signup/delete.svg';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength?: number;
  showClearButton?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  showClearButton = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-1-medium text-gray-900">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="text-body-2-medium w-full rounded-xl border border-gray-400 px-4 py-3 pr-10 text-gray-900 placeholder:text-gray-600 focus:outline-none"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
        />
        {showClearButton && value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            <DeleteIcon />
          </button>
        )}
      </div>
    </div>
  );
};
