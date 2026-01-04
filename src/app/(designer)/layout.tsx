'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/src/components/common';

export default function DesignerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 공고 상세/생성/수정 페이지에서는 safe-area 및 하단 padding 제외
  const isDetailOrFormPage =
    pathname.match(/^\/myRecruitment\/\d+/) || pathname === '/myRecruitment/create';

  // 예약 관련 페이지에서는 BottomNav 숨김
  const isReservationPage = pathname.startsWith('/reservations');

  // 메인 컨텐츠 클래스 결정
  const mainClassName =
    isDetailOrFormPage || isReservationPage
      ? '' // 상세/폼/예약: safe-area를 컴포넌트에서 개별 처리
      : 'pt-[env(safe-area-inset-top)] pb-[calc(60px+env(safe-area-inset-bottom))]';

  return (
    <>
      <main className={mainClassName}>{children}</main>
      {!isReservationPage && <BottomNav />}
    </>
  );
}
