'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/src/components/common';

export default function ModelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPostDetail = pathname.startsWith('/post/');

  return (
    <>
      {/* 메인 컨텐츠 - post 상세 페이지가 아닐 때만 하단 네비게이션 높이만큼 padding 추가 */}
      <main className={isPostDetail ? '' : 'pb-[60px]'}>{children}</main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </>
  );
}
