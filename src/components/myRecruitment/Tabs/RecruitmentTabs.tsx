'use client';

export type RecruitmentTabType = 'active' | 'closed';

interface RecruitmentTabsProps {
  activeTab: RecruitmentTabType;
  onTabChange: (tab: RecruitmentTabType) => void;
  activeCount?: number;
}

export default function RecruitmentTabs({
  activeTab,
  onTabChange,
  activeCount,
}: RecruitmentTabsProps) {
  const tabs: { value: RecruitmentTabType; label: string }[] = [
    { value: 'active', label: activeCount !== undefined ? `모집중 (${activeCount})` : '모집중' },
    { value: 'closed', label: '마감' },
  ];

  return (
    <div className="flex gap-4 border-b border-gray-300 px-5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`cursor-pointer px-0.5 py-2 ${
              isActive
                ? 'border-b-2 border-gray-900 text-body-1-semibold text-gray-900'
                : 'text-body-1-medium text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
