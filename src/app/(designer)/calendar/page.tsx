'use client';

import { useState, useMemo, useEffect } from 'react';
import ArrowUpIcon from '@/public/icons/calendar/arrow-up.svg';
import { DesignerCalendar, CalendarReservationCard } from '@/src/components/calendar';
import { useMonthNavigation } from '@/src/hooks/custom/myRecruitment';
import { useReservationDots, useCalendarReservations } from '@/src/hooks/queries/calendar';
import { useToast } from '@/src/hooks/common';
import { formatTimeWithPeriod } from '@/src/utils/common';
import type { CalendarReservationItem } from '@/src/types/calendar';

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 예약 목록을 시간별로 그룹핑
 */
function groupReservationsByTime(
  reservations: CalendarReservationItem[],
): Map<string, CalendarReservationItem[]> {
  const grouped = new Map<string, CalendarReservationItem[]>();

  reservations.forEach((reservation) => {
    const time = reservation.startTime;
    if (!grouped.has(time)) {
      grouped.set(time, []);
    }
    grouped.get(time)!.push(reservation);
  });

  return grouped;
}

/**
 * 날짜를 "DD(요일)" 형식으로 포맷
 */
function formatSelectedDateTitle(dateStr: string): string {
  const [, , day] = dateStr.split('-');
  const date = new Date(dateStr);
  const weekday = WEEKDAY_NAMES[date.getDay()];
  return `${parseInt(day, 10)}(${weekday})`;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { showToast } = useToast();

  // 월 네비게이션
  const { year, month, monthString, handlePrevMonth, handleNextMonth } = useMonthNavigation();

  // 예약 도트 조회 (CONFIRMED만)
  const {
    data: dotsData,
    isError: isDotsError,
    error: dotsError,
  } = useReservationDots({
    month: monthString,
  });

  // 예약 목록 조회 (selectedDate가 null이면 전체, 있으면 해당 날짜)
  const {
    data: reservationsData,
    isLoading: isReservationsLoading,
    isError: isReservationsError,
    error: reservationsError,
  } = useCalendarReservations({
    month: monthString,
    date: selectedDate ?? undefined,
  });

  // 에러 발생 시 Toast 표시
  useEffect(() => {
    if (isDotsError && dotsError) {
      showToast('예약 정보를 불러오는데 실패했습니다.');
    }
  }, [isDotsError, dotsError, showToast]);

  useEffect(() => {
    if (isReservationsError && reservationsError) {
      showToast('예약 목록을 불러오는데 실패했습니다.');
    }
  }, [isReservationsError, reservationsError, showToast]);

  // 예약 있는 날짜 배열 (yyyy-MM-dd)
  const reservationDots = useMemo(() => {
    if (!dotsData?.result?.days) return [];
    return dotsData.result.days.filter((dot) => dot.hasReserved).map((dot) => dot.date);
  }, [dotsData]);

  // 예약 목록
  const reservations = reservationsData?.result?.items ?? [];
  const totalCount = reservationsData?.result?.totalCount ?? 0;

  // 시간별로 그룹핑된 예약 목록
  const groupedReservations = useMemo(
    () => groupReservationsByTime(reservations),
    [reservations],
  );

  // 날짜 선택 핸들러
  const handleDateSelect = (date: string | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-[52px] items-center bg-white px-5">
        <h1 className="text-head-3-semibold text-gray-950">캘린더</h1>
      </header>

      {/* 캘린더 */}
      <DesignerCalendar
        year={year}
        month={month}
        selectedDate={selectedDate}
        reservationDots={reservationDots}
        onDateSelect={handleDateSelect}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {/* 하단 예약 리스트 영역 */}
      <div className="mt-4 flex flex-1 flex-col bg-gray-100 px-5 pt-5 pb-16">


        {/* 타이틀 영역 */}
        <div className="mb-4 flex items-baseline gap-2">
          <h2 className="text-head-2-semibold text-gray-950">
            {selectedDate ? formatSelectedDateTitle(selectedDate) : '전체'}
          </h2>
          <span className="text-body-2-medium text-gray-600">{totalCount}개의 일정</span>
        </div>

        {/* 예약 카드 리스트 */}
        <div className="flex flex-1 flex-col gap-7 overflow-y-auto">
          {isReservationsLoading ? (
            <div className="flex flex-1 items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
            </div>
          ) : isReservationsError ? (
            <div className="flex flex-1 flex-col items-center justify-center py-10">
              <p className="text-body-1-medium text-gray-500">예약 목록을 불러오지 못했습니다</p>
            </div>
          ) : reservations.length > 0 ? (
            Array.from(groupedReservations.entries()).map(([time, items]) => (
              <div key={time} className="flex flex-col gap-2">
                {/* 시간 헤더 + 구분선 */}
                <div className="flex items-center gap-2">
                  <span className="text-body-2-semibold shrink-0 text-gray-900">
                    {formatTimeWithPeriod(time)}
                  </span>
                  <div className="h-px flex-1 bg-gray-400" />
                </div>

                {/* 해당 시간대 예약 카드들 */}
                <div className="flex flex-col gap-2">
                  {items.map((reservation) => (
                    <CalendarReservationCard
                      key={reservation.reservationId}
                      reservation={reservation}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-10">
              <p className="text-body-1-medium text-gray-500">예약된 일정이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
