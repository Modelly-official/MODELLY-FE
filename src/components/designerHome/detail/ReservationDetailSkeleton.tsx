'use client';

import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';

export function ReservationDetailSkeleton() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="h-4 text-black" />
        </button>
        <div className="size-6 opacity-0" />
      </header>
      <div className="flex-1 px-4">
        <div className="flex flex-col gap-4">
          <div className="animate-skeleton h-[120px] rounded-[12px] bg-gray-300" />
          <div className="animate-skeleton h-[80px] rounded-[12px] bg-gray-300" />
          <div className="animate-skeleton h-[100px] rounded-[12px] bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
