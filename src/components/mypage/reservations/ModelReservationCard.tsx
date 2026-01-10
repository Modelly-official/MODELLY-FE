'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ModelReservationItem, ReservationListType, ReservationInfo, ReservationChangeRequest, ReservationCancelRequest } from '@/src/types';
import { subCategoryCodeToName, categoryCodeToName } from '@/src/utils/myRecruitment';
import { formatDateToKorean, formatTimeToKorean } from '@/src/utils/common';
import {
  ReservationChangeModal,
  ReservationCancelModal,
  ReservationSuccessModal,
} from '@/src/components/reservation';
import { MOCK_TIME_SLOTS } from '@/src/mocks/calendar';

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

  // 예약 정보를 모달에 전달할 형식으로 변환 (모델 입장에서 디자이너 정보 표시)
  const reservationInfo: ReservationInfo = {
    reservationId: reservation.reservationId,
    modelUserId: reservation.designerUserId, // 디자이너 유저 ID
    modelName: reservation.designerNickname, // 디자이너 닉네임 표시
    date: reservation.date,
    startTime: reservation.startTime,
  };

  // 카드 클릭 시 공고 상세로 이동
  const handleCardClick = () => {
    router.push(`/post/${reservation.recruitmentId}`);
  };

  const handleChangeClick = () => {
    setIsChangeModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  // Mock: 예약 변경 요청 처리
  const handleChangeSubmit = (data: ReservationChangeRequest) => {
    console.log('예약 변경 요청:', data);
    setIsChangeModalOpen(false);
    setSuccessMessage('예약 변경이 요청되었습니다');
    setIsSuccessModalOpen(true);
  };

  // Mock: 예약 취소 요청 처리
  const handleCancelSubmit = (data: ReservationCancelRequest) => {
    console.log('예약 취소 요청:', data);
    setIsCancelModalOpen(false);
    setSuccessMessage('예약 취소가 요청되었습니다');
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
          {/* 완료 상태 뱃지 */}
          {isCompleted && (
            <span className="text-caption-1-medium rounded-lg border border-gray-400 px-2 py-1 text-gray-800">
              완료
            </span>
          )}
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
        timeSlots={MOCK_TIME_SLOTS}
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
