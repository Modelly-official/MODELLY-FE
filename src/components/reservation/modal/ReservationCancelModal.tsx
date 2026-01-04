'use client';

import { useState } from 'react';
import BaseModal from '@/src/components/common/Modal/BaseModal';
import TextArea from '@/src/components/myRecruitment/Form/TextArea';
import ReservationInfoCard from './ReservationInfoCard';
import type { ReservationInfo, ReservationCancelRequest } from '@/src/types/reservation';

interface ReservationCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationInfo;
  onSubmit: (data: ReservationCancelRequest) => void;
  isLoading?: boolean;
}

export default function ReservationCancelModal({
  isOpen,
  onClose,
  reservation,
  onSubmit,
  isLoading = false,
}: ReservationCancelModalProps) {
  const [reason, setReason] = useState('');

  // 사유가 입력되었는지 확인
  const isFormValid = reason.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    onSubmit({
      reason: reason.trim(),
    });
  };

  // 모달 닫힐 때 폼 초기화
  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="예약 취소" showCloseButton>
      <div className="flex flex-col gap-5 pt-4">
        {/* 현재 예약 정보 */}
        <ReservationInfoCard
          modelName={reservation.modelName}
          date={reservation.date}
          startTime={reservation.startTime}
        />

        {/* 취소 사유 */}
        <TextArea
          label="취소 사유"
          value={reason}
          onChange={setReason}
          placeholder="취소 사유를 입력해 주세요"
        />

        {/* 취소 요청하기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className={`flex w-full items-center justify-center rounded-full px-4 py-3.5 text-body-1-semibold ${
            isFormValid && !isLoading
              ? 'cursor-pointer bg-gray-90 text-white'
              : 'cursor-not-allowed bg-gray-20 text-gray-70'
          }`}
        >
          {isLoading ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            '취소 요청하기'
          )}
        </button>
      </div>
    </BaseModal>
  );
}
