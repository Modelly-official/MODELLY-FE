'use client';

import { useMemo } from 'react';
import { ReservationCalendar } from '@/src/components/reservation';
import { useReservationStore } from '@/src/stores/reservation/useReservationStore';
import { useMonthNavigation } from '@/src/hooks/custom/myRecruitment';
import { useAvailableSchedules } from '@/src/hooks/queries/reservation';

interface StepDateTimeProps {
  recruitmentId: number;
  goNext: () => void;
  goPrev: () => void;
}

export default function StepDateTime({ recruitmentId, goNext, goPrev }: StepDateTimeProps) {
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
      {/* 헤더 (임시) */}
      <div className="flex h-14 items-center justify-between px-4">
        <button type="button" onClick={goPrev} className="text-body-2-medium text-gray-900">
          ← 뒤로
        </button>
        <span className="text-body-2-medium text-gray-500">1/4</span>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 px-4">
        <h1 className="mb-6 text-head-1-semibold text-gray-900">방문일 및 시간 선택</h1>

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
              <div className="mt-6">
                <h2 className="mb-4 text-head-3-semibold text-gray-900">시간 선택</h2>
                {selectedDateTimes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedDateTimes.map((timeSlot) => (
                      <button
                        key={timeSlot.startTime}
                        type="button"
                        onClick={() => !timeSlot.isReserved && handleTimeSelect(timeSlot.startTime)}
                        disabled={timeSlot.isReserved}
                        className={`rounded-lg px-4 py-2 text-body-2-medium transition-colors ${
                          selectedTime === timeSlot.startTime
                            ? 'bg-purple-500 text-white'
                            : timeSlot.isReserved
                              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                              : 'cursor-pointer bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {timeSlot.startTime}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-body-2-regular text-gray-500">
                    해당 날짜에 예약 가능한 시간이 없습니다.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="p-4">
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className={`h-14 w-full rounded-xl text-body-1-semibold transition-colors ${
            canProceed
              ? 'cursor-pointer bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-200 text-gray-500'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
