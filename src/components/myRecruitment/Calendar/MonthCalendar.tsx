'use client';

import { useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import CalendarHeader from './CalendarHeader';

interface MonthCalendarProps {
  year: number;
  month: number; // 1-12
  selectedDates: string[]; // ["2025-01-10", "2025-01-11"]
  focusedDate?: string | null; // 현재 시간 설정 중인 날짜
  onDateToggle: (date: string) => void;
  onDatesSelect?: (dates: string[]) => void; // 드래그로 여러 날짜 선택
  onFocusedDateChange?: (date: string) => void; // 포커스 날짜 변경
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export default function MonthCalendar({
  year,
  month,
  selectedDates,
  focusedDate,
  onDateToggle,
  onDatesSelect,
  onFocusedDateChange,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  // 드래그 상태
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 오늘 날짜
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  // 해당 월의 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay(); // 0 (일) ~ 6 (토)
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
      return selectedDates.includes(formatDateString(day));
    },
    [selectedDates, formatDateString]
  );

  // 드래그 범위 내에 있는지 확인
  const isInDragRange = useCallback(
    (day: number): boolean => {
      if (!isDragging || dragStart === null || dragEnd === null) return false;
      const min = Math.min(dragStart, dragEnd);
      const max = Math.max(dragStart, dragEnd);
      return day >= min && day <= max;
    },
    [isDragging, dragStart, dragEnd]
  );

  // 포커스된 날짜인지 확인 (시간 선택 중인 날짜)
  const isFocused = useCallback(
    (day: number): boolean => {
      return formatDateString(day) === focusedDate;
    },
    [formatDateString, focusedDate]
  );

  // 과거 날짜인지 확인 (오늘 이전)
  const isPast = useCallback(
    (day: number): boolean => {
      const dateStr = formatDateString(day);
      return dateStr < today;
    },
    [formatDateString, today]
  );

  // 드래그 시작
  const handleDragStart = (day: number) => {
    if (isPast(day)) return;
    setDragStart(day);
    setDragEnd(day);
    setIsDragging(true);
  };

  // 드래그 중
  const handleDragEnter = (day: number) => {
    if (!isDragging || isPast(day)) return;
    setDragEnd(day);
  };

  // 드래그 종료
  const handleDragEnd = () => {
    if (!isDragging || dragStart === null || dragEnd === null) {
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
      return;
    }

    const min = Math.min(dragStart, dragEnd);
    const max = Math.max(dragStart, dragEnd);

    // 단일 클릭인 경우 (드래그 시작과 끝이 같음)
    if (dragStart === dragEnd) {
      const clickedDateStr = formatDateString(dragStart);
      const isAlreadySelected = selectedDates.includes(clickedDateStr);

      if (isAlreadySelected) {
        // 이미 선택된 날짜 클릭 시 포커스 변경
        if (onFocusedDateChange) {
          onFocusedDateChange(clickedDateStr);
        }
      } else {
        // 새 날짜 선택
        if (onDatesSelect) {
          onDatesSelect([clickedDateStr]);
        }
      }
    } else {
      // 드래그 범위 내의 모든 날짜 (과거 날짜 제외)
      const rangeDates: string[] = [];
      for (let day = min; day <= max; day++) {
        if (!isPast(day)) {
          rangeDates.push(formatDateString(day));
        }
      }

      // 드래그로 여러 날짜 추가
      if (rangeDates.length > 0 && onDatesSelect) {
        onDatesSelect(rangeDates);
      }
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  // 전역 마우스 업 이벤트 핸들러
  const handleMouseUp = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  return (
    <div
      className="w-full select-none overflow-hidden rounded-[20px] bg-gray-100 px-4 pb-5"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleDragEnd}
    >
      {/* 월 네비게이션 */}
      <CalendarHeader year={year} month={month} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />

      {/* 요일 헤더 - 날짜 그리드와 동일한 간격 */}
      <div className="mb-2 flex items-center justify-between">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="flex h-8 w-8 items-center justify-center">
            <span className="text-body-2-regular text-gray-600">{weekday}</span>
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
          const weekDays = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);
          const hasSelectedInWeek = weekDays.some((day) => day !== null && isSelected(day));

          return (
            <div key={weekIndex} className="flex flex-col">
              {/* 날짜 행 */}
              <div className="flex items-center justify-between">
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="flex h-8 w-8 items-center justify-center">
                    {day !== null ? (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleDragStart(day);
                        }}
                        onMouseEnter={() => handleDragEnter(day)}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          handleDragStart(day);
                        }}
                        onTouchMove={(e) => {
                          const touch = e.touches[0];
                          const element = document.elementFromPoint(touch.clientX, touch.clientY);
                          const dayAttr = element?.getAttribute('data-day');
                          if (dayAttr) {
                            handleDragEnter(parseInt(dayAttr, 10));
                          }
                        }}
                        disabled={isPast(day)}
                        data-day={day}
                        className={`flex size-8 items-center justify-center rounded-full text-[16px] leading-[1.4] tracking-[-0.32px] transition-colors ${
                          isFocused(day) && isSelected(day)
                            ? 'cursor-pointer border border-purple-500 bg-gray-100 text-purple-700'
                            : isSelected(day) || isInDragRange(day)
                              ? 'cursor-pointer bg-purple-500 text-white'
                              : isPast(day)
                                ? 'cursor-not-allowed bg-gray-100 text-gray-500'
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

              {/* x-icon 행 (선택된 날짜가 있을 때만 표시, 8px gap) */}
              {hasSelectedInWeek && (
                <div className="mt-2 flex items-center justify-between">
                  {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="flex h-[18px] w-8 items-center justify-center">
                      {day !== null && isSelected(day) ? (
                        <button
                          type="button"
                          onClick={() => onDateToggle(formatDateString(day))}
                          className="cursor-pointer"
                          aria-label="날짜 선택 취소"
                        >
                          <Image src="/icons/common/x-circle.svg" alt="" width={18} height={18} />
                        </button>
                      ) : null}
                    </div>
                  ))}
                  {/* 마지막 주가 7일 미만일 경우 빈 칸 채우기 */}
                  {weekIndex === Math.ceil(calendarDays.length / 7) - 1 &&
                    weekDays.length < 7 &&
                    Array.from({ length: 7 - weekDays.length }).map((_, i) => (
                      <div key={`empty-icon-${i}`} className="h-[18px] w-8" />
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
