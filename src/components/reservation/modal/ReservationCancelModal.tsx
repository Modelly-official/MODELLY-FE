'use client';

import { useState } from 'react';
import BaseModal from '@/src/components/common/Modal/BaseModal';
import ReservationInfoCard from './ReservationInfoCard';
import { useIMEInput } from '@/src/hooks/custom/useIMEInput';
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
  const reasonInput = useIMEInput(reason, setReason);

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
      <div className="flex flex-col gap-7 pt-5">
        {/* 현재 예약 정보 */}
        <ReservationInfoCard
          modelName={reservation.modelName}
          date={reservation.date}
          startTime={reservation.startTime}
        />

        {/* 취소 사유 */}
        <div className="flex flex-col gap-1">
          <span className="text-head-4-medium text-gray-900">취소 사유</span>
          <textarea
            value={reasonInput.value}
            onChange={reasonInput.onChange}
            onCompositionStart={reasonInput.onCompositionStart}
            onCompositionEnd={reasonInput.onCompositionEnd}
            placeholder="사유를 입력하세요"
            className="bg-gray-100 text-body-2-medium text-gray-900 placeholder:text-gray-600 min-h-[49px] w-full resize-none rounded-[10px] px-4 py-3.5 focus:outline-none"
            rows={1}
          />
        </div>

        {/* 취소 요청하기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className={`text-body-2-medium flex h-[49px] w-full items-center justify-center rounded-full ${
            isFormValid && !isLoading
              ? 'bg-gray-900 cursor-pointer text-white'
              : 'bg-gray-100 text-gray-700 cursor-not-allowed'
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
