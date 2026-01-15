'use client';

import Image from 'next/image';

interface ReservationTitleProps {
  title: string;
  onClick: () => void;
}

export default function ReservationTitle({ title, onClick }: ReservationTitleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-0.5"
    >
      <p className="text-head-4-semibold text-gray-900">{title}</p>
      <Image
        src="/icons/common/chevron-right.svg"
        alt="상세보기"
        width={20}
        height={20}
        className="text-gray-800"
      />
    </button>
  );
}
