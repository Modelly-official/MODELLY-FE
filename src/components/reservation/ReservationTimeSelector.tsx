'use client';

import { useState, useCallback, useMemo } from 'react';
import ChevronUpIcon from '@/public/icons/reservation/chevron-up.svg';
import { isToday, getCurrentTimeString } from '@/src/components/common/Calendar/calendarUtils';
import type { TimeSlot } from '@/src/types';

interface ReservationTimeSelectorProps {
  timeSlots: TimeSlot[]; // API에서 받아온 시간대 목록
  selectedDate: string; // 선택된 날짜 (YYYY-MM-DD)
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export default function ReservationTimeSelector({
  timeSlots,
  selectedDate,
  selectedTime,
  onTimeSelect,
}: ReservationTimeSelectorProps) {
  const [isAmExpanded, setIsAmExpanded] = useState(true);
  const [isPmExpanded, setIsPmExpanded] = useState(true);

  // 매 슬롯마다 Date 생성하지 않도록 컴포넌트 레벨에서 계산
  const isTodaySelected = isToday(selectedDate);
  const currentTime = isTodaySelected ? getCurrentTimeString() : '';

  // 오전/오후 시간대 분리
  const { amSlots, pmSlots } = useMemo(() => {
    const am: TimeSlot[] = [];
    const pm: TimeSlot[] = [];

    timeSlots.forEach((slot) => {
      const hour = parseInt(slot.startTime.split(':')[0], 10);
      if (hour < 12) {
        am.push(slot);
      } else {
        pm.push(slot);
      }
    });

    return { amSlots: am, pmSlots: pm };
  }, [timeSlots]);

  // 시간 선택 여부 확인
  const isSelected = useCallback(
    (time: string): boolean => {
      return selectedTime === time;
    },
    [selectedTime]
  );

  // 시간 클릭 핸들러
  const handleTimeClick = (slot: TimeSlot) => {
    const isPastTime = isTodaySelected && slot.startTime <= currentTime;
    if (slot.isReserved || isPastTime) return;
    onTimeSelect(slot.startTime);
  };

  // 시간 버튼 렌더링
  const renderTimeButton = (slot: TimeSlot) => {
    const selected = isSelected(slot.startTime);
    const isPastTime = isTodaySelected && slot.startTime <= currentTime;
    const disabled = slot.isReserved || isPastTime;

    return (
      <button
        key={slot.startTime}
        type="button"
        onClick={() => handleTimeClick(slot)}
        disabled={disabled}
        className={`flex h-[39px] items-center justify-center rounded-[10px] text-[14px] leading-[1.5] tracking-[-0.28px] transition-colors ${
          selected
            ? 'bg-purple-500 text-white'
            : disabled
              ? 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
              : 'cursor-pointer border border-gray-400 bg-white text-gray-900 hover:border-purple-300 hover:bg-purple-50'
        }`}
      >
        {slot.startTime}
      </button>
    );
  };

  // 시간대가 없는 경우
  if (timeSlots.length === 0) {
    return (
      <div className="flex min-h-20 items-center justify-center px-4">
        <p className="text-center text-body-2-regular text-gray-500">
          {isTodaySelected
            ? '오늘은 예약 가능한 시간이 모두 지났습니다. 다른 날짜를 선택해 주세요.'
            : '해당 날짜에 예약 가능한 시간이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 오전 섹션 */}
      {amSlots.length > 0 && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setIsAmExpanded(!isAmExpanded)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span className="text-body-2-medium text-gray-900">오전</span>
            <ChevronUpIcon
              className={`size-5 transition-transform ${isAmExpanded ? '' : 'rotate-180'}`}
            />
          </button>

          {isAmExpanded && (
            <div className="grid grid-cols-4 gap-[10px]">{amSlots.map(renderTimeButton)}</div>
          )}
        </div>
      )}

      {/* 오후 섹션 */}
      {pmSlots.length > 0 && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setIsPmExpanded(!isPmExpanded)}
            className="flex cursor-pointer items-center justify-between"
          >
            <span className="text-body-2-medium text-gray-900">오후</span>
            <ChevronUpIcon
              className={`size-5 transition-transform ${isPmExpanded ? '' : 'rotate-180'}`}
            />
          </button>

          {isPmExpanded && (
            <div className="grid grid-cols-4 gap-[10px]">{pmSlots.map(renderTimeButton)}</div>
          )}
        </div>
      )}
    </div>
  );
}
