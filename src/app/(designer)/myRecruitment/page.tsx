'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import PlusIcon from '@/public/icons/myRecruitment/plus.svg';
import { CalendarNavigation } from '@/src/components/common/Calendar';
import { MyRecruitmentHeader } from '@/src/components/myRecruitment/Header';
import { RecruitmentList, RecruitmentEmpty, ClosedRecruitmentList } from '@/src/components/myRecruitment/List';
import { RecruitmentTabs, type RecruitmentTabType } from '@/src/components/myRecruitment/Tabs';
import { ConfirmModal } from '@/src/components/common';
import { useDesignerRecruitments, useDeleteRecruitment } from '@/src/hooks/queries/myRecruitment';
import { useMonthNavigation, useDeleteModal } from '@/src/hooks/custom/myRecruitment';

export default function MyRecruitmentPage() {
  const router = useRouter();

  // 탭 상태
  const [activeTab, setActiveTab] = useState<RecruitmentTabType>('active');

  // 월 네비게이션 상태
  const { year, month, monthString, handlePrevMonth, handleNextMonth } = useMonthNavigation();

  // 삭제 모달 상태
  const { isOpen: deleteModalOpen, selectedId: selectedRecruitmentId, openModal, closeModal } = useDeleteModal<number>();

  // API Hooks - 모집중 공고
  const {
    data: activeData,
    isLoading: isActiveLoading,
    fetchNextPage: fetchActiveNextPage,
    hasNextPage: hasActiveNextPage,
    isFetchingNextPage: isFetchingActiveNextPage,
  } = useDesignerRecruitments({
    status: 'OPEN',
    month: monthString,
    enabled: activeTab === 'active',
    retry: 2,
    retryDelay: 4000, // 4초 간격으로 재시도
  });

  // API Hooks - 마감 공고
  // TODO: 백엔드에서 CLOSED일 때 month 파라미터를 optional로 변경 필요
  const {
    data: closedData,
    isLoading: isClosedLoading,
    fetchNextPage: fetchClosedNextPage,
    hasNextPage: hasClosedNextPage,
    isFetchingNextPage: isFetchingClosedNextPage,
  } = useDesignerRecruitments({
    status: 'CLOSED',
    month: monthString, // 임시: 백엔드에서 month 필수로 요구
    enabled: activeTab === 'closed',
    retry: 2,
    retryDelay: 3000, // 3초 간격으로 재시도
  });

  const { mutate: deleteRecruitment, isPending: isDeleting } = useDeleteRecruitment();

  // 모집중 공고 리스트
  const activeRecruitments = useMemo(() => {
    if (!activeData?.pages) return [];
    const allItems = activeData.pages.flatMap((page) => page.result.items);
    const seen = new Set<number>();
    return allItems.filter((item) => {
      if (seen.has(item.recruitmentId)) return false;
      seen.add(item.recruitmentId);
      return true;
    });
  }, [activeData]);

  // 마감 공고 리스트
  const closedRecruitments = useMemo(() => {
    if (!closedData?.pages) return [];
    const allItems = closedData.pages.flatMap((page) => page.result.items);
    const seen = new Set<number>();
    return allItems.filter((item) => {
      if (seen.has(item.recruitmentId)) return false;
      seen.add(item.recruitmentId);
      return true;
    });
  }, [closedData]);

  // totalCount 추출 (첫 페이지에서 가져옴)
  const activeTotalCount = activeData?.pages[0]?.result?.totalCount ?? 0;
  const closedTotalCount = closedData?.pages[0]?.result?.totalCount ?? 0;

  // 카드 클릭 핸들러
  const handleCardClick = (id: number) => {
    router.push(`/myRecruitment/${id}`);
  };

  // 수정 핸들러
  const handleEdit = (id: number) => {
    router.push(`/myRecruitment/${id}/edit`);
  };

  // 삭제 핸들러
  const handleDeleteConfirm = () => {
    if (selectedRecruitmentId) {
      deleteRecruitment(selectedRecruitmentId, {
        onSuccess: closeModal,
      });
    }
  };

  // 새 모집글 생성
  const handleCreateClick = () => {
    router.push('/myRecruitment/create');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <MyRecruitmentHeader />

      {/* 탭 */}
      <RecruitmentTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCount={activeTotalCount}
      />

      {/* 모집중 탭 */}
      {activeTab === 'active' && (
        <>
          {/* 캘린더 헤더 */}
          <CalendarNavigation year={year} month={month} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />

          {/* 공고 리스트 */}
          <div className="mt-4">
            {isActiveLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
              </div>
            ) : activeRecruitments.length > 0 ? (
              <RecruitmentList
                recruitments={activeRecruitments}
                onEdit={handleEdit}
                onDelete={openModal}
                onClick={handleCardClick}
                onLoadMore={fetchActiveNextPage}
                hasMore={hasActiveNextPage}
                isLoadingMore={isFetchingActiveNextPage}
              />
            ) : (
              <RecruitmentEmpty />
            )}
          </div>
        </>
      )}

      {/* 마감 탭 */}
      {activeTab === 'closed' && (
        isClosedLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
          </div>
        ) : (
          <ClosedRecruitmentList
            recruitments={closedRecruitments}
            totalCount={closedTotalCount}
            onClick={handleCardClick}
            onLoadMore={fetchClosedNextPage}
            hasMore={hasClosedNextPage}
            isLoadingMore={isFetchingClosedNextPage}
          />
        )
      )}

      {/* 새 모집글 FAB 버튼 - 모집중 탭에서만 표시 */}
      {activeTab === 'active' && (
        <button
          type="button"
          onClick={handleCreateClick}
          className="animate-fab-float fixed bottom-[calc(107px+env(safe-area-inset-bottom))] left-1/2 z-40 flex cursor-pointer items-center gap-1 rounded-full bg-gray-900 px-[14px] py-3"
        >
          <PlusIcon className="h-3 w-3" />
          <span className="text-body-1-medium text-white">새 모집글</span>
        </button>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        message="모집글을 삭제하시겠습니까?"
        confirmText="삭제"
        isLoading={isDeleting}
      />
    </div>
  );
}
