'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthReady } from '@/src/hooks/custom/mypage';
import { useModelReservations, useDesignerMyReservations } from '@/src/hooks/queries/reservation';
import { useToast } from '@/src/hooks/common';
import {
  ReservationTabs,
  ReservationList,
} from '@/src/components/mypage/reservations';
import type {
  ReservationListType,
  ModelReservationItem,
  DesignerReservationItem,
} from '@/src/types';

type ReservationItem = ModelReservationItem | DesignerReservationItem;

export default function MyReservationsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { role, isLoggedIn, authReady } = useAuthReady();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<ReservationListType>('UPCOMING');

  // 현재 역할에 따라 API 호출
  const isModel = role === 'model';

  // 모델 예약 목록 조회
  const modelQuery = useModelReservations(activeTab, {
    enabled: authReady && isLoggedIn && isModel,
  });

  // 디자이너 예약 목록 조회
  const designerQuery = useDesignerMyReservations(activeTab, {
    enabled: authReady && isLoggedIn && !isModel,
  });

  // 모델 데이터 가공
  const modelItems = useMemo<ModelReservationItem[]>(() => {
    return modelQuery.data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [modelQuery.data?.pages]);

  // 디자이너 데이터 가공
  const designerItems = useMemo<DesignerReservationItem[]>(() => {
    return designerQuery.data?.pages.flatMap((page) => page.result.items) ?? [];
  }, [designerQuery.data?.pages]);

  // 현재 역할에 따른 아이템 목록
  const items: ReservationItem[] = isModel ? modelItems : designerItems;

  // 현재 역할에 따른 총 개수
  const totalCount = isModel
    ? (modelQuery.data?.pages[0]?.result.totalCount ?? 0)
    : (designerQuery.data?.pages[0]?.result.totalCount ?? 0);

  // 현재 역할에 따른 쿼리 상태
  const hasNextPage = isModel ? modelQuery.hasNextPage : designerQuery.hasNextPage;
  const isFetchingNextPage = isModel ? modelQuery.isFetchingNextPage : designerQuery.isFetchingNextPage;
  const isLoading = isModel ? modelQuery.isLoading : designerQuery.isLoading;
  const fetchNextPage = isModel ? modelQuery.fetchNextPage : designerQuery.fetchNextPage;
  const error = isModel ? modelQuery.error : designerQuery.error;

  // 에러 처리
  useEffect(() => {
    if (error) {
      showToast('예약 목록을 불러오지 못했습니다.');
    }
  }, [error, showToast]);

  // 예약 변경 핸들러
  const handleChangeClick = (reservation: ReservationItem) => {
    // TODO: 예약 변경 모달 연결
    console.log('예약 변경:', reservation);
  };

  // 예약 취소 핸들러
  const handleCancelClick = (reservation: ReservationItem) => {
    // TODO: 예약 취소 모달 연결
    console.log('예약 취소:', reservation);
  };

  // 채팅 보내기 핸들러 (디자이너만)
  const handleChatClick = (reservation: DesignerReservationItem) => {
    // TODO: 채팅 페이지 이동 또는 채팅방 생성
    console.log('채팅 보내기:', reservation);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {/* 헤더 */}
      <header className="flex h-[52px] items-center justify-between bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <Image
            src="/icons/common/arrow-left.svg"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </button>
        <h1 className="text-head-4-medium text-center text-black">예약 목록</h1>
        {/* 균형을 위한 빈 공간 */}
        <div className="size-6" />
      </header>

      {/* 탭 */}
      <ReservationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        {/* 예약 목록 */}
        <ReservationList
          items={items}
          role={role}
          tabType={activeTab}
          totalCount={totalCount}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          onChangeClick={handleChangeClick}
          onCancelClick={handleCancelClick}
          onChatClick={handleChatClick}
        />
      </div>
    </div>
  );
}
