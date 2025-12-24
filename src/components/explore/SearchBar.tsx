'use client';

import Image from 'next/image';

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
}

export default function SearchBar({ value = '', onChange, onSearch }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-gray-100 px-4 py-3.5">
      <Image src="/icons/common/search.svg" alt="검색" width={18} height={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="검색하기"
        className="text-body-2-medium flex-1 bg-transparent text-gray-900 placeholder:text-gray-700 outline-none"
      />
    </div>
  );
}

