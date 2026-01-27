'use client';

import { useMemo, useCallback } from 'react';
import {
  CalendarNavigation,
  WEEKDAYS,
  generateCalendarDays,
  formatDateString,
  getTodayString,
} from '@/src/components/common/Calendar';

interface DesignerCalendarProps {
  year: number;
  month: number; // 1-12
  selectedDate: string | null; // yyyy-MM-dd
  reservationDots: string[]; // 예약 있는 날짜 배열 (yyyy-MM-dd)
  onDateSelect: (date: string | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function DesignerCalendar({
  year,
  month,
  selectedDate,
  reservationDots,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
}: DesignerCalendarProps) {
  // 오늘 날짜 (매 렌더마다 계산하여 자정 이후에도 정확한 날짜 반영)
  const today = getTodayString();

  // 해당 월의 날짜 배열 생성
  const calendarDays = useMemo(() => generateCalendarDays(year, month), [year, month]);

  // 날짜 문자열 생성 (YYYY-MM-DD)
  const getDateString = useCallback(
    (day: number): string => formatDateString(year, month, day),
    [year, month]
  );

  // 오늘 날짜인지 확인
  const isToday = useCallback(
    (day: number): boolean => getDateString(day) === today,
    [getDateString, today]
  );

  // 선택된 날짜인지 확인
  const isSelected = useCallback(
    (day: number): boolean => getDateString(day) === selectedDate,
    [getDateString, selectedDate]
  );

  // 예약이 있는 날짜인지 확인
  const hasReservation = useCallback(
    (day: number): boolean => reservationDots.includes(getDateString(day)),
    [getDateString, reservationDots]
  );

  // 날짜 클릭 핸들러
  const handleDateClick = (day: number) => {
    const dateStr = getDateString(day);
    // 이미 선택된 날짜를 다시 클릭하면 선택 해제 (전체 보기)
    if (dateStr === selectedDate) {
      onDateSelect(null);
    } else {
      onDateSelect(dateStr);
    }
  };

  return (
    <div className="w-full bg-white px-4">
      {/* 월 네비게이션 */}
      <CalendarNavigation
        year={year}
        month={month}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />

      {/* 요일 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="flex size-8 items-center justify-center">
            <span className="text-body-2-regular text-gray-600">{weekday}</span>
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
          const weekDays = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);

          return (
            <div key={weekIndex} className="flex items-center justify-between">
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="flex h-[42px] w-8 flex-col items-center">
                  {day !== null ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDateClick(day)}
                        className={`flex size-8 cursor-pointer items-center justify-center rounded-full text-calendar-day transition-colors ${
                          isSelected(day)
                            ? 'bg-purple-600 text-white'
                            : isToday(day)
                              ? 'text-purple-700'
                              : 'text-gray-950'
                        }`}
                      >
                        {day}
                      </button>
                      {/* 예약 도트 - 항상 공간 차지, 없으면 투명 */}
                      <div
                        className={`mt-1 size-2 rounded-full ${hasReservation(day) ? 'bg-purple-600' : 'bg-transparent'}`}
                      />
                    </>
                  ) : (
                    <div className="size-8" />
                  )}
                </div>
              ))}
              {/* 마지막 주가 7일 미만일 경우 빈 칸 채우기 */}
              {weekDays.length < 7 &&
                Array.from({ length: 7 - weekDays.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="size-8" />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
