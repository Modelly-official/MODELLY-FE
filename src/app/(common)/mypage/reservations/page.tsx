'use client';

import { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { getAccessToken, getUserRole } from '@/src/stores';
import { useModelReservations, useDesignerMyReservations } from '@/src/hooks/queries/reservation';
import { useToast } from '@/src/hooks/common';
import { ReservationTabs, CategoryChips, MonthDropdown, ReservationList } from '@/src/components/mypage/reservations';
import { generateMonthOptions } from '@/src/constants';
import type {
  ReservationListType,
  ReservationCategoryFilter,
  ModelReservationItem,
  DesignerReservationItem,
} from '@/src/types';

type ReservationItem = ModelReservationItem | DesignerReservationItem;

// 클라이언트 상태 확인을 위한 외부 스토어
const emptySubscribe = () => () => {};

export default function MyReservationsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // 클라이언트 여부 확인 (hydration-safe)
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // 클라이언트에서만 쿠키 읽기
  const role = isClient ? (getUserRole() ?? 'model') : 'model';
  const isLoggedIn = isClient ? !!getAccessToken() : false;

  // 탭 상태 (대기 중 탭이 기본)
  const [activeTab, setActiveTab] = useState<ReservationListType>('PENDING');

  // 카테고리 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<ReservationCategoryFilter>('ALL');

  // 월 선택 상태 (현재 월로 초기화, yyyy-MM 형식)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = `${currentYear}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // 월 옵션 생성
  const monthOptions = useMemo(() => generateMonthOptions(currentYear), [currentYear]);

  // 현재 역할에 따라 UI 조건부 렌더링
  const isModel = isClient && role === 'model';

  // 모델 필터 파라미터 (카테고리 포함)
  const modelFilterParams = {
    category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
    month: selectedMonth,
  };

  // 디자이너 필터 파라미터 (카테고리 없음)
  const designerFilterParams = {
    month: selectedMonth,
  };

  // 모델 예약 목록 조회 (모델만) - 클라이언트에서 로그인 상태일 때만
  const modelQuery = useModelReservations(activeTab, modelFilterParams, {
    enabled: isClient && isLoggedIn && role === 'model',
  });

  // 디자이너 예약 목록 조회 (디자이너만) - 클라이언트에서 로그인 상태일 때만
  const designerQuery = useDesignerMyReservations(activeTab, designerFilterParams, {
    enabled: isClient && isLoggedIn && role === 'designer',
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {/* 헤더 */}
      <header className="flex items-center justify-between bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="text-black" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">예약 목록</h1>
        {/* 균형을 위한 빈 공간 */}
        <div className="size-6" />
      </header>

      {/* 탭 */}
      <ReservationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* 카테고리 필터 (모델만) */}
        {isModel && (
          <CategoryChips
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}

        {/* 월 선택 및 전체 개수 (대기 중 탭에서는 월 선택 숨김) */}
        {activeTab !== 'PENDING' && (
          <div className="flex items-center justify-between">
            <MonthDropdown
              options={monthOptions}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
            <div className="flex items-center gap-1">
              <span className="text-body-2-medium text-black">전체</span>
              <span className="text-body-2-semibold text-gray-600">{totalCount}</span>
            </div>
          </div>
        )}

        {/* 예약 목록 */}
        <ReservationList
          items={items}
          role={role}
          tabType={activeTab}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
}
