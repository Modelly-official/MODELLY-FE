'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  ModelReservationItem,
  ReservationListType,
  ReservationInfo,
  ReservationChangeRequest,
  ReservationCancelRequest,
} from '@/src/types';
import {
  ReservationChangeModal,
  ReservationCancelModal,
  ReservationSuccessModal,
} from '@/src/components/reservation';
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

  // 모달 상태 관리
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isUpcoming = tabType === 'UPCOMING';
  const isCompleted = reservation.status === 'RESERVATION_CANCELLED' || tabType === 'COMPLETED';

  // 예약 정보를 모달에 전달할 형식으로 변환
  const reservationInfo: ReservationInfo = {
    reservationId: reservation.reservationId,
    modelUserId: reservation.designerUserId,
    modelName: reservation.designerNickname,
    date: reservation.date,
    startTime: reservation.startTime,
  };

  const handleCardClick = () => {
    router.push(`/post/${reservation.recruitmentId}`);
  };

  const handleChangeClick = () => {
    setIsChangeModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleChangeSubmit = (data: ReservationChangeRequest) => {
    console.log('예약 변경 요청:', data);
    setIsChangeModalOpen(false);
    setSuccessMessage('예약 변경이 요청되었습니다');
    setIsSuccessModalOpen(true);
  };

  const handleCancelSubmit = (data: ReservationCancelRequest) => {
    console.log('예약 취소 요청:', data);
    setIsCancelModalOpen(false);
    setSuccessMessage('예약 취소가 요청되었습니다');
    setIsSuccessModalOpen(true);
  };

  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage('');
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
            onClick={handleChangeClick}
            className="text-body-2-medium flex h-[41px] cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-5 py-2.5 text-gray-900"
          >
            예약 변경
          </button>
          <button
            type="button"
            onClick={handleCancelClick}
            className="text-body-2-medium flex h-[41px] cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-5 py-2.5 text-gray-900"
          >
            예약 취소
          </button>
        </div>
      )}

      {/* 예약 변경 모달 */}
      <ReservationChangeModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        reservation={reservationInfo}
        onSubmit={handleChangeSubmit}
      />

      {/* 예약 취소 모달 */}
      <ReservationCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        reservation={reservationInfo}
        onSubmit={handleCancelSubmit}
      />

      {/* 성공 모달 */}
      <ReservationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
}
