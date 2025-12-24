'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();

  const handleClick = () => {
    // TODO: 검색 페이지로 이동 (추후 구현)
    console.log('검색 페이지로 이동');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center gap-2 rounded-xl bg-gray-100 px-4 py-3.5 text-left cursor-pointer"
    >
      <Image src="/icons/common/search.svg" alt="검색" width={18} height={18} />
      <span className="text-body-2-medium text-gray-700">검색하기</span>
    </button>
  );
}

