'use client';

import { useMemo, useCallback } from 'react';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import ArrowRightIcon from '@/public/icons/common/arrow-right.svg';

interface ReservationCalendarProps {
  year: number;
  month: number; // 1-12
  selectedDate: string | null; // "2025-01-10"
  availableDates: string[]; // 예약 가능한 날짜 목록
  onDateSelect: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

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
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  // 해당 월의 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];

    // 이전 달 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 현재 달 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [year, month]);

  // 날짜 문자열 생성 (YYYY-MM-DD)
  const formatDateString = useCallback(
    (day: number): string => {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    },
    [year, month]
  );

  // 날짜가 선택되었는지 확인
  const isSelected = useCallback(
    (day: number): boolean => {
      return formatDateString(day) === selectedDate;
    },
    [selectedDate, formatDateString]
  );

  // 예약 가능한 날짜인지 확인
  const isAvailable = useCallback(
    (day: number): boolean => {
      return availableDates.includes(formatDateString(day));
    },
    [availableDates, formatDateString]
  );

  // 과거 날짜인지 확인 (오늘 이전)
  const isPast = useCallback(
    (day: number): boolean => {
      const dateStr = formatDateString(day);
      return dateStr < today;
    },
    [formatDateString, today]
  );

  // 날짜 클릭 핸들러
  const handleDateClick = (day: number) => {
    if (isPast(day) || !isAvailable(day)) return;
    onDateSelect(formatDateString(day));
  };

  // 월을 2자리로 포맷
  const formattedMonth = month.toString().padStart(2, '0');

  return (
    <div className="w-full select-none overflow-hidden rounded-[20px] bg-gray-100 px-4 pb-5">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-center gap-4 py-4">
        <button
          type="button"
          onClick={onPrevMonth}
          className="flex size-8 cursor-pointer items-center justify-center"
          aria-label="이전 달"
        >
          <ArrowLeftIcon className="h-4 w-[9px]" />
        </button>

        <span className="text-head-2-semibold text-gray-900">
          {year}.{formattedMonth}
        </span>

        <button
          type="button"
          onClick={onNextMonth}
          className="flex size-8 cursor-pointer items-center justify-center"
          aria-label="다음 달"
        >
          <ArrowRightIcon className="h-4 w-[9px]" />
        </button>
      </div>

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
