'use client';

import type { NotificationType } from '@/src/types';

/** 필터 아이템 타입 */
interface FilterItem {
  /** 필터 코드 (undefined = 전체) */
  code: NotificationType | undefined;
  /** 필터 라벨 */
  label: string;
}

/** 필터 목록 */
const FILTER_ITEMS: FilterItem[] = [
  { code: undefined, label: '전체' },
  { code: 'RESERVATION', label: '예약' },
  { code: 'SCHEDULE', label: '일정' },
  { code: 'REVIEW', label: '리뷰' },
  { code: 'CHATTING', label: '채팅' },
];

interface NotificationFilterProps {
  /** 선택된 필터 (undefined = 전체) */
  selectedFilter: NotificationType | undefined;
  /** 필터 변경 핸들러 */
  onFilterChange: (filter: NotificationType | undefined) => void;
}

/**
 * 알림 필터 칩 컴포넌트
 * - 전체/예약/일정/리뷰/채팅 필터
 * - 선택된 필터는 진한 배경색
 */
export default function NotificationFilter({
  selectedFilter,
  onFilterChange,
}: NotificationFilterProps) {
  return (
    <div className="scrollbar-hide flex gap-1.5 overflow-x-auto px-4 py-1">
      {FILTER_ITEMS.map((item) => {
        const isActive = selectedFilter === item.code;
        return (
          <button
            key={item.code ?? 'all'}
            type="button"
            onClick={() => onFilterChange(item.code)}
            className={`text-body-2-medium shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 transition-colors ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'border border-gray-300 text-gray-600'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
