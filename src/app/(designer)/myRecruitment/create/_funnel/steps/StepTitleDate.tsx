'use client';

import { useState } from 'react';
import Image from 'next/image';
import MonthCalendar from '@/src/components/myRecruitment/Calendar/MonthCalendar';
import TimeSelector from '@/src/components/myRecruitment/Calendar/TimeSelector';
import TitleInput from '@/src/components/myRecruitment/Form/TitleInput';
import { useRecruitmentFormStore } from '@/src/stores/myRecruitment/useRecruitmentFormStore';
import { isStep1Valid } from '@/src/utils/myRecruitment';

interface StepTitleDateProps {
  goNext: () => void;
  goPrev: () => void;
  isEdit?: boolean;
}

export default function StepTitleDate({ goNext, goPrev, isEdit = false }: StepTitleDateProps) {
  // 현재 표시 중인 월
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);

  // 현재 포커스된 날짜 (시간 선택 중인 날짜)
  const [focusedDate, setFocusedDate] = useState<string | null>(null);

  // Zustand store
  const {
    title,
    setTitle,
    selectedDates,
    toggleDate,
    addDates,
    selectedTimes,
    toggleTimeForDate,
    applyTimesToAll,
    setApplyTimesToAll,
    applyFocusedDateTimesToAll,
  } = useRecruitmentFormStore();

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

  // 다음 버튼 활성화 조건: 제목 입력 + 날짜 선택 + 모든 날짜에 시간 선택
  const isNextButtonEnabled = isStep1Valid({ title, selectedDates, selectedTimes });

  return (
    <div className="flex min-h-screen flex-col bg-white pt-[env(safe-area-inset-top)]">
      {/* 헤더 영역 */}
      <div className="flex h-[51px] items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={goPrev}
          className="flex size-6 cursor-pointer items-center justify-center"
        >
          <Image src="/icons/common/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="text-head-4-medium text-black">{isEdit ? '모집글 수정' : '모집글 등록'}</h1>
        <div className="size-6" /> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 space-y-6 p-4 pb-24">
        {/* TitleInput */}
        <TitleInput value={title} onChange={setTitle} />

        {/* MonthCalendar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="text-body-1-semibold text-gray-900">날짜 및 시간</span>
            <span className="text-head-3-semibold text-purple-500">*</span>
          </div>
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

        {/* TimeSelector - 포커스된 날짜가 있을 때만 표시 */}
        {focusedDate && (
          <TimeSelector
            selectedTimes={selectedTimes[focusedDate] || []}
            onTimeToggle={(time) => {
              toggleTimeForDate(focusedDate, time);
              // 일괄 설정이 켜져 있으면 현재 포커스 날짜 기준으로 모든 날짜에 적용
              if (applyTimesToAll) {
                applyFocusedDateTimesToAll(focusedDate);
              }
            }}
            applyToAll={applyTimesToAll}
            onApplyToAllChange={(apply) => {
              setApplyTimesToAll(apply);
              if (apply) {
                // 현재 포커스된 날짜의 시간을 기준으로 일괄 적용
                applyFocusedDateTimesToAll(focusedDate);
              }
            }}
          />
        )}
      </div>

      {/* 하단 다음 버튼 (Fixed) */}
      <div className="fixed bottom-0 left-1/2 z-10 w-full -translate-x-1/2 bg-white px-4 pt-3 pb-[calc(4px+env(safe-area-inset-bottom))] sm:w-[375px]">
        <button
          type="button"
          onClick={goNext}
          disabled={!isNextButtonEnabled}
          className={`text-body-1-semibold h-14 w-full rounded-full ${
            isNextButtonEnabled
              ? 'cursor-pointer bg-gray-900 text-white'
              : 'cursor-not-allowed bg-gray-200 text-gray-600'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
