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

  // TODO: 삭제 필요 - 디자이너 확인용 Mock 데이터 (API 연동 후 제거)
  const mockTodayReservations = {
    date: selectedDate,
    totalCount: 7,
    reservations: [
      { reservationId: 101, modelName: '김서연', recruitmentId: 2, time: '09:00', imageUrl: null, subCategories: ['커트'] },
      { reservationId: 102, modelName: '박민정', recruitmentId: 3, time: '10:30', imageUrl: null, subCategories: ['펌'] },
      { reservationId: 103, modelName: '이하늘', recruitmentId: 4, time: '12:00', imageUrl: null, subCategories: ['염색'] },
      { reservationId: 104, modelName: '최예진', recruitmentId: 5, time: '14:00', imageUrl: null, subCategories: ['커트', '펌'] },
      { reservationId: 105, modelName: '정수아', recruitmentId: 6, time: '15:30', imageUrl: null, subCategories: ['염색'] },
      { reservationId: 106, modelName: '한지민', recruitmentId: 7, time: '17:00', imageUrl: null, subCategories: ['커트'] },
      { reservationId: 107, modelName: '송혜교', recruitmentId: 8, time: '18:30', imageUrl: null, subCategories: ['펌', '염색'] },
    ],
  };

  const mockPendingReservations = {
    reservations: [
      { reservationId: 999, modelName: '김민지', recruitmentTitle: '테스트', date: '2025-02-01', time: '14:00', subCategories: ['커트'] },
      { reservationId: 998, modelName: '이수진', recruitmentTitle: '테스트', date: '2025-02-02', time: '10:30', subCategories: ['펌'] },
      { reservationId: 997, modelName: '박지연', recruitmentTitle: '테스트', date: '2025-02-03', time: '15:00', subCategories: ['염색'] },
      { reservationId: 996, modelName: '최유나', recruitmentTitle: '테스트', date: '2025-02-04', time: '11:00', subCategories: ['커트'] },
      { reservationId: 995, modelName: '정하은', recruitmentTitle: '테스트', date: '2025-02-05', time: '16:30', subCategories: ['펌'] },
      { reservationId: 994, modelName: '한소희', recruitmentTitle: '테스트', date: '2025-02-06', time: '09:00', subCategories: ['염색'] },
    ],
    totalCount: 6,
    cursorId: null,
    cursorDate: null,
    cursorTime: null,
    hasNext: false,
  };

  // TODO: 삭제 필요 - API 연동 후 아래 주석 해제
  const todayReservations = mockTodayReservations; // todayData?.result ?? { date: selectedDate, totalCount: 0, reservations: [] };
  const pendingReservations = mockPendingReservations; // pendingData?.result ?? {...};

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-200">
      {/* 상단 고정 영역 */}
      <div className="shrink-0">
        {/* 헤더 */}
        <header className="flex h-14 items-center justify-between px-5">
          <MoandiLogo />
          <button type="button" aria-label="알림" onClick={() => router.push('/notification')} className="relative">
            <BellIcon className="size-6 cursor-pointer" />
            {unreadCount > 0 && (
              <span className="text-caption-1-medium absolute -top-3 -right-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-500 px-1 text-white">
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
      </div>

      {/* 오늘의 예약 섹션 - 내부 스크롤 */}
      <div className="mt-5 min-h-0 flex-1">
        <TodayReservationSection data={todayReservations} isLoading={isTodayLoading} />
      </div>

      {/* 하단 고정 영역 */}
      <div className="shrink-0 pb-[calc(87px+env(safe-area-inset-bottom)+16px)]">
        <PendingReservationSection data={pendingReservations} isLoading={isPendingLoading} />
        <QuickActionButtons />
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}
