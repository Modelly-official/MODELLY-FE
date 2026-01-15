'use client';

import Link from 'next/link';

export function QuickActionButtons() {
  return (
    <section className="mt-4 flex gap-2 px-4">
      <Link
        href="/mypage"
        className="flex flex-1 items-center justify-center rounded-[12px] bg-white py-3 shadow-[0px_0px_11px_0px_rgba(34,34,34,0.04)]"
      >
        <span className="text-body-2-semibold text-gray-900">프로필 보기</span>
      </Link>
      <Link
        href="/mypage/portfolio"
        className="flex flex-1 items-center justify-center rounded-[12px] bg-white py-3 shadow-[0px_0px_11px_0px_rgba(34,34,34,0.04)]"
      >
        <span className="text-body-2-semibold text-gray-900">포트폴리오 관리</span>
      </Link>
      <Link
        href="/mypage/reviews"
        className="flex flex-1 items-center justify-center rounded-[12px] bg-white py-3 shadow-[0px_0px_11px_0px_rgba(34,34,34,0.04)]"
      >
        <span className="text-body-2-semibold text-gray-900">리뷰 관리</span>
      </Link>
    </section>
  );
}
