'use client';

import { useMemo, useCallback, useEffect, useState } from 'react';
import BaseBottomSheet from './BaseBottomSheet';
import {
  CalendarNavigation,
  WEEKDAYS,
  generateCalendarDays,
  formatDateString,
  getTodayString,
} from '@/src/components/common/Calendar';

interface CalendarBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null; // "2025-01-10"
  onDateSelect: (date: string) => void;
  availableDates?: string[]; // 선택 가능한 날짜 목록 (없으면 과거 제외 모든 날짜 선택 가능)
  title?: string;
  minDate?: string; // 최소 선택 가능 날짜 (기본: 오늘)
  onMonthChange?: (year: number, month: number) => void;
}

export default function CalendarBottomSheet({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  availableDates,
  title = '날짜 선택',
  minDate,
  onMonthChange,
}: CalendarBottomSheetProps) {
  // 임시 선택 날짜 (확인 버튼 클릭 전까지 유지)
  const [tempSelectedDate, setTempSelectedDate] = useState<string | null>(null);

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

  // 실제 표시할 선택 날짜 (tempSelectedDate가 있으면 우선, 없으면 selectedDate)
  const displaySelectedDate = tempSelectedDate ?? selectedDate;

  // 오늘 날짜
  const today = useMemo(() => getTodayString(), []);

  // 최소 날짜 (기본값: 오늘)
  const minimumDate = minDate || today;

  // 해당 월의 날짜 배열 생성
  const calendarDays = useMemo(
    () => generateCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // 날짜 문자열 생성 (YYYY-MM-DD)
  const getDateString = useCallback(
    (day: number): string => formatDateString(currentYear, currentMonth, day),
    [currentYear, currentMonth]
  );

  // 날짜가 선택되었는지 확인
  const isSelected = useCallback(
    (day: number): boolean => getDateString(day) === displaySelectedDate,
    [displaySelectedDate, getDateString]
  );

  // 선택 가능한 날짜인지 확인
  const isAvailable = useCallback(
    (day: number): boolean => {
      const dateStr = getDateString(day);
      // 최소 날짜보다 이전이면 선택 불가
      if (dateStr < minimumDate) return false;
      // availableDates가 지정되어 있으면 해당 목록에 있어야 선택 가능
      if (availableDates) {
        return availableDates.includes(dateStr);
      }
      return true;
    },
    [getDateString, minimumDate, availableDates]
  );

  // 날짜 클릭 핸들러 (임시 선택만)
  const handleDateClick = (day: number) => {
    if (!isAvailable(day)) return;
    setTempSelectedDate(getDateString(day));
  };

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    if (displaySelectedDate) {
      onDateSelect(displaySelectedDate);
    }
    setTempSelectedDate(null);
    onClose();
  };

  // 바텀시트 닫을 때 임시 선택 초기화
  const handleClose = () => {
    setTempSelectedDate(null);
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

  useEffect(() => {
    if (!isOpen || !onMonthChange) return;
    onMonthChange(currentYear, currentMonth);
  }, [currentYear, currentMonth, isOpen, onMonthChange]);

  return (
    <BaseBottomSheet isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="w-full select-none">
        {/* 월 네비게이션 */}
        <CalendarNavigation
          year={currentYear}
          month={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          className="py-2"
        />

        {/* 요일 헤더 */}
        <div className="mb-2 grid grid-cols-7 place-items-center">
          {WEEKDAYS.map((weekday) => (
            <div key={weekday} className="flex size-8 items-center justify-center">
              <span className="text-body-2-regular text-gray-600">{weekday}</span>
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 place-items-center gap-y-3">
          {calendarDays.map((day, index) => (
            <div key={index} className="flex size-8 items-center justify-center">
              {day !== null ? (
                <button
                  type="button"
                  onClick={() => handleDateClick(day)}
                  disabled={!isAvailable(day)}
                  className={`flex size-8 items-center justify-center rounded-full text-calendar-day transition-colors ${
                    isSelected(day)
                      ? 'bg-purple-500 text-white'
                      : !isAvailable(day)
                        ? 'cursor-not-allowed text-gray-400'
                        : 'cursor-pointer text-gray-950 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ) : (
                <div className="size-8" />
              )}
            </div>
          ))}
        </div>

        {/* 확인 버튼 - safe area 처리 */}
        <div className="mt-6 pb-[env(safe-area-inset-bottom)]">
          <button
            type="button"
            onClick={handleConfirm}
            className="h-[49px] w-full cursor-pointer rounded-full bg-gray-900 text-body-2-medium text-white"
          >
            확인
          </button>
        </div>
      </div>
    </BaseBottomSheet>
  );
}
