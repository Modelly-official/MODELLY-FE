"use client";

import Link from 'next/link';
import LeftArrowIcon from '@/public/icons/common/left-arrow.svg';
import DropDownArrowIcon from '@/public/icons/common/down-arrow.svg';

type Props = {
  title: string;
  rightLabel?: string;
};

export default function ChatHeader({ title, rightLabel = '예약내역' }: Props) {
  return (
    <header className="h-[51px] relative flex items-center px-4 py-3 mt-11">
      <Link href="/chat" className="absolute left-4 mx-[8.5px] flex items-center justify-center">
        <LeftArrowIcon />
      </Link>

      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-head-4-medium text-gray-950">{title}</div>
      </div>

      <div className="absolute right-4 flex items-center gap-1 text-body-2-medium text-gray-800">
        <span>{rightLabel}</span>
        <DropDownArrowIcon className="w-5 h-5 text-gray-800" />
      </div>
    </header>
  );
}
