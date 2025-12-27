'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import PlusIcon from '@/public/icons/myRecruitment/plus.svg';
import { CalendarHeader } from '@/src/components/myRecruitment/Calendar';
import { MyRecruitmentHeader } from '@/src/components/myRecruitment/Header';
import { RecruitmentList, RecruitmentEmpty } from '@/src/components/myRecruitment/List';
import { DeleteConfirmModal } from '@/src/components/myRecruitment/Modal';
import { useDesignerRecruitments, useDeleteRecruitment } from '@/src/hooks/queries/myRecruitment';

export default function MyRecruitmentPage() {
  const router = useRouter();

  // 현재 날짜 기준 년/월 상태
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // API 호출용 월 문자열 (YYYY-MM 형식)
  const monthString = useMemo(() => {
    return `${year}-${month.toString().padStart(2, '0')}`;
  }, [year, month]);

  // 삭제 모달 상태
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecruitmentId, setSelectedRecruitmentId] = useState<number | null>(null);

  // API Hooks
  const { data, isLoading } = useDesignerRecruitments({ month: monthString });
  const { mutate: deleteRecruitment, isPending: isDeleting } = useDeleteRecruitment();

  // 모든 페이지의 아이템을 평탄화
  const recruitments = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.result.items);
  }, [data]);

  // 월 네비게이션 핸들러
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // 카드 클릭 핸들러
  const handleCardClick = (id: number) => {
    router.push(`/myRecruitment/${id}`);
  };

  // 수정 핸들러
  const handleEdit = (id: number) => {
    router.push(`/myRecruitment/${id}/edit`);
  };

  // 삭제 핸들러
  const handleDeleteClick = (id: number) => {
    setSelectedRecruitmentId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRecruitmentId) {
      deleteRecruitment(selectedRecruitmentId, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedRecruitmentId(null);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedRecruitmentId(null);
  };

  // 새 모집글 생성
  const handleCreateClick = () => {
    router.push('/myRecruitment/create');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <MyRecruitmentHeader />

      {/* 캘린더 헤더 */}
      <CalendarHeader year={year} month={month} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />

      {/* 공고 리스트 */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
          </div>
        ) : recruitments.length > 0 ? (
          <RecruitmentList
            recruitments={recruitments}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onClick={handleCardClick}
          />
        ) : (
          <RecruitmentEmpty month={month} />
        )}
      </div>

      {/* 새 모집글 FAB 버튼 */}
      <button
        type="button"
        onClick={handleCreateClick}
        className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 cursor-pointer items-center gap-1 rounded-full bg-gray-900 px-[14px] py-3"
      >
        <PlusIcon className="h-5 w-5" />
        <span className="text-body-1-medium text-white">새 모집글</span>
      </button>

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
