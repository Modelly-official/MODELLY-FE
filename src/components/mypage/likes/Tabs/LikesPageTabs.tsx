'use client';

export type LikesTabType = 'designer' | 'recruitment';

interface LikesPageTabsProps {
  activeTab: LikesTabType;
  onTabChange: (tab: LikesTabType) => void;
}

const LIKES_TABS: { value: LikesTabType; label: string }[] = [
  { value: 'designer', label: '디자이너' },
  { value: 'recruitment', label: '공고' },
];

export default function LikesPageTabs({ activeTab, onTabChange }: LikesPageTabsProps) {
  return (
    <div className="bg-white px-4">
      <div className="flex w-full border-b border-gray-400">
        {LIKES_TABS.map((tab) => {
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
