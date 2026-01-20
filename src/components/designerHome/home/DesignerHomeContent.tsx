'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BellIcon from '@/public/icons/designer-home/bell.svg';
import MoandiLogo from '@/public/icons/designer-home/moandiLogo.svg';
import ProfilePlaceholderIcon from '@/public/icons/designer-home/profile-placeholder.svg';
import { BottomNav } from '@/src/components/common';
import { DateSelectorBar } from './DateSelectorBar';
import { TodayReservationSection } from './TodayReservationSection';
import { PendingReservationSection } from './PendingReservationSection';
import { QuickActionButtons } from './QuickActionButtons';
import { useTodayReservations, usePendingReservations } from '@/src/hooks/queries/designerHome';
import { useDesignerProfile } from '@/src/hooks/queries/mypage';
import { useUnreadNotificationCount } from '@/src/hooks/queries/notification';

// 오늘 날짜를 yyyy-MM-dd 형식으로 반환
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DesignerHomeContent() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  // 디자이너 프로필 조회
  const { data: profileData } = useDesignerProfile(true);
  const designerName = profileData?.result?.nickname ?? '디자이너';
  const profileImageUrl = profileData?.result?.profileImageUrl ?? null;

  // 예약 데이터 조회
  const { data: todayData, isLoading: isTodayLoading } = useTodayReservations(selectedDate);
  const { data: pendingData, isLoading: isPendingLoading } = usePendingReservations();

  // 읽지 않은 알림 개수 조회
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.result?.unreadCount ?? 0;

  const todayReservations = todayData?.result ?? { date: selectedDate, totalCount: 0, reservations: [] };
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
      <div className="flex min-h-screen flex-col bg-gray-200">
        {/* 헤더 */}
        <header className="flex h-14 items-center justify-between px-5">
          <MoandiLogo />
          <button
            type="button"
            aria-label="알림"
            onClick={() => router.push('/notification')}
            className="relative"
          >
            <BellIcon className="size-6 cursor-pointer" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </header>

        {/* 환영 메시지 + 프로필 이미지 */}
        <div className="flex items-start justify-between px-4 py-2">
          <div>
            <h1 className="text-head-3-semibold text-gray-900">{designerName} 디자이너님</h1>
            <p className="text-head-3-semibold text-gray-900">오늘도 좋은 하루 되세요!</p>
          </div>
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-gray-300">
            {profileImageUrl ? (
              <Image src={profileImageUrl} alt="프로필" fill className="object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-gray-500">
                <ProfilePlaceholderIcon className="size-6" />
              </div>
            )}
          </div>
        </div>

        {/* 날짜 선택 바 */}
        <div className="mt-4">
          <DateSelectorBar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* 오늘의 예약 섹션 */}
        <div className="mt-5">
          <TodayReservationSection data={todayReservations} isLoading={isTodayLoading} />
        </div>

        {/* 하단 영역 - BottomNav(87px)와 16px 간격 유지 */}
        <div className="mt-auto pb-[calc(87px+env(safe-area-inset-bottom)+16px)]">
          {/* 새로운 예약 신청 섹션 */}
          <PendingReservationSection data={pendingReservations} isLoading={isPendingLoading} />

          {/* 퀵 액션 버튼 */}
          <QuickActionButtons />
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </>
  );
}
