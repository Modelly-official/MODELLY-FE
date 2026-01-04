'use client';

import { useMemo, useCallback, useState } from 'react';
import BaseBottomSheet from './BaseBottomSheet';
import ArrowLeftIcon from '@/public/icons/common/arrow-left.svg';
import ArrowRightIcon from '@/public/icons/common/arrow-right.svg';

interface CalendarBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null; // "2025-01-10"
  onDateSelect: (date: string) => void;
  availableDates?: string[]; // 선택 가능한 날짜 목록 (없으면 과거 제외 모든 날짜 선택 가능)
  title?: string;
  minDate?: string; // 최소 선택 가능 날짜 (기본: 오늘)
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export default function CalendarBottomSheet({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  availableDates,
  title = '날짜 선택',
  minDate,
}: CalendarBottomSheetProps) {
  // 현재 표시 중인 년/월
  const [currentYear, setCurrentYear] = useState(() => {
    if (selectedDate) {
      return parseInt(selectedDate.split('-')[0], 10);
    }
    return new Date().getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      return parseInt(selectedDate.split('-')[1], 10);
    }
    return new Date().getMonth() + 1;
  });

  // 오늘 날짜
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  // 최소 날짜 (기본값: 오늘)
  const minimumDate = minDate || today;

  // 해당 월의 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
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
  }, [currentYear, currentMonth]);

  // 날짜 문자열 생성 (YYYY-MM-DD)
  const formatDateString = useCallback(
    (day: number): string => {
      return `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    },
    [currentYear, currentMonth]
  );

  // 날짜가 선택되었는지 확인
  const isSelected = useCallback(
    (day: number): boolean => {
      return formatDateString(day) === selectedDate;
    },
    [selectedDate, formatDateString]
  );

  // 선택 가능한 날짜인지 확인
  const isAvailable = useCallback(
    (day: number): boolean => {
      const dateStr = formatDateString(day);
      // 최소 날짜보다 이전이면 선택 불가
      if (dateStr < minimumDate) return false;
      // availableDates가 지정되어 있으면 해당 목록에 있어야 선택 가능
      if (availableDates) {
        return availableDates.includes(dateStr);
      }
      return true;
    },
    [formatDateString, minimumDate, availableDates]
  );

  // 날짜 클릭 핸들러
  const handleDateClick = (day: number) => {
    if (!isAvailable(day)) return;
    onDateSelect(formatDateString(day));
    onClose();
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 월을 2자리로 포맷
  const formattedMonth = currentMonth.toString().padStart(2, '0');

  return (
    <BaseBottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="w-full select-none">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-center gap-4 py-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex size-8 cursor-pointer items-center justify-center"
            aria-label="이전 달"
          >
            <ArrowLeftIcon className="h-4 w-[9px]" />
          </button>

          <span className="text-head-2-semibold text-gray-900">
            {currentYear}.{formattedMonth}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="flex size-8 cursor-pointer items-center justify-center"
            aria-label="다음 달"
          >
            <ArrowRightIcon className="h-4 w-[9px]" />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="mb-1 grid grid-cols-7 place-items-center">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="flex size-7 items-center justify-center">
              <span className="text-body-2-regular text-gray-600">{weekday}</span>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 place-items-center gap-y-0.5">
          {calendarDays.map((day, index) => (
            <div key={index} className="flex size-7 items-center justify-center">
              {day !== null ? (
                <button
                  type="button"
                  onClick={() => handleDateClick(day)}
                  disabled={!isAvailable(day)}
                  className={`flex size-7 items-center justify-center rounded-full text-body-2-medium transition-colors ${
                    isSelected(day)
                      ? 'bg-purple-500 text-white'
                      : !isAvailable(day)
                        ? 'cursor-not-allowed text-gray-400'
                        : 'cursor-pointer text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ) : (
                <div className="size-7" />
              )}
            </div>
          ))}
        </div>
      </div>
    </BaseBottomSheet>
  );
}
