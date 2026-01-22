'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/src/components/common/BottomNav';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 채팅방 상세: /chat/[roomId] (모든 roomId 형식 지원)
  const isChatRoom = pathname.startsWith('/chat/') && pathname !== '/chat';

  const hideBottomNav =
    pathname.startsWith('/mypage/likes') ||
    pathname.startsWith('/mypage/reservations') ||
    pathname.startsWith('/mypage/reviews') ||
    pathname.startsWith('/mypage/notification-settings') ||
    pathname.startsWith('/mypage/profile') ||
    pathname.startsWith('/notification') ||
    isChatRoom;

  // chat/[roomId]는 h-screen 레이아웃이므로 safe-area 제외 (페이지 내부에서 처리)
  const excludeSafeArea = isChatRoom;

  const mainClassName = excludeSafeArea
    ? ''
    : hideBottomNav
      ? 'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'
      : 'pt-[env(safe-area-inset-top)] pb-[calc(76px+env(safe-area-inset-bottom))]';

  return (
    <>
      <main className={mainClassName}>{children}</main>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
