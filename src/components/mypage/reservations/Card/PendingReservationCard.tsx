'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ModelReservationItem, ReservationInfo, ReservationCancelRequest } from '@/src/types';
import { subCategoryCodeToName, categoryCodeToName } from '@/src/utils/myRecruitment';
import { formatDateToKorean, formatTimeToKorean } from '@/src/utils/common';
import {
  ReservationCancelModal,
  ReservationSuccessModal,
} from '@/src/components/reservation';

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

  // 카드 클릭 시 공고 상세로 이동
  const handleCardClick = () => {
    router.push(`/post/${reservation.recruitmentId}`);
  };

  // 프로필 보기 클릭
  const handleProfileClick = () => {
    router.push(`/designer/${reservation.designerId}`);
  };

  // 신청 취소 클릭
  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  // 신청 취소 요청 처리
  const handleCancelSubmit = (data: ReservationCancelRequest) => {
    console.log('신청 취소 요청:', data);
    setIsCancelModalOpen(false);
    setSuccessMessage('신청이 취소되었습니다');
    setIsSuccessModalOpen(true);
  };

  // 성공 모달 확인 버튼 처리
  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage('');
  };

  // 서브카테고리 한글 변환
  const subCategoryLabels = reservation.subCategories.map((code) =>
    subCategoryCodeToName(reservation.category, code)
  );

  // 카테고리 한글 변환
  const categoryLabel = categoryCodeToName(reservation.category as 'HAIR' | 'NAIL' | 'TATTOO' | 'EYELASH') ?? reservation.category;

  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] bg-white px-5 py-4">
      {/* 카테고리 뱃지 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {/* 메인 카테고리 뱃지 */}
          <span className="text-caption-1-medium rounded-lg bg-purple-600 px-2 py-1 text-white">
            {categoryLabel}
          </span>
          {/* 서브카테고리 뱃지 */}
          {subCategoryLabels.map((label) => (
            <span
              key={label}
              className="text-caption-1-medium rounded-lg bg-purple-200 px-2 py-1 text-purple-700"
            >
              {label}
            </span>
          ))}
          {/* 확정 대기중 상태 뱃지 */}
          <span className="text-caption-1-medium rounded-lg border border-gray-400 px-2 py-1 text-gray-800">
            확정 대기중
          </span>
        </div>

        {/* 공고 제목 */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={handleCardClick}
            className="flex cursor-pointer items-center gap-0.5"
          >
            <p className="text-head-4-semibold text-gray-900">{reservation.recruitmentTitle}</p>
            <Image
              src="/icons/common/chevron-right.svg"
              alt="상세보기"
              width={20}
              height={20}
              className="text-gray-800"
            />
          </button>

          {/* 예약 정보 */}
          <div className="flex flex-col gap-1">
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">예약 일시</span>
              <span className="text-gray-900">
                {formatDateToKorean(reservation.date)} {formatTimeToKorean(reservation.startTime)}
              </span>
            </div>
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">디자이너</span>
              <span className="text-gray-900">{reservation.designerNickname}</span>
            </div>
            <div className="text-body-2-medium flex items-center gap-4">
              <span className="w-[51px] text-gray-600">매장명</span>
              <span className="text-gray-900">{reservation.shop}</span>
            </div>
          </div>
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
