'use client';

import type { ReviewTabType } from '@/src/types';
import { REVIEW_TABS } from '@/src/constants';

interface ReviewTabsProps {
  activeTab: ReviewTabType;
  onTabChange: (tab: ReviewTabType) => void;
  unreviewedCount?: number;
}

export default function ReviewTabs({
  activeTab,
  onTabChange,
  unreviewedCount,
}: ReviewTabsProps) {
  return (
    <div className="bg-white px-4">
      <div className="flex w-full border-b border-gray-400">
        {REVIEW_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          // 리뷰 미작성 일정 탭에만 개수 표시
          const showCount = tab.value === 'unreviewed' && unreviewedCount !== undefined;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={`flex h-[52px] flex-1 cursor-pointer items-center justify-center gap-1 p-2.5 ${
                isActive
                  ? 'border-b-2 border-gray-800 text-body-1-semibold text-gray-900'
                  : 'text-body-1-medium text-gray-600'
              }`}
            >
              {tab.label}
              {showCount && (
                <span className={isActive ? 'text-body-1-semibold text-purple-500' : 'text-body-1-medium text-purple-500'}>
                  {unreviewedCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
