'use client';

import { useRouter } from 'next/navigation';
import type { ModelReservationItem, ReservationListType, ReservationInfo } from '@/src/types';
import {
  ReservationChangeModal,
  ReservationCancelModal,
  ReservationSuccessModal,
} from '@/src/components/reservation';
import { useReservationActions } from '@/src/hooks/custom/mypage/reservations';
import { CategoryBadges, ReservationInfo as ReservationInfoComponent, ReservationTitle } from './common';

interface ModelReservationCardProps {
  reservation: ModelReservationItem;
  tabType: ReservationListType;
}

export default function ModelReservationCard({
  reservation,
  tabType,
}: ModelReservationCardProps) {
  const router = useRouter();

  const {
    modalState,
    openChangeModal,
    openCancelModal,
    closeChangeModal,
    closeCancelModal,
    closeSuccessModal,
    handleChangeSubmit,
    handleCancelSubmit,
    isChangeLoading,
    isCancelLoading,
  } = useReservationActions({
    reservationId: reservation.reservationId,
    targetUserId: reservation.designerUserId,
  });

  const isUpcoming = tabType === 'UPCOMING';
  const isCompleted = reservation.status === 'RESERVATION_CANCELLED' || tabType === 'COMPLETED';

  // 예약 정보를 모달에 전달할 형식으로 변환
  const reservationInfo: ReservationInfo = {
    reservationId: reservation.reservationId,
    recruitmentId: reservation.recruitmentId,
    modelUserId: reservation.designerUserId,
    modelName: reservation.designerNickname,
    date: reservation.date,
    startTime: reservation.startTime,
  };

  const handleCardClick = () => {
    router.push(`/post/${reservation.recruitmentId}`);
  };

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white px-5 py-4">
      <div className="flex flex-col gap-2">
        {/* 카테고리 뱃지 */}
        <CategoryBadges
          category={reservation.category}
          subCategories={reservation.subCategories}
          statusBadge={isCompleted ? 'completed' : null}
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

      {/* 액션 버튼 (다가오는 일정만) */}
      {isUpcoming && !isCompleted && (
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            onClick={handleCardClick}
            className="text-body-2-medium flex h-[41px] cursor-pointer items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 text-white"
          >
            프로필 보기
          </button>
          <button
            type="button"
            onClick={openChangeModal}
            className="text-body-2-medium flex h-[41px] cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-5 py-2.5 text-gray-900"
          >
            예약 변경
          </button>
          <button
            type="button"
            onClick={openCancelModal}
            className="text-body-2-medium flex h-[41px] cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-5 py-2.5 text-gray-900"
          >
            예약 취소
          </button>
        </div>
      )}

      {/* 예약 변경 모달 */}
      <ReservationChangeModal
        isOpen={modalState.isChangeOpen}
        onClose={closeChangeModal}
        reservation={reservationInfo}
        onSubmit={handleChangeSubmit}
        isLoading={isChangeLoading}
      />

      {/* 예약 취소 모달 */}
      <ReservationCancelModal
        isOpen={modalState.isCancelOpen}
        onClose={closeCancelModal}
        reservation={reservationInfo}
        onSubmit={handleCancelSubmit}
        isLoading={isCancelLoading}
      />

      {/* 성공 모달 */}
      <ReservationSuccessModal
        isOpen={modalState.isSuccessOpen}
        onClose={closeSuccessModal}
        message={modalState.successMessage}
        onConfirm={closeSuccessModal}
      />
    </div>
  );
}
