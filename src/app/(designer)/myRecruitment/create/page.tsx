'use client';

import { useState } from 'react';
import MonthCalendar from '@/src/components/myRecruitment/Calendar/MonthCalendar';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';

/**
 * 공고 등록 페이지 - 컴포넌트 개발 중
 * 각 컴포넌트가 완성될 때마다 여기에 추가하여 UI 확인
 */
export default function CreateRecruitmentPage() {
  // 현재 표시 중인 월
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);

  // 현재 포커스된 날짜 (시간 선택 중인 날짜)
  const [focusedDate, setFocusedDate] = useState<string | null>(null);

  // Zustand store
  const { selectedDates, toggleDate, addDates } = useRecruitmentFormStore();

  // 날짜 추가 시 첫 번째 날짜로 자동 포커스 설정
  const handleDatesSelect = (dates: string[]) => {
    addDates(dates);
    // 포커스가 없으면 첫 번째 추가된 날짜로 포커스 설정
    if (!focusedDate) {
      const sortedDates = [...dates].sort();
      setFocusedDate(sortedDates[0]);
    }
  };

  // 날짜 토글 시 포커스 업데이트
  const handleDateToggle = (date: string) => {
    toggleDate(date);
    // 삭제된 날짜가 현재 포커스된 날짜면 다음 날짜로 포커스 이동
    if (focusedDate === date) {
      const remainingDates = selectedDates.filter((d) => d !== date);
      setFocusedDate(remainingDates.length > 0 ? remainingDates[0] : null);
    }
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 영역 */}
      <div className="flex h-14 items-center justify-center border-b border-gray-200">
        <h1 className="text-head-4-semibold text-gray-900">모집글 등록</h1>
      </div>

      {/* 컴포넌트 테스트 영역 */}
      <div className="flex-1 space-y-6 p-4">
        {/* MonthCalendar 테스트 */}
        <div>
          <h2 className="text-body-1-semibold mb-2 text-gray-900">날짜 및 시간</h2>
          <MonthCalendar
            year={currentYear}
            month={currentMonth}
            selectedDates={selectedDates}
            focusedDate={focusedDate}
            onDateToggle={handleDateToggle}
            onDatesSelect={handleDatesSelect}
            onFocusedDateChange={setFocusedDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>

        {/* 선택된 날짜 디버그 */}
        <div className="space-y-2 rounded-lg bg-gray-100 p-4">
          <p className="text-body-2-medium text-gray-700">
            선택된 날짜: {selectedDates.length > 0 ? selectedDates.join(', ') : '없음'}
          </p>
          <p className="text-body-2-medium text-gray-700">포커스된 날짜: {focusedDate ?? '없음'}</p>
        </div>
      </div>
    </div>
  );
}
