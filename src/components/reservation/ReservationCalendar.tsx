'use client';

import { useMemo, useCallback } from 'react';
import {
  CalendarNavigation,
  WEEKDAYS,
  generateCalendarDays,
  formatDateString,
  getTodayString,
} from '@/src/components/common/Calendar';

interface ReservationCalendarProps {
  year: number;
  month: number; // 1-12
  selectedDate: string | null; // "2025-01-10"
  availableDates: string[]; // 예약 가능한 날짜 목록
  onDateSelect: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function ReservationCalendar({
  year,
  month,
  selectedDate,
  availableDates,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
}: ReservationCalendarProps) {
  // 오늘 날짜
  const today = useMemo(() => getTodayString(), []);

  // 해당 월의 날짜 배열 생성
  const calendarDays = useMemo(() => generateCalendarDays(year, month), [year, month]);

  // 날짜 문자열 생성 (YYYY-MM-DD)
  const getDateString = useCallback(
    (day: number): string => formatDateString(year, month, day),
    [year, month]
  );

  // 날짜가 선택되었는지 확인
  const isSelected = useCallback(
    (day: number): boolean => getDateString(day) === selectedDate,
    [selectedDate, getDateString]
  );

  // 예약 가능한 날짜인지 확인
  const isAvailable = useCallback(
    (day: number): boolean => availableDates.includes(getDateString(day)),
    [availableDates, getDateString]
  );

  // 과거 날짜인지 확인 (오늘 이전)
  const isPast = useCallback(
    (day: number): boolean => getDateString(day) < today,
    [getDateString, today]
  );

  // 날짜 클릭 핸들러
  const handleDateClick = (day: number) => {
    if (isPast(day) || !isAvailable(day)) return;
    onDateSelect(getDateString(day));
  };

  return (
    <div className="w-full select-none overflow-hidden rounded-[20px] bg-gray-100 px-4 pb-5">
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
                <div key={dayIndex} className="flex size-8 items-center justify-center">
                  {day !== null ? (
                    <button
                      type="button"
                      onClick={() => handleDateClick(day)}
                      disabled={isPast(day) || !isAvailable(day)}
                      className={`flex size-8 items-center justify-center rounded-full text-[16px] leading-[1.4] tracking-[-0.32px] transition-colors ${
                        isSelected(day)
                          ? 'bg-purple-500 text-white'
                          : isPast(day) || !isAvailable(day)
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'cursor-pointer bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ) : (
                    <div className="size-8" />
                  )}
                </div>
              ))}
              {/* 마지막 주가 7일 미만일 경우 빈 칸 채우기 */}
              {weekIndex === Math.ceil(calendarDays.length / 7) - 1 &&
                weekDays.length < 7 &&
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
