'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/src/components/common';

export default function DesignerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 공고 상세/생성/수정 페이지에서는 하단 네비게이션 높이 padding 제외
  const isDetailOrFormPage =
    pathname.match(/^\/myRecruitment\/\d+/) || pathname === '/myRecruitment/create';

  return (
    <>
      {/* 메인 컨텐츠 */}
      <main className={isDetailOrFormPage ? '' : 'pb-[calc(60px+env(safe-area-inset-bottom))]'}>{children}</main>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </>
  );
}
