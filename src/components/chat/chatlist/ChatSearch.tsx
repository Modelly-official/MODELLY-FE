'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchIcon from '@/public/icons/chat/search.svg';
import CloseIcon from '@/public/icons/chat/close.svg';

type Props = {
  onSearch?: (keyword: string) => void;
};

export default function ChatSearch({ onSearch }: Props) {
  const [value, setValue] = useState('');

  // debounce 적용 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch?.('');
  }, [onSearch]);

  return (
    <div className="mx-4 mt-2 mb-[5px] flex items-center rounded-xl bg-gray-200 px-4 py-3.5">
      <SearchIcon className="h-[18px] w-[18px] shrink-0 text-gray-700" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="검색하기"
        className="text-body-2-medium w-full bg-transparent pl-2 text-black placeholder-gray-700 outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="ml-2 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-500"
        >
          <CloseIcon className="text-white" />
        </button>
      )}
    </div>
  );
}
