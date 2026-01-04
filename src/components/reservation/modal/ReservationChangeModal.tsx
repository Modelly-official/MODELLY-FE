'use client';

import { useState } from 'react';
import BaseModal from '@/src/components/common/Modal/BaseModal';
import Dropdown from '@/src/components/common/Dropdown/Dropdown';
import TextArea from '@/src/components/myRecruitment/Form/TextArea';
import ReservationInfoCard from './ReservationInfoCard';
import type { ReservationInfo, ReservationChangeRequest, AvailableTimeSlot } from '@/src/types/reservation';

interface ReservationChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationInfo;
  timeSlots: AvailableTimeSlot[];
  onSubmit: (data: ReservationChangeRequest) => void;
  isLoading?: boolean;
}

export default function ReservationChangeModal({
  isOpen,
  onClose,
  reservation,
  timeSlots,
  onSubmit,
  isLoading = false,
}: ReservationChangeModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  // 모든 필드가 입력되었는지 확인
  const isFormValid = selectedDate && selectedTime && reason.trim();

  const handleSubmit = () => {
    if (!isFormValid || !selectedTime) return;

    onSubmit({
      proposedDate: selectedDate,
      proposedStartTime: selectedTime,
      reason: reason.trim(),
    });
  };

  // 모달 닫힐 때 폼 초기화
  const handleClose = () => {
    setSelectedDate('');
    setSelectedTime(null);
    setReason('');
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="예약 변경" showCloseButton>
      <div className="flex flex-col gap-5 pt-4">
        {/* 현재 예약 정보 */}
        <ReservationInfoCard
          modelName={reservation.modelName}
          date={reservation.date}
          startTime={reservation.startTime}
        />

        {/* 변경 일자 */}
        <div className="flex flex-col gap-2">
          <span className="text-body-1-medium text-gray-90">변경 일자</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-body-2-medium w-full rounded-xl bg-gray-10 px-4 py-3.5 text-gray-90 focus:outline-none"
          />
        </div>

        {/* 변경 시간 */}
        <Dropdown
          label="변경 시간"
          options={timeSlots}
          value={selectedTime}
          onChange={setSelectedTime}
          placeholder="시간을 선택해 주세요"
        />

        {/* 변경 사유 */}
        <TextArea
          label="변경 사유"
          value={reason}
          onChange={setReason}
          placeholder="변경 사유를 입력해 주세요"
        />

        {/* 변경 요청하기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className={`w-full cursor-pointer rounded-full px-4 py-3.5 text-body-1-semibold ${
            isFormValid && !isLoading
              ? 'bg-gray-90 text-white'
              : 'cursor-not-allowed bg-gray-20 text-gray-70'
          }`}
        >
          {isLoading ? '요청 중...' : '변경 요청하기'}
        </button>
      </div>
    </BaseModal>
  );
}
