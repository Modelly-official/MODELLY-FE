'use client';

import Link from 'next/link';

export function QuickActionButtons() {
  return (
    <section className="mt-6 flex gap-2 px-4">
      <Link
        href="/mypage"
        className="rounded-[12px] border border-gray-400 px-4 py-3"
      >
        <span className="text-body-2-medium text-gray-900">프로필 보기</span>
      </Link>
      <Link
        href="/mypage/portfolio"
        className="rounded-[12px] border border-gray-400 px-4 py-3"
      >
        <span className="text-body-2-medium text-gray-900">포트폴리오 관리</span>
      </Link>
      <Link
        href="/mypage/reviews"
        className="flex items-center gap-1 rounded-[12px] border border-gray-400 py-3 pl-4 pr-3"
      >
        <span className="text-body-2-medium text-gray-900">리뷰 관리</span>
        <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[13px] font-medium text-gray-700">
          7
        </span>
      </Link>
    </section>
  );
}
