'use client';

import BellIcon from '@/public/icons/designer-home/bell.svg';
import { BottomNav } from '@/src/components/common';
import { TodayReservationSection } from './TodayReservationSection';
import { PendingReservationSection } from './PendingReservationSection';
import { QuickActionButtons } from './QuickActionButtons';
import { mockTodayReservations, mockPendingReservations } from '@/src/mocks/designerHome';

export function DesignerHomeContent() {
  const userName = '유디'; // TODO: useAuthStore에서 가져옴

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-200 pb-[calc(60px+env(safe-area-inset-bottom)+16px)]">
        {/* 헤더 */}
        <header className="flex h-14 items-center justify-between px-5">
          <span className="text-head-1-semibold text-gray-900">Monde</span>
          <button type="button" aria-label="알림">
            <BellIcon className="size-6" />
          </button>
        </header>

        {/* 환영 메시지 */}
        <div className="px-4 py-2">
          <h1 className="text-head-3-semibold text-gray-900">안녕하세요 {userName}님!</h1>
          <p className="text-head-3-semibold text-gray-900">오늘의 예약을 확인해보세요!</p>
        </div>

        {/* 오늘의 예약 섹션 */}
        <div className="mt-4">
          <TodayReservationSection data={mockTodayReservations} />
        </div>

        {/* 새로운 예약 신청 섹션 */}
        <PendingReservationSection data={mockPendingReservations} />

        {/* 퀵 액션 버튼 */}
        <QuickActionButtons />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </>
  );
}
