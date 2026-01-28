'use client';

import { useMemo } from 'react';
import {
  ReservationCalendar,
  ReservationTimeSelector,
  ReservationHeader,
  ReservationStepInfo,
} from '@/src/components/reservation';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';
import { useMonthNavigation } from '@/src/hooks/custom/myRecruitment';
import { useAvailableSchedules } from '@/src/hooks/queries/reservation';
import { FixedBottomContainer } from '@/src/components/common/FixedBottomContainer';

interface StepDateTimeProps {
  recruitmentId: number;
  shopName: string;
  shopAddress: string;
  designerName: string;
  goNext: () => void;
  goPrev: () => void;
}

export default function StepDateTime({
  recruitmentId,
  shopName,
  shopAddress,
  designerName,
  goNext,
  goPrev,
}: StepDateTimeProps) {
  const { selectedDate, selectedTime, setSelectedDate, setSelectedTime } = useReservationStore();
  const { year, month, monthString, handlePrevMonth, handleNextMonth } = useMonthNavigation();

  // 예약 가능 시간 조회
  const { data: schedulesData, isLoading } = useAvailableSchedules({
    recruitmentId,
    month: monthString,
  });

  // 예약 가능한 날짜 목록 추출
  const availableDates = useMemo(() => {
    if (!schedulesData?.result?.schedules) return [];
    return schedulesData.result.schedules
      .filter((schedule) => schedule.times.some((time) => !time.isReserved))
      .map((schedule) => schedule.date);
  }, [schedulesData]);

  // 선택된 날짜의 시간대 목록
  const selectedDateTimes = useMemo(() => {
    if (!selectedDate || !schedulesData?.result?.schedules) return [];
    const dateSchedule = schedulesData.result.schedules.find((s) => s.date === selectedDate);
    return dateSchedule?.times ?? [];
  }, [selectedDate, schedulesData]);

  // 날짜 선택 핸들러
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null); // 날짜 변경 시 시간 초기화
  };

  // 시간 선택 핸들러
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // 다음 버튼 활성화 조건
  const canProceed = selectedDate !== null && selectedTime !== null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ReservationHeader onBack={goPrev} />

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col gap-6 px-4 pb-[250px]">
        {/* 스텝 정보 */}
        <ReservationStepInfo
          currentStep={1}
          totalSteps={4}
          shopName={shopName}
          shopAddress={shopAddress}
          designerName={designerName}
        />

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="text-body-2-regular text-gray-500">로딩 중...</span>
          </div>
        ) : (
          <>
            {/* 캘린더 */}
            <ReservationCalendar
              year={year}
              month={month}
              selectedDate={selectedDate}
              availableDates={availableDates}
              onDateSelect={handleDateSelect}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            {/* 시간 선택 (선택된 날짜가 있을 때만 표시) */}
            {selectedDate && (
              <div>
                <ReservationTimeSelector
                  timeSlots={selectedDateTimes}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* 하단 버튼 */}
      <FixedBottomContainer>
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className={`h-14 w-full rounded-full text-body-1-semibold transition-colors ${
            canProceed
              ? 'cursor-pointer bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-200 text-gray-500'
          }`}
        >
          다음
        </button>
      </FixedBottomContainer>
    </div>
  );
}
