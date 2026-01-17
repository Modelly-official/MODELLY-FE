'use client';

import type { ReservationListType } from '@/src/types';
import { RESERVATION_TABS } from '@/src/constants';

interface ReservationTabsProps {
  activeTab: ReservationListType;
  onTabChange: (tab: ReservationListType) => void;
  role?: 'model' | 'designer';
}

export default function ReservationTabs({ activeTab, onTabChange, role }: ReservationTabsProps) {
  // 디자이너는 PENDING 탭 제외 (대기중 예약은 별도 페이지에서 관리)
  const tabs =
    role === 'designer' ? RESERVATION_TABS.filter((tab) => tab.value !== 'PENDING') : RESERVATION_TABS;

  return (
    <div className="bg-white px-4">
      <div className="flex w-full border-b border-gray-400">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={`flex h-[52px] flex-1 cursor-pointer items-center justify-center p-2.5 ${
                isActive
                  ? 'border-b-2 border-gray-800 text-body-1-semibold text-gray-900'
                  : 'text-body-1-medium text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
