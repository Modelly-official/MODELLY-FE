'use client';

import BellIcon from '@/public/icons/designer-home/bell.svg';
import { BottomNav } from '@/src/components/common';
import { TodayReservationSection } from './TodayReservationSection';
import { PendingReservationSection } from './PendingReservationSection';
import { QuickActionButtons } from './QuickActionButtons';
import { useTodayReservations, usePendingReservations } from '@/src/hooks/queries/designerHome';

// 오늘 날짜를 yyyy-MM-dd 형식으로 반환
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DesignerHomeContent() {
  const userName = '유디'; // TODO: useAuthStore에서 가져옴
  const todayDate = getTodayDate();

  const { data: todayData, isLoading: isTodayLoading } = useTodayReservations(todayDate);
  const { data: pendingData, isLoading: isPendingLoading } = usePendingReservations();

  const todayReservations = todayData?.result ?? { date: todayDate, reservations: [] };
  const pendingReservations = pendingData?.result ?? {
    reservations: [],
    totalCount: 0,
    cursorId: null,
    cursorDate: null,
    cursorTime: null,
    hasNext: false,
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-200 pb-[calc(60px+env(safe-area-inset-bottom)+16px)]">
        {/* 헤더 */}
        <header className="flex h-14 items-center justify-between px-5">
          <span className="text-head-1-semibold text-gray-900">Monde</span>
          <button type="button" aria-label="알림">
            <BellIcon className="size-6 cursor-pointer" />
          </button>
        </header>

        {/* 환영 메시지 */}
        <div className="px-4 py-2">
          <h1 className="text-head-3-semibold text-gray-900">안녕하세요 {userName}님!</h1>
          <p className="text-head-3-semibold text-gray-900">오늘의 예약을 확인해보세요!</p>
        </div>

        {/* 오늘의 예약 섹션 */}
        <div className="mt-4">
          <TodayReservationSection data={todayReservations} isLoading={isTodayLoading} />
        </div>

        {/* 새로운 예약 신청 섹션 */}
        <PendingReservationSection data={pendingReservations} isLoading={isPendingLoading} />

        {/* 퀵 액션 버튼 */}
        <QuickActionButtons />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </>
  );
}
