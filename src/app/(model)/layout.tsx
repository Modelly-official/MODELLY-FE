'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/src/components/common';

export default function ModelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPostDetail = pathname.startsWith('/post/');
  const isReservation = pathname.startsWith('/reservation/');
  const isMap = pathname === '/map';

  // BottomNav를 숨겨야 하는 페이지들
  const hideBottomNav = isReservation;

  // 메인 컨텐츠 클래스 결정
  const mainClassName = isPostDetail
    ? '' // post 상세: safe-area 불필요 (이미지 갤러리가 상단까지)
    : isReservation
      ? '' // reservation: BottomNav 없으므로 padding 불필요
      : isMap
        ? '' // map: 전체 화면, BottomSheet가 BottomNav 위에 오버레이
        : 'pt-[env(safe-area-inset-top)] pb-[calc(60px+env(safe-area-inset-bottom))]';

  return (
    <>
      <main className={mainClassName}>{children}</main>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
