'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ModelReservationItem } from '@/src/types';
import { ConfirmModal } from '@/src/components/common/Modal';
import { useCancelReservation } from '@/src/hooks/queries/reservation';
import { useToast } from '@/src/hooks/common/useToast';
import { CategoryBadges, ReservationInfo as ReservationInfoComponent, ReservationTitle } from './common';

interface PendingReservationCardProps {
  reservation: ModelReservationItem;
}

export default function PendingReservationCard({
  reservation,
}: PendingReservationCardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const cancelReservation = useCancelReservation();

  // 모달 상태 관리
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleCardClick = () => {
    router.push(`/post/${reservation.recruitmentId}`);
  };

  const handleProfileClick = () => {
    router.push(`/designer/${reservation.designerId}`);
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    cancelReservation.mutate(
      {
        reservationId: reservation.reservationId,
        payload: { reason: '예약 신청 취소' },
      },
      {
        onSuccess: () => {
          setIsCancelModalOpen(false);
          showToast('예약 신청이 취소되었습니다.');
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white px-5 py-4">
      <div className="flex flex-col gap-2">
        {/* 카테고리 뱃지 */}
        <CategoryBadges
          category={reservation.category}
          subCategories={reservation.subCategories}
          statusBadge="pending"
        />

        <div className="flex flex-col gap-4">
          {/* 공고 제목 */}
          <ReservationTitle
            title={reservation.recruitmentTitle}
            onClick={handleCardClick}
          />

          {/* 예약 정보 */}
          <ReservationInfoComponent
            date={reservation.date}
            startTime={reservation.startTime}
            designerNickname={reservation.designerNickname}
            shop={reservation.shop}
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={handleProfileClick}
          className="text-body-2-medium flex h-[41px] flex-1 cursor-pointer items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-white"
        >
          프로필 보기
        </button>
        <button
          type="button"
          onClick={handleCancelClick}
          disabled={cancelReservation.isPending}
          className={`text-body-2-medium flex h-[41px] flex-1 items-center justify-center rounded-full border border-gray-400 bg-white px-5 py-2.5 text-gray-900 ${
            cancelReservation.isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          {cancelReservation.isPending ? '취소 중...' : '신청 취소'}
        </button>
      </div>

      {/* 신청 취소 확인 모달 */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        message="예약 신청을 취소하시겠습니까?"
        cancelText="아니오"
        confirmText="네"
        isLoading={cancelReservation.isPending}
      />
    </div>
  );
}
