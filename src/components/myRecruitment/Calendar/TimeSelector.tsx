'use client';

import { useState, useCallback } from 'react';
import CheckSmallIcon from '@/public/icons/myRecruitment/form/check-small.svg';
import ArrowDownIcon from '@/public/icons/common/arrow-down.svg';

interface TimeSelectorProps {
  selectedTimes: string[]; // ["09:00", "14:30"]
  onTimeToggle: (time: string) => void;
  applyToAll?: boolean;
  onApplyToAllChange?: (apply: boolean) => void;
}

// 오전 시간 (08:00 ~ 11:30)
const AM_TIMES = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
] as const;

// 오후 시간 (12:00 ~ 22:00)
const PM_TIMES = [
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
] as const;

export default function TimeSelector({
  selectedTimes,
  onTimeToggle,
  applyToAll = false,
  onApplyToAllChange,
}: TimeSelectorProps) {
  const [isAmExpanded, setIsAmExpanded] = useState(true);
  const [isPmExpanded, setIsPmExpanded] = useState(true);

  const isSelected = useCallback(
    (time: string): boolean => {
      return selectedTimes.includes(time);
    },
    [selectedTimes]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 일괄 설정 체크박스 */}
      <button
        type="button"
        onClick={() => onApplyToAllChange?.(!applyToAll)}
        className="flex cursor-pointer items-center gap-2"
      >
        <div
          className={`flex size-6 items-center justify-center rounded-md ${
            applyToAll ? 'bg-purple-500' : 'bg-gray-200'
          }`}
        >
          <CheckSmallIcon className={applyToAll ? 'text-white' : 'text-gray-500'} />
        </div>
        <span className="text-body-2-regular text-gray-900">해당 시간으로 일괄 설정</span>
      </button>

      {/* 오전 섹션 */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setIsAmExpanded(!isAmExpanded)}
          className="flex cursor-pointer items-center justify-between"
        >
          <span className="text-body-2-regular text-gray-900">오전</span>
          <ArrowDownIcon
            className={`h-[9px] w-4 transition-transform ${isAmExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {isAmExpanded && (
          <div className="grid grid-cols-4 gap-[10px]">
            {AM_TIMES.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onTimeToggle(time)}
                className={`flex h-[39px] cursor-pointer items-center justify-center rounded-[10px] text-[14px] leading-[1.5] tracking-[-0.28px] transition-colors ${
                  isSelected(time)
                    ? 'bg-purple-500 text-white'
                    : 'border border-gray-400 bg-white text-gray-900'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 오후 섹션 */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setIsPmExpanded(!isPmExpanded)}
          className="flex cursor-pointer items-center justify-between"
        >
          <span className="text-body-2-regular text-gray-900">오후</span>
          <ArrowDownIcon
            className={`h-[9px] w-4 transition-transform ${isPmExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {isPmExpanded && (
          <div className="grid grid-cols-4 gap-[10px]">
            {PM_TIMES.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onTimeToggle(time)}
                className={`flex h-[39px] cursor-pointer items-center justify-center rounded-[10px] text-[14px] leading-[1.5] tracking-[-0.28px] transition-colors ${
                  isSelected(time)
                    ? 'bg-purple-500 text-white'
                    : 'border border-gray-400 bg-white text-gray-900'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
