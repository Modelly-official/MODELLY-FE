'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ModelReservationItem, ReservationInfo, ReservationCancelRequest } from '@/src/types';
import {
  ReservationCancelModal,
  ReservationSuccessModal,
} from '@/src/components/reservation';
import { CategoryBadges, ReservationInfo as ReservationInfoComponent, ReservationTitle } from './common';

interface PendingReservationCardProps {
  reservation: ModelReservationItem;
}

export default function PendingReservationCard({
  reservation,
}: PendingReservationCardProps) {
  const router = useRouter();

  // 모달 상태 관리
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleProfileClick = () => {
    router.push(`/designer/${reservation.designerId}`);
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleCancelSubmit = (data: ReservationCancelRequest) => {
    console.log('신청 취소 요청:', data);
    setIsCancelModalOpen(false);
    setSuccessMessage('신청이 취소되었습니다');
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
          className="text-body-2-medium flex h-[41px] flex-1 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white px-5 py-2.5 text-gray-900"
        >
          신청 취소
        </button>
      </div>

      {/* 신청 취소 모달 */}
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
