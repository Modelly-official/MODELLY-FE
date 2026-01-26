'use client';

import { useState, useMemo, useEffect, useSyncExternalStore, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import { getAccessToken, getUserRole } from '@/src/stores';
import { useModelReservations, useDesignerMyReservations } from '@/src/hooks/queries/reservation';
import { useToast } from '@/src/hooks/common';
import { ReservationTabs, CategoryChips, ReservationList } from '@/src/components/mypage/reservations';
import Dropdown from '@/src/components/common/Dropdown/Dropdown';
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

  // 탭 상태 (디자이너는 UPCOMING이 기본, 모델은 PENDING이 기본)
  const [activeTab, setActiveTab] = useState<ReservationListType>('UPCOMING');
  const [isTabInitialized, setIsTabInitialized] = useState(false);

  // 클라이언트에서 role 확인 후 초기 탭 설정 (동기적 실행으로 깜빡임 방지)
  // hydration 후 한 번만 실행되는 초기화 로직
  useLayoutEffect(() => {
    if (!isTabInitialized && role === 'model') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('PENDING');
    }
    setIsTabInitialized(true);
  }, [role, isTabInitialized]);

  // 카테고리 필터 상태 (탭별로 독립적)
  const [selectedCategoryByTab, setSelectedCategoryByTab] = useState<
    Record<ReservationListType, ReservationCategoryFilter>
  >({
    PENDING: 'ALL',
    UPCOMING: 'ALL',
    COMPLETED: 'ALL',
  });

  // 카테고리 변경 핸들러 (현재 탭의 카테고리만 변경)
  const handleCategoryChange = (category: ReservationCategoryFilter) => {
    setSelectedCategoryByTab((prev) => ({
      ...prev,
      [activeTab]: category,
    }));
  };

  // 현재 탭의 카테고리
  const currentCategory = selectedCategoryByTab[activeTab];

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
  // PENDING, UPCOMING 탭에서는 month를 보내지 않음 (날짜 분류 없음)
  const modelFilterParams = {
    category: currentCategory !== 'ALL' ? currentCategory : undefined,
    month: activeTab === 'COMPLETED' ? selectedMonth : undefined,
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
          onClick={() => router.push('/mypage')}
          className="flex size-6 cursor-pointer items-center justify-center"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-head-4-medium text-center text-black">예약 목록</h1>
        {/* 균형을 위한 빈 공간 */}
        <div className="size-6" />
      </header>

      {/* 탭 */}
      <ReservationTabs activeTab={activeTab} onTabChange={setActiveTab} role={role} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* 카테고리 필터 (모델만) */}
        {isModel && (
          <CategoryChips
            selectedCategory={currentCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}

        {/* 월 선택 및 전체 개수 (모델: 완료 탭만, 디자이너: 모든 탭) */}
        {(activeTab === 'COMPLETED' || !isModel) && (
          <div className="flex items-center justify-between">
            <Dropdown
              variant="inline"
              size="lg"
              scrollToSelected
              maxHeight={200}
              ariaLabel="월 선택"
              options={monthOptions.map((opt) => ({ value: opt.code, label: opt.name }))}
              value={selectedMonth}
              onChange={setSelectedMonth}
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
