'use client';

import { useCallback, useMemo, useState } from 'react';
import BaseModal from '@/src/components/common/Modal/BaseModal';
import { CalendarBottomSheet } from '@/src/components/common/BottomSheet';
import CalendarIcon from '@/public/icons/reservationModal/calendar.svg';
import ArrowDownIcon from '@/public/icons/reservationModal/arrow-down.svg';
import ReservationInfoCard from './ReservationInfoCard';
import { formatDateToShort } from '@/src/utils/common';
import { useIMEInput } from '@/src/hooks/custom/useIMEInput';
import { useAvailableSchedules } from '@/src/hooks/queries/reservation';
import type { ReservationInfo, ReservationChangeRequest, AvailableTimeSlot } from '@/src/types/reservation';

interface ReservationChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationInfo;
  onSubmit: (data: ReservationChangeRequest) => void;
  isLoading?: boolean;
}

const formatMonthKey = (value?: string) => {
  if (!value) return '';
  const [year, month] = value.split('-');
  if (!year || !month) return '';
  return `${year}-${month}`;
};

export default function ReservationChangeModal({
  isOpen,
  onClose,
  reservation,
  onSubmit,
  isLoading = false,
}: ReservationChangeModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    () => formatMonthKey(reservation.date) || formatMonthKey(new Date().toISOString()),
  );
  const reasonInput = useIMEInput(reason, setReason);

  const { data: schedulesData, isLoading: isSchedulesLoading } = useAvailableSchedules(
    { recruitmentId: reservation.recruitmentId ?? 0, month: currentMonth },
    { enabled: !!reservation.recruitmentId && isOpen },
  );

  const availableSchedules = useMemo(() => schedulesData?.result?.schedules ?? [], [schedulesData]);
  const availableDates = useMemo(() => {
    if (availableSchedules.length === 0) return undefined;
    return availableSchedules
      .filter((schedule) => schedule.times.some((slot) => !slot.isReserved))
      .map((schedule) => schedule.date);
  }, [availableSchedules]);

  const timeSlots: AvailableTimeSlot[] = useMemo(() => {
    if (!selectedDate) return [];
    const schedule = availableSchedules.find((item) => item.date === selectedDate);
    if (!schedule) return [];
    return schedule.times
      .filter((slot) => !slot.isReserved)
      .map((slot) => ({ value: slot.startTime, label: slot.startTime }));
  }, [availableSchedules, selectedDate]);

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

  const resetForm = useCallback(() => {
    setSelectedDate('');
    setSelectedTime(null);
    setReason('');
    setIsTimeDropdownOpen(false);
    setIsCalendarOpen(false);
    setCurrentMonth(formatMonthKey(reservation.date) || formatMonthKey(new Date().toISOString()));
  }, [reservation.date]);

  // 모달 닫힐 때 폼 초기화
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 시간 선택 핸들러
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsTimeDropdownOpen(false);
  };

  // 날짜 선택 핸들러
  const handleDateClick = () => {
    setIsCalendarOpen(true);
  };

  // 날짜 선택 완료 핸들러
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleMonthChange = useCallback((year: number, month: number) => {
    setCurrentMonth(`${year}-${String(month).padStart(2, '0')}`);
  }, []);

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="예약 변경" showCloseButton>
      <div className="flex flex-col gap-7 pt-5">
        {/* 현재 예약 정보 */}
        <ReservationInfoCard
          modelName={reservation.modelName}
          date={reservation.date}
          startTime={reservation.startTime}
        />

        {/* 입력 필드들 */}
        <div className="flex flex-col gap-4">
          {/* 변경 일자 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-1">
              <span className="text-body-2-medium text-gray-900">변경 일자</span>
            </div>
            <button
              type="button"
              onClick={handleDateClick}
              className="flex w-full cursor-pointer items-center justify-between rounded-[10px] bg-gray-100 px-4 py-3.5"
            >
              <span className={`text-body-2-medium ${selectedDate ? 'text-gray-900' : 'text-gray-600'}`}>
                {selectedDate ? formatDateToShort(selectedDate) : '날짜를 선택하세요'}
              </span>
              <CalendarIcon className="size-5 text-gray-900" />
            </button>
          </div>

          {/* 변경 시간 */}
          <div className="relative flex flex-col gap-1">
            <span className="text-body-2-medium text-gray-900">변경 시간</span>
            <button
              type="button"
              onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
              disabled={!selectedDate || isSchedulesLoading}
              className="flex w-full cursor-pointer items-center justify-between rounded-[10px] bg-gray-100 px-4 py-3.5"
            >
              <span className={`text-body-2-medium ${selectedTime ? 'text-gray-900' : 'text-gray-600'}`}>
                {selectedTime || (isSchedulesLoading ? '시간을 불러오는 중...' : '시간을 선택하세요')}
              </span>
              <ArrowDownIcon
                className={`size-5 text-gray-700 transition-transform ${isTimeDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* 시간 드롭다운 */}
            {isTimeDropdownOpen && (
              <div className="absolute top-full z-10 mt-1 max-h-[200px] w-full overflow-y-auto rounded-[10px] border border-gray-400 bg-white shadow-lg">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => handleTimeSelect(slot.value)}
                      className={`text-body-2-medium w-full cursor-pointer px-4 py-3 text-left hover:bg-gray-100 ${
                        selectedTime === slot.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))
                ) : (
                  <div className="text-body-2-medium px-4 py-3 text-gray-600">선택 가능한 시간이 없습니다.</div>
                )}
              </div>
            )}
          </div>

          {/* 변경 사유 */}
          <div className="flex flex-col gap-1">
            <span className="text-body-2-medium text-gray-900">변경 사유</span>
            <textarea
              value={reasonInput.value}
              onChange={reasonInput.onChange}
              onCompositionStart={reasonInput.onCompositionStart}
              onCompositionEnd={reasonInput.onCompositionEnd}
              placeholder="사유를 입력하세요"
              className="text-body-2-medium min-h-[49px] w-full resize-none rounded-[10px] bg-gray-100 px-4 py-3.5 text-gray-900 placeholder:text-gray-600 focus:outline-none"
              rows={1}
            />
          </div>
        </div>

        {/* 변경 요청하기 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className={`text-body-2-medium flex h-[49px] w-full items-center justify-center rounded-full ${
            isFormValid && !isLoading
              ? 'cursor-pointer bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-100 text-gray-700'
          }`}
        >
          {isLoading ? (
            <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            '변경 요청하기'
          )}
        </button>
      </div>

      {/* 캘린더 바텀시트 */}
      <CalendarBottomSheet
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate || null}
        onDateSelect={handleDateSelect}
        title=""
        availableDates={availableDates}
        onMonthChange={handleMonthChange}
      />
    </BaseModal>
  );
}
